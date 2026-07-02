import { useRef, useEffect, useState } from "react";
import { startVelocity, getVelocity } from "../../lib/scrollVelocity.js";

// ────────────────────────────────────────────────────────────────
// WebGL görsel distortion (shader).
// - Hover'da RGB kayması + dalga bozulması + imleç dalgacığı
// - Scroll HIZINA göre sıvı gibi akar (getVelocity)
// SSR + no-JS + WebGL yoksa: sade <img> gösterir (SEO/erişilebilirlik güvenli).
// ────────────────────────────────────────────────────────────────

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2  uCover;   // cover için uv ölçeği
uniform float uHover;   // 0..1
uniform float uVel;     // scroll hızı (işaretli)
uniform vec2  uMouse;   // 0..1 imleç
uniform float uTime;

void main() {
  vec2 uv = (vUv - 0.5) * uCover + 0.5;
  float vel = clamp(uVel, -1.5, 1.5);
  float av = abs(vel);

  // Dalga bozulması — hover + scroll hızı ile büyür
  float amp = 0.012 * uHover + 0.05 * av;
  uv.x += sin(uv.y * 9.0 + uTime * 2.0) * amp;
  uv.y += cos(uv.x * 7.0 + uTime * 1.6) * amp * 0.65;

  // Dikey esneme (scroll hızıyla "gerilme")
  uv.y += (uv.y - 0.5) * vel * 0.06;

  // İmleç dalgacığı (yalnız hover)
  float d = distance(uv, uMouse);
  uv += (sin(d * 26.0 - uTime * 4.0) * 0.006 * uHover) * smoothstep(0.55, 0.0, d);

  // RGB kayması
  float split = 0.004 + 0.006 * uHover + 0.03 * av;
  vec2 dir = vec2(1.0, 0.35);
  float r = texture2D(uTex, uv + dir * split).r;
  float g = texture2D(uTex, uv).g;
  float b = texture2D(uTex, uv - dir * split).b;
  vec3 col = vec3(r, g, b);

  // Hover'da hafif parlaklık + kontrast
  col += col * uHover * 0.10;

  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("shader:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function DistortImage({ src, alt = "", className = "", imgClassName = "" }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [glReady, setGlReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    startVelocity();

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const gl =
      canvas.getContext("webgl", { antialias: true, premultipliedAlpha: false }) ||
      canvas.getContext("experimental-webgl");
    if (!gl) return; // fallback <img> kalır

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // Tam ekran quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = {
      tex: gl.getUniformLocation(prog, "uTex"),
      cover: gl.getUniformLocation(prog, "uCover"),
      hover: gl.getUniformLocation(prog, "uHover"),
      vel: gl.getUniformLocation(prog, "uVel"),
      mouse: gl.getUniformLocation(prog, "uMouse"),
      time: gl.getUniformLocation(prog, "uTime"),
    };

    // Texture (yüklenene kadar 1x1 gri)
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([20, 20, 26, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(U.tex, 0);
    gl.uniform2f(U.cover, 1, 1);

    let imgAspect = 1;
    let hasTex = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      imgAspect = image.naturalWidth / image.naturalHeight;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      hasTex = true;
      setGlReady(true);
      resize();
    };
    image.src = src;

    // Boyut + cover hesabı
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      const w = wrap.clientWidth || 1;
      const h = wrap.clientHeight || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const ca = w / h;
      let sx = 1, sy = 1;
      if (imgAspect > ca) sx = ca / imgAspect;
      else sy = imgAspect / ca;
      gl.uniform2f(U.cover, sx, sy);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Etkileşim durumu
    let hoverTarget = 0;
    let hover = 0;
    const mouse = { x: 0.5, y: 0.5 };
    const onEnter = () => (hoverTarget = 1);
    const onLeave = () => (hoverTarget = 0);
    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = 1 - (e.clientY - r.top) / r.height;
    };
    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointermove", onMove);

    // Görünürlük (offscreen'de rAF durur)
    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) raf = requestAnimationFrame(render);
      },
      { rootMargin: "10% 0px" }
    );
    io.observe(wrap);

    const start = performance.now();
    let raf = 0;
    function render(now) {
      hover += (hoverTarget - hover) * 0.12;
      const vel = getVelocity();
      gl.uniform1f(U.time, (now - start) / 1000);
      gl.uniform1f(U.hover, hover);
      gl.uniform1f(U.vel, vel);
      gl.uniform2f(U.mouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      // Hareket varsa dönmeye devam; tamamen durgunsa da hafif idle için sür.
      if (visible) raf = requestAnimationFrame(render);
    }
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointermove", onMove);
      gl.deleteTexture(tex);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [src]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      {/* SSR + fallback + WebGL hazır olana kadar görünen katman */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          glReady ? "opacity-0" : "opacity-100"
        } ${imgClassName}`}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
          glReady ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
