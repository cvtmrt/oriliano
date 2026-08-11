/**
 * Tasarımsal varsayılan görselleri üretir → public/defaults/*.webp
 *
 * Panelden görsel yüklenene kadar sayfalar boş lacivert kutu yerine markaya
 * uygun (lacivert + ince altın çizgi) soyut kompozisyonlar gösterir. Gerçek
 * fotoğraf yüklenince bu görseller kendiliğinden devre dışı kalır.
 *
 * Bir kez elle çalıştırılır, çıktılar repoya commit edilir:
 *   node scripts/generate-default-art.mjs
 *
 * Not: Kasıtlı olarak fotoğraf değil "tasarım grafiği" üretiyoruz — stok insan
 * fotoğrafı ya da temsili büro fotoğrafı yanıltıcı olurdu (müşteri notu:
 * insan fotoğrafı yok, gerçek fotoğraflar sonradan panelden gelecek).
 */
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const OUT = path.join(process.cwd(), 'public', 'defaults')

// Marka paleti — tailwind.config.ts ile birebir aynı
const navy950 = '#0A0F22'
const navy900 = '#101733'
const navy800 = '#16204A'
const navy700 = '#1E2A5E'
const gold = '#A9834B'
const goldLight = '#C9A46A'
const paper = '#F4F2EE'
const paperLine = '#E7E4DE'

/** Koyu hero zemini: dikey lacivert geçiş + sol üstte fark edilmeyen ışıma. */
function darkGround(w, h) {
  return `
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${navy800}"/>
        <stop offset="1" stop-color="${navy950}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.22" cy="0.12" r="0.9">
        <stop offset="0" stop-color="${navy700}" stop-opacity="0.55"/>
        <stop offset="0.55" stop-color="${navy700}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>`
}

/** Alt kenara yakın, ortada yoğunlaşan altın çizgi — sitedeki dille aynı. */
function goldBaseline(w, y) {
  return `
    <defs>
      <linearGradient id="base" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${gold}" stop-opacity="0"/>
        <stop offset="0.3" stop-color="${gold}" stop-opacity="0.9"/>
        <stop offset="0.7" stop-color="${gold}" stop-opacity="0.9"/>
        <stop offset="1" stop-color="${gold}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect x="0" y="${y}" width="${w}" height="2" fill="url(#base)"/>`
}

const compositions = {
  // ------------------------------------------------ Anasayfa tanıtım (açık)
  // Sayfanın açık zemininde çerçeveli duran editoryal bir kompozisyon.
  'home.intro.image': {
    w: 1500,
    h: 1200,
    svg: (w, h) => `
      <rect width="${w}" height="${h}" fill="${paper}"/>
      <rect x="70" y="70" width="${w - 140}" height="${h - 140}" fill="none" stroke="${navy800}" stroke-width="2"/>
      <rect x="94" y="94" width="${w - 188}" height="${h - 188}" fill="none" stroke="${paperLine}" stroke-width="2"/>
      <!-- Sağ üstten inen büyük altın çeyrek yay -->
      <path d="M ${w - 94} 400 A 520 520 0 0 0 700 94" fill="none" stroke="${gold}" stroke-width="3"/>
      <path d="M ${w - 94} 480 A 600 600 0 0 0 620 94" fill="none" stroke="${gold}" stroke-width="1.5" opacity="0.45"/>
      <!-- Sol altta lacivert blok + altın nokta -->
      <rect x="180" y="${h - 420}" width="300" height="230" fill="${navy900}"/>
      <rect x="210" y="${h - 390}" width="300" height="230" fill="none" stroke="${navy800}" stroke-width="2"/>
      <circle cx="180" cy="${h - 420}" r="10" fill="${gold}"/>
      <!-- Sağ altta metin satırlarını andıran ince çizgiler -->
      <g stroke="${navy800}" stroke-width="2" opacity="0.5">
        <line x1="640" y1="${h - 330}" x2="${w - 180}" y2="${h - 330}"/>
        <line x1="640" y1="${h - 282}" x2="${w - 260}" y2="${h - 282}"/>
        <line x1="640" y1="${h - 234}" x2="${w - 340}" y2="${h - 234}"/>
      </g>`,
  },

  // ------------------------------------------- Anasayfa CTA arka planı (koyu)
  // Üzerine %85 lacivert örtü biniyor; sadece hissedilen bir doku yeterli.
  'home.cta.background': {
    w: 1920,
    h: 800,
    svg: (w, h) => `
      ${darkGround(w, h)}
      <g stroke="#FFFFFF" stroke-width="1" opacity="0.10">
        ${Array.from({ length: 26 }, (_, i) => {
          const x = -200 + i * 100
          return `<line x1="${x}" y1="${h + 40}" x2="${x + 500}" y2="-40"/>`
        }).join('')}
      </g>
      <circle cx="${w - 260}" cy="140" r="300" fill="none" stroke="${gold}" stroke-width="1.5" opacity="0.5"/>
      <circle cx="${w - 260}" cy="140" r="380" fill="none" stroke="${gold}" stroke-width="1" opacity="0.25"/>`,
  },

  // -------------------------------------------------- Hakkımızda hero (koyu)
  // Sütunlar: köklülük ve düzen. Üzerine %72 örtü bineceği için kontrast yüksek.
  'about.hero.image': {
    w: 1920,
    h: 1080,
    svg: (w, h) => `
      ${darkGround(w, h)}
      <g transform="translate(${w - 840}, 0)">
        ${[0, 1, 2].map((i) => {
          const x = i * 260
          const y = 240 + i * 70
          return `
            <rect x="${x}" y="${y}" width="150" height="${h - y}" fill="${navy800}" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1.5"/>
            <rect x="${x - 24}" y="${y}" width="198" height="26" fill="none" stroke="${i === 1 ? goldLight : '#FFFFFF'}" stroke-opacity="${i === 1 ? 0.9 : 0.25}" stroke-width="2"/>
            <line x1="${x + 30}" y1="${y + 60}" x2="${x + 30}" y2="${h - 40}" stroke="#FFFFFF" stroke-opacity="0.10" stroke-width="1.5"/>
            <line x1="${x + 75}" y1="${y + 60}" x2="${x + 75}" y2="${h - 40}" stroke="#FFFFFF" stroke-opacity="0.10" stroke-width="1.5"/>
            <line x1="${x + 120}" y1="${y + 60}" x2="${x + 120}" y2="${h - 40}" stroke="#FFFFFF" stroke-opacity="0.10" stroke-width="1.5"/>`
        }).join('')}
      </g>
      ${goldBaseline(w, h - 120)}`,
  },

  // ------------------------------------------- Hakkımızda gövde görseli (açık)
  // Kitap sırtları: kütüphane. Sayfanın açık zemininde durur.
  'about.body.image': {
    w: 1500,
    h: 1200,
    svg: (w, h) => {
      const base = h - 220
      const books = [
        { x: 220, bw: 96, bh: 560, fill: navy900 },
        { x: 336, bw: 72, bh: 640, fill: navy700 },
        { x: 428, bw: 110, bh: 500, fill: navy800 },
        { x: 558, bw: 64, bh: 690, fill: navy900 },
        { x: 642, bw: 88, bh: 580, fill: gold },
        { x: 750, bw: 78, bh: 640, fill: navy800 },
        { x: 848, bw: 104, bh: 520, fill: navy700 },
        { x: 972, bw: 70, bh: 610, fill: navy900 },
        { x: 1062, bw: 92, bh: 555, fill: navy800 },
      ]
      return `
        <rect width="${w}" height="${h}" fill="${paper}"/>
        <rect x="70" y="70" width="${w - 140}" height="${h - 140}" fill="none" stroke="${paperLine}" stroke-width="2"/>
        ${books
          .map(
            (b) => `
          <rect x="${b.x}" y="${base - b.bh}" width="${b.bw}" height="${b.bh}" fill="${b.fill}"/>
          <line x1="${b.x + 14}" y1="${base - b.bh + 30}" x2="${b.x + b.bw - 14}" y2="${base - b.bh + 30}" stroke="${b.fill === gold ? navy900 : goldLight}" stroke-width="2" opacity="0.8"/>
          <line x1="${b.x + 14}" y1="${base - 40}" x2="${b.x + b.bw - 14}" y2="${base - 40}" stroke="${b.fill === gold ? navy900 : '#FFFFFF'}" stroke-width="1.5" opacity="0.35"/>`,
          )
          .join('')}
        <line x1="160" y1="${base}" x2="${w - 160}" y2="${base}" stroke="${navy900}" stroke-width="3"/>
        <line x1="160" y1="${base + 14}" x2="${w - 160}" y2="${base + 14}" stroke="${paperLine}" stroke-width="2"/>`
    },
  },

  // ------------------------------------------------- Hizmetler hero (koyu)
  // Modüler ızgara: çalışma alanlarının düzeni.
  'services.hero.image': {
    w: 1920,
    h: 1080,
    svg: (w, h) => {
      const cell = 190
      const gx = w - 4.5 * cell
      const gy = 150
      const cells = []
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const x = gx + c * cell
          const y = gy + r * cell
          const special = (r === 1 && c === 2) || (r === 3 && c === 0)
          cells.push(
            `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="none" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="1.5"/>`,
          )
          if (special)
            cells.push(
              `<rect x="${x + 24}" y="${y + 24}" width="${cell - 48}" height="${cell - 48}" fill="none" stroke="${goldLight}" stroke-opacity="0.9" stroke-width="2"/>
               <circle cx="${x + cell / 2}" cy="${y + cell / 2}" r="7" fill="${gold}"/>`,
            )
          if (r === 2 && c === 1)
            cells.push(`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${navy700}" opacity="0.55"/>`)
        }
      }
      return `${darkGround(w, h)}${cells.join('')}${goldBaseline(w, h - 110)}`
    },
  },

  // ---------------------------------- Avukatlık ve Danışmanlık hero (koyu)
  // Belge satırları + mühür: sözleşme ve temsil.
  'legalServices.hero.image': {
    w: 1920,
    h: 1080,
    svg: (w, h) => `
      ${darkGround(w, h)}
      <g transform="translate(${w - 900}, 170)">
        <rect x="0" y="0" width="640" height="740" fill="${navy900}" stroke="#FFFFFF" stroke-opacity="0.20" stroke-width="1.5"/>
        <g stroke="#FFFFFF" stroke-opacity="0.30" stroke-width="2.5">
          <line x1="70" y1="110" x2="480" y2="110"/>
          <line x1="70" y1="170" x2="570" y2="170"/>
          <line x1="70" y1="230" x2="530" y2="230"/>
          <line x1="70" y1="290" x2="560" y2="290"/>
          <line x1="70" y1="350" x2="430" y2="350"/>
          <line x1="70" y1="410" x2="545" y2="410"/>
          <line x1="70" y1="470" x2="500" y2="470"/>
        </g>
        <path d="M 70 610 C 140 560 180 660 250 600 S 360 570 420 615" fill="none" stroke="${goldLight}" stroke-width="3" opacity="0.95"/>
        <circle cx="520" cy="640" r="74" fill="none" stroke="${gold}" stroke-width="3"/>
        <circle cx="520" cy="640" r="52" fill="none" stroke="${gold}" stroke-width="1.5" opacity="0.7"/>
      </g>
      ${goldBaseline(w, h - 120)}`,
  },

  // ------------------------------------------------ Arabuluculuk hero (koyu)
  // Kesişen iki daire: iki tarafın ortak zemini.
  'mediation.hero.image': {
    w: 1920,
    h: 1080,
    svg: (w, h) => `
      ${darkGround(w, h)}
      <circle cx="${w - 760}" cy="520" r="320" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="2"/>
      <circle cx="${w - 420}" cy="520" r="320" fill="none" stroke="${goldLight}" stroke-opacity="0.95" stroke-width="2.5"/>
      <clipPath id="lensA"><circle cx="${w - 760}" cy="520" r="320"/></clipPath>
      <circle cx="${w - 420}" cy="520" r="320" clip-path="url(#lensA)" fill="${navy700}" opacity="0.5"/>
      <line x1="${w - 590}" y1="120" x2="${w - 590}" y2="920" stroke="${gold}" stroke-width="1.5" opacity="0.5"/>
      ${goldBaseline(w, h - 120)}`,
  },

  // ---------------------------------------------------- Ekibimiz hero (koyu)
  // Aynı çizgide farklı çaplar: tek ekip, farklı uzmanlıklar. İnsan yok.
  'team.hero.image': {
    w: 1920,
    h: 1080,
    svg: (w, h) => {
      const baseY = 620
      const circles = [
        { cx: 560, r: 150, stroke: '#FFFFFF', op: 0.3 },
        { cx: 820, r: 105, stroke: '#FFFFFF', op: 0.4 },
        { cx: 1030, r: 130, stroke: goldLight, op: 0.95 },
        { cx: 1270, r: 92, stroke: '#FFFFFF', op: 0.4 },
        { cx: 1470, r: 118, stroke: '#FFFFFF', op: 0.3 },
      ]
      return `
        ${darkGround(w, h)}
        <line x1="320" y1="${baseY}" x2="${w - 240}" y2="${baseY}" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="1.5"/>
        ${circles
          .map(
            (c) =>
              `<circle cx="${c.cx}" cy="${baseY - c.r}" r="${c.r}" fill="none" stroke="${c.stroke}" stroke-opacity="${c.op}" stroke-width="2.5"/>`,
          )
          .join('')}
        <circle cx="1030" cy="${baseY - 130}" r="8" fill="${gold}"/>
        ${goldBaseline(w, h - 120)}`
    },
  },

  // ---------------------------------------------------- İletişim hero (koyu)
  // Eş merkezli halkalar: konum ve erişim.
  'contact.hero.image': {
    w: 1920,
    h: 1080,
    svg: (w, h) => `
      ${darkGround(w, h)}
      <g transform="translate(${w - 560}, 480)">
        <circle r="300" fill="none" stroke="#FFFFFF" stroke-opacity="0.16" stroke-width="1.5"/>
        <circle r="220" fill="none" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1.5"/>
        <circle r="140" fill="none" stroke="${goldLight}" stroke-opacity="0.9" stroke-width="2"/>
        <circle r="8" fill="${gold}"/>
        <line x1="-340" y1="0" x2="340" y2="0" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1.5"/>
        <line x1="0" y1="-340" x2="0" y2="340" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1.5"/>
      </g>
      ${goldBaseline(w, h - 120)}`,
  },

  // ----------------------------------------------------- Yayınlar hero (koyu)
  // Üst üste yayın sırtları.
  'publications.hero.image': {
    w: 1920,
    h: 1080,
    svg: (w, h) => {
      const bars = [
        { y: 300, bw: 560, fill: navy800 },
        { y: 356, bw: 640, fill: navy700 },
        { y: 412, bw: 500, fill: navy900 },
        { y: 468, bw: 610, fill: gold },
        { y: 524, bw: 545, fill: navy800 },
        { y: 580, bw: 660, fill: navy700 },
        { y: 636, bw: 520, fill: navy900 },
      ]
      return `
        ${darkGround(w, h)}
        <g transform="translate(${w - 880}, 0)">
          ${bars
            .map(
              (b) => `
            <rect x="${(700 - b.bw) / 2}" y="${b.y}" width="${b.bw}" height="42" fill="${b.fill}" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1.5"/>
            <line x1="${(700 - b.bw) / 2 + 26}" y1="${b.y + 21}" x2="${(700 - b.bw) / 2 + b.bw - 26}" y2="${b.y + 21}" stroke="${b.fill === gold ? navy900 : goldLight}" stroke-width="1.5" opacity="${b.fill === gold ? 0.8 : 0.4}"/>`,
            )
            .join('')}
        </g>
        ${goldBaseline(w, h - 120)}`
    },
  },

  // ------------------------------------------- Varsayılan OG görseli (koyu)
  // Paylaşım kartı: markanın adı + altın çizgiler. Site adı panelden
  // değiştirilirse panelden yeni OG yüklenmesi beklenir (varsayılan budur).
  'seo.defaultOg': {
    w: 1200,
    h: 630,
    svg: (w, h) => `
      ${darkGround(w, h)}
      <rect x="46" y="46" width="${w - 92}" height="${h - 92}" fill="none" stroke="#FFFFFF" stroke-opacity="0.14" stroke-width="1.5"/>
      <rect x="${w / 2 - 60}" y="200" width="120" height="2" fill="${gold}"/>
      <text x="${w / 2}" y="308" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="84" fill="#FFFFFF" letter-spacing="6">Çetiner</text>
      <text x="${w / 2}" y="376" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="${goldLight}" letter-spacing="12">HUKUK VE DANIŞMANLIK</text>
      <rect x="${w / 2 - 60}" y="428" width="120" height="2" fill="${gold}"/>`,
  },
}

await mkdir(OUT, { recursive: true })

for (const [key, def] of Object.entries(compositions)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${def.w}" height="${def.h}" viewBox="0 0 ${def.w} ${def.h}">${def.svg(def.w, def.h)}</svg>`
  const file = path.join(OUT, `${key}.webp`)
  await sharp(Buffer.from(svg)).webp({ quality: 86 }).toFile(file)
  const meta = await sharp(file).metadata()
  console.log(`${key}.webp  ${meta.width}x${meta.height}  ${Math.round((await import('node:fs/promises').then((fs) => fs.stat(file))).size / 1024)}kB`)
}
console.log('Bitti → public/defaults/')
