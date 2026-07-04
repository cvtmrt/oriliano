import { useEffect, useRef } from "react";

// Gerçek 3D sahne (three.js, lazy-load) — nefes alan sıvı-cam blob:
// simplex noise ile sürekli şekil değiştirir, kenarları fresnel ile marka
// renklerinde (kobalt→mor→turuncu) parlar. Etrafında yörüngede parçacık
// alanı + iki eğik neon halka. Fare ile derinlikli döner; `active` bölüm
// indeksine göre `states` listesindeki hedefe süzülür. Tek sahnede sabit
// kullanım için `states` prop'una tek elemanlı liste ver (bkz. Hero).
// Sekme gizlenince / ekrandan çıkınca / tamamen sönünce rAF durur.
// WebGL yoksa veya reduced-motion açıksa sessizce CSS atmosfere düşer.

// Bölüm başına hedef durum: x/y (dünya birimi), s (ölçek), o (opaklık).
// Showcase STATES ile aynı sırada: hero, işler, vaka, hizmet, stack,
// süreç, kanıt, iletişim.
const SCENE_STATES = [
  { x: 1.05, y: 0.05, s: 0.9, o: 1 }, // hero: merkez-sağ, yıldız
  { x: 2.2, y: 0.2, s: 0.6, o: 0.7 }, // işler: kenara süzülür
  { x: 2.6, y: 0.5, s: 0.45, o: 0.5 }, // vaka zoom: yoldan çekilir
  { x: 2.1, y: -0.3, s: 0.65, o: 0.75 }, // hizmet: katmanların altında
  { x: 2.0, y: 0.3, s: 0.8, o: 0.85 }, // stack: glow sahnesiyle parlar
  { x: 2.3, y: 0.2, s: 0.5, o: 0.5 }, // süreç: küçülen mockup'ın arkasında
  { x: 2.2, y: -0.2, s: 0.7, o: 0.8 }, // kanıt: readout eşliği
  { x: 1.4, y: 0.0, s: 0.95, o: 1 }, // iletişim: final, geri büyür
];

const VERT = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vView;

// Ashima Arts 3D simplex noise (MIT) — webgl-noise
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p){
  return snoise(p) + 0.45 * snoise(p * 2.1 + 7.3);
}

vec3 deform(vec3 p){
  vec3 n = normalize(p);
  float d = fbm(n * uFreq + vec3(0.0, uTime * 0.26, uTime * 0.11));
  return p + n * d * uAmp;
}

void main(){
  vec3 pos = deform(position);
  // Normali komşu iki nokta ile (tanjant düzleminde) yeniden hesapla —
  // deformasyon sonrası fresnel'in doğru parlaması için şart.
  vec3 n0 = normalize(position);
  vec3 t = normalize(cross(n0, abs(n0.y) < 0.99 ? vec3(0.0,1.0,0.0) : vec3(1.0,0.0,0.0)));
  vec3 b = cross(n0, t);
  float e = 0.12;
  vec3 p1 = deform(position + t * e);
  vec3 p2 = deform(position + b * e);
  vNormal = normalMatrix * normalize(cross(p1 - pos, p2 - pos));
  vNoise = fbm(n0 * uFreq + vec3(0.0, uTime * 0.26, uTime * 0.11));
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uColC;
uniform float uOp;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vView;

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float fres = pow(1.0 - abs(dot(N, V)), 2.0);
  float band = smoothstep(-0.7, 0.9, vNoise);
  vec3 rim = mix(uColA, uColB, band);
  rim = mix(rim, uColC, smoothstep(0.6, 1.0, band) * 0.55);
  // İç: koyu cam (öndeki metin kontrastını korur) · kenar: neon rim
  vec3 core = mix(vec3(0.028, 0.028, 0.07), uColB * 0.16, band * 0.45);
  vec3 col = core + rim * fres * 1.7;
  // Tepeden inen sahne spotunun yüzeydeki parlaması
  col += vec3(0.9, 0.94, 1.0) * pow(max(N.y, 0.0), 3.0) * 0.12;
  float alpha = (0.72 + fres * 0.28) * uOp;
  gl_FragColor = vec4(col, alpha);
}
`;

const P_VERT = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute float aMix;
uniform float uTime;
varying float vTw;
varying float vMix;

void main(){
  float a = uTime * 0.05 + aPhase * 0.6;
  float c = cos(a), s = sin(a);
  vec3 p = vec3(c * position.x + s * position.z,
                position.y + sin(uTime * 0.4 + aPhase * 6.2831) * 0.14,
                -s * position.x + c * position.z);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = aSize * (26.0 / -mv.z);
  vTw = 0.5 + 0.5 * sin(uTime * (0.5 + aPhase) + aPhase * 12.0);
  vMix = aMix;
  gl_Position = projectionMatrix * mv;
}
`;

const P_FRAG = /* glsl */ `
precision mediump float;
uniform vec3 uColA;
uniform vec3 uColC;
uniform float uOp;
varying float vTw;
varying float vMix;

void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d) * vTw * uOp;
  if (a < 0.01) discard;
  gl_FragColor = vec4(mix(uColA, uColC, vMix), a);
}
`;

export function HeroScene({ active = 0, states = SCENE_STATES }) {
  const statesRef = useRef(states);
  statesRef.current = states;
  const hostRef = useRef(null);
  const activeRef = useRef(active);
  const pokeRef = useRef(null);

  // Bölüm değişince hedefi güncelle, uyuyan döngüyü uyandır.
  useEffect(() => {
    activeRef.current = active;
    pokeRef.current?.();
  }, [active]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        return; // WebGL yok — CSS atmosfer yeter
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 30);
      camera.position.set(0, 0, 6);

      const group = new THREE.Group();
      scene.add(group);

      const colA = new THREE.Color("#2742FF");
      const colB = new THREE.Color("#7A5BFF");
      const colC = new THREE.Color("#FF5B34");

      // Sıvı blob
      // Detay 6 (~41k vertex) — silüet pürüzsüz; GPU'da vertex maliyeti önemsiz.
      const blobGeo = new THREE.IcosahedronGeometry(1.38, coarse ? 5 : 6);
      const blobMat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: 0.2 },
          uFreq: { value: 1.05 },
          uOp: { value: 1 },
          uColA: { value: colA },
          uColB: { value: colB },
          uColC: { value: colC },
        },
      });
      const blob = new THREE.Mesh(blobGeo, blobMat);
      group.add(blob);

      // Neon jiroskop halkaları
      const ringGeo = new THREE.TorusGeometry(2.15, 0.006, 8, 160);
      const ringMatA = new THREE.MeshBasicMaterial({
        color: colB, transparent: true, opacity: 0.35,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const ringMatB = ringMatA.clone();
      ringMatB.color = colC;
      ringMatB.opacity = 0.22;
      const ringA = new THREE.Mesh(ringGeo, ringMatA);
      const ringB = new THREE.Mesh(ringGeo, ringMatB);
      ringA.rotation.set(1.25, 0.35, 0);
      ringB.rotation.set(-1.05, -0.5, 0.4);
      ringB.scale.setScalar(1.14);
      group.add(ringA, ringB);

      // Yörünge parçacıkları
      const COUNT = coarse ? 130 : 240;
      const pos = new Float32Array(COUNT * 3);
      const size = new Float32Array(COUNT);
      const phase = new Float32Array(COUNT);
      const mixArr = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        // Blob çevresinde kabuk (r: 1.9–3.4), kutuplara yığılmadan
        const r = 1.9 + Math.random() * 1.5;
        const th = Math.random() * Math.PI * 2;
        const y = (Math.random() * 2 - 1) * 0.9;
        pos[i * 3] = Math.cos(th) * r;
        pos[i * 3 + 1] = y * (1 + Math.random());
        pos[i * 3 + 2] = Math.sin(th) * r;
        size[i] = 1.5 + Math.random() * 3.5;
        phase[i] = Math.random();
        mixArr[i] = Math.random();
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      pGeo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
      pGeo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
      pGeo.setAttribute("aMix", new THREE.BufferAttribute(mixArr, 1));
      const pMat = new THREE.ShaderMaterial({
        vertexShader: P_VERT,
        fragmentShader: P_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uOp: { value: 1 },
          uColA: { value: new THREE.Color("#8FA0FF") },
          uColC: { value: new THREE.Color("#FF8A66") },
        },
      });
      const points = new THREE.Points(pGeo, pMat);
      group.add(points);

      // Hedef durum: masaüstünde bölüm bazlı; mobilde yalnız hero
      // (merkezde), sonraki bölümlerde tamamen söner → rAF da durur.
      let fit = 1;
      let xFactor = 1;
      const target = () => {
        const list = statesRef.current;
        const st = list[Math.min(activeRef.current, list.length - 1)] || list[0];
        if (coarse) {
          // Mobil: blob başlığın altında, beyaz paragraf/CTA bölgesinin
          // arkasında durur (mavi serif satırla çakışıp kontrastı düşürmesin).
          return activeRef.current === 0 ? { x: 0, y: -0.35, s: 0.85, o: 0.9 } : { x: 0, y: -0.35, s: 0.85, o: 0 };
        }
        return { x: st.x * xFactor, y: st.y, s: st.s, o: st.o };
      };
      // Anlık (lerplenen) değerler
      const cur = { ...target() };

      const resize = () => {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        fit = Math.min(1.05, Math.max(0.6, w / 1400));
        // Dar masaüstünde dünya genişliği daralır — x hedefleri içeri çekilir
        xFactor = Math.min(camera.aspect / 1.78, 1.1);
      };
      resize();
      const ro = new ResizeObserver(() => { resize(); pokeRef.current?.(); });
      ro.observe(host);

      // Fare paralaksı (yumuşak lerp)
      let tx = 0, ty = 0;
      const onMove = (e) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 2;
        ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      if (!coarse && !reduced) window.addEventListener("mousemove", onMove, { passive: true });

      // Görünürlük — ekran dışında / sekme gizliyken / sönmüşken rAF durur
      let inView = true;
      let pageVisible = document.visibilityState !== "hidden";
      const io = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        schedule();
      });
      io.observe(host);
      const onVis = () => { pageVisible = document.visibilityState !== "hidden"; schedule(); };
      document.addEventListener("visibilitychange", onVis);

      let raf = 0;
      let running = false;
      let t = 0;
      let last = performance.now();

      const apply = () => {
        group.position.x = cur.x;
        group.position.y = cur.y;
        group.scale.setScalar(fit * cur.s);
        blobMat.uniforms.uOp.value = cur.o;
        pMat.uniforms.uOp.value = cur.o;
        ringMatA.opacity = 0.35 * cur.o;
        ringMatB.opacity = 0.22 * cur.o;
      };

      const frame = (now) => {
        raf = 0;
        if (!running) return;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;

        const tg = target();
        cur.x += (tg.x - cur.x) * 0.045;
        cur.y += (tg.y - cur.y) * 0.045;
        cur.s += (tg.s - cur.s) * 0.045;
        cur.o += (tg.o - cur.o) * 0.06;
        apply();

        blobMat.uniforms.uTime.value = t;
        pMat.uniforms.uTime.value = t;
        blob.rotation.y = t * 0.12;
        ringA.rotation.z = t * 0.16;
        ringB.rotation.z = -t * 0.12;
        // Fareye derinlikli, sıvı takip
        group.rotation.y += (tx * 0.3 - group.rotation.y) * 0.04;
        group.rotation.x += (ty * 0.22 - group.rotation.x) * 0.04;
        camera.position.x += (tx * 0.25 - camera.position.x) * 0.03;
        camera.position.y += (-ty * 0.18 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);

        // Tamamen söndüyse (mobil, hero sonrası) döngüyü uyut
        if (target().o === 0 && cur.o < 0.015) {
          cur.o = 0;
          apply();
          renderer.render(scene, camera);
          running = false;
          return;
        }
        raf = requestAnimationFrame(frame);
      };

      const schedule = () => {
        const shouldRun = inView && pageVisible && !reduced;
        if (shouldRun && !running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(frame);
        } else if (!shouldRun && running) {
          running = false;
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
        }
      };

      if (reduced) {
        // Hareket istemeyene animasyonsuz tek kare; bölüm değişiminde
        // hedefe doğrudan atla ve bir kare daha çiz.
        pokeRef.current = () => {
          Object.assign(cur, target());
          apply();
          blobMat.uniforms.uTime.value = 2.4;
          pMat.uniforms.uTime.value = 2.4;
          renderer.render(scene, camera);
        };
        pokeRef.current();
      } else {
        pokeRef.current = schedule;
        schedule();
      }

      cleanup = () => {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        pokeRef.current = null;
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("mousemove", onMove);
        document.removeEventListener("visibilitychange", onVis);
        blobGeo.dispose(); blobMat.dispose();
        ringGeo.dispose(); ringMatA.dispose(); ringMatB.dispose();
        pGeo.dispose(); pMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0 overflow-hidden" aria-hidden="true" />;
}
