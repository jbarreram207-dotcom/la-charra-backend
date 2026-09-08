/* ==========================================================================
   ALMACÉN LA CHARRA — Datos del catálogo
   Fuente única: inventario proporcionado por el cliente.
   No se inventan productos, precios ni especificaciones.
   ========================================================================== */

const CATEGORIES = [
  { id: "pistolas", label: "Pistolas", short: "Pistolas", icon: "pistol" },
  { id: "revolveres", label: "Revólveres", short: "Revólveres", icon: "revolver" },
  { id: "escopetas", label: "Escopetas", short: "Escopetas", icon: "shotgun" },
  { id: "rifles", label: "Rifles", short: "Rifles", icon: "rifle" },
  { id: "rifles-viento", label: "Rifles de viento", short: "Aire", icon: "airrifle" },
  { id: "pistolas-viento", label: "Pistolas de viento", short: "Aire", icon: "airpistol" },
  { id: "municion", label: "Munición y accesorios", short: "Munición", icon: "ammo" },
];

/* Cada producto conserva únicamente los datos presentes en el inventario.
   Los campos ausentes se omiten en la ficha (no se completan ni se inventan). */
const PRODUCTS = [
  // ---------- PISTOLAS ----------
  {
    id: "p01", category: "pistolas", name: "Taurus G3",
    caliber: "9 mm", capacity: "2 cargadores de 17 cartuchos + 1 cargador de 15",
    finish: "Pavón color Arena", img: "pistola-taurus-g3-arena.jpg", featured: true,
  },
  {
    id: "p02", category: "pistolas", name: "Taurus G3",
    caliber: "9 mm", capacity: "2 cargadores de 17 cartuchos + 1 cargador de 15",
    finish: "Pavón Bicolor", img: "pistola-taurus-g3-bicolor.jpg",
  },
  {
    id: "p03", category: "pistolas", name: "Taurus G3",
    caliber: "9 mm", capacity: "2 cargadores de 17 cartuchos + 1 cargador de 15",
    finish: "Pavón Negro", img: "pistola-taurus-g3-negro.jpg",
  },
  {
    id: "p04", category: "pistolas", name: "CZ",
    caliber: "9 mm", capacity: "2 cargadores de 15 cartuchos",
    finish: "Pavón Negro", img: "pistola-cz-negro.jpg",
  },
  {
    id: "p05", category: "pistolas", name: "Taurus PT 92",
    caliber: "9 mm", capacity: "3 cargadores de 16 cartuchos",
    finish: "Pavón Verde Olivo", img: "pistola-taurus-pt92-verde-olivo.jpg",
  },
  {
    id: "p06", category: "pistolas", name: "BRG9 Élite",
    caliber: "9 mm", capacity: "3 cargadores de 18 cartuchos",
    finish: "Pavón Verde Olivo", img: "pistola-brg9-elite-verde-olivo.jpg",
  },
  {
    id: "p07", category: "pistolas", name: "Pietro Beretta (Italiana)",
    caliber: "9 mm", capacity: "2 cargadores de 15 cartuchos",
    finish: "Pavón Negro", img: "pistola-beretta-italiana-negro.jpg", featured: true,
  },
  {
    id: "p08", category: "pistolas", name: "Glock 17 Gen 5",
    caliber: "9 mm", capacity: "2 cargadores de 17 cartuchos",
    finish: "Pavón Negro", img: "pistola-glock17-gen5-negro-1.jpg", featured: true,
  },
  {
    id: "p09", category: "pistolas", name: "Sarsilmaz Kılınç 2000 Mega",
    caliber: "9 mm", capacity: "2 cargadores de 17 cartuchos",
    finish: "Pavón Acero Inoxidable", img: "pistola-sarsilmaz-kilinc2000-inox.jpg",
  },
  {
    id: "p10", category: "pistolas", name: "BRG9 Élite",
    caliber: "9 mm", capacity: "3 cargadores de 18 cartuchos",
    finish: "Pavón color Bronce", img: "pistola-brg9-elite-bronce.jpg", featured: true,
  },
  {
    id: "p11", category: "pistolas", name: "BRG9 Élite",
    caliber: "9 mm", capacity: "3 cargadores de 18 cartuchos",
    finish: "Pavón Bicolor", img: "pistola-brg9-elite-bicolor.jpg",
  },
  {
    id: "p12", category: "pistolas", name: "Glock 17 Gen 5",
    caliber: "9 mm", capacity: "2 cargadores de 17 cartuchos",
    finish: "Pavón Negro", img: "pistola-glock17-gen5-negro-2.jpg",
  },
  {
    id: "p13", category: "pistolas", name: "CZ 75B",
    caliber: "9 mm", capacity: "2 cargadores de 16 cartuchos",
    finish: "Pavón Negro", img: "pistola-cz75b-negro.jpg",
  },
  {
    id: "p14", category: "pistolas", name: "Bersa TPR9",
    caliber: "9 mm", capacity: "2 cargadores de 17 cartuchos",
    finish: "Pavón Gris", img: "pistola-bersa-tpr9-gris.jpg",
  },
  {
    id: "p15", category: "pistolas", name: "Bersa",
    caliber: "Calibre .380", capacity: "2 tolvas de 15 cartuchos",
    finish: "Pavón Negro", img: "pistola-bersa-380-negro.jpg",
  },
  {
    id: "p16", category: "pistolas", name: "Glock 19 Comando",
    caliber: "9 mm", capacity: "2 cargadores de 15 cartuchos",
    finish: "Pavón Negro", img: "pistola-glock19-comando-negro.jpg",
  },
  {
    id: "p17", category: "pistolas", name: "Sarsilmaz P8L Compensada",
    caliber: "9 mm", capacity: "2 cargadores de 17 cartuchos",
    finish: "Pavón Negro", img: "pistola-sarsilmaz-p8l-negro.jpg",
  },
  {
    id: "p18", category: "pistolas", name: "Tanfoglio Force Plus",
    caliber: "9 mm", capacity: "3 cargadores de 17 cartuchos",
    finish: "Pavón Negro", img: "pistola-tanfoglio-force-plus-negro.jpg",
  },
  {
    id: "p19", category: "pistolas", name: "Taurus TX",
    caliber: "Calibre .22", capacity: "2 cargadores de 17 cartuchos",
    finish: "Pavón Bicolor", img: "pistola-taurus-tx-22-bicolor.jpg",
  },
  {
    id: "p20", category: "pistolas", name: "HS SF19",
    caliber: "9 mm", capacity: "3 cargadores de 19 cartuchos",
    finish: "Pavón Bicolor", img: "pistola-hs-sf19-bicolor.jpg",
  },
  {
    id: "p21", category: "pistolas", name: "Sarsilmaz SAR9",
    caliber: "9 mm", capacity: "2 cargadores de 17 cartuchos",
    finish: "Pavón color Bronce", img: "pistola-sarsilmaz-sar9-bronce.jpg", featured: true,
  },

  // ---------- REVOLVERES ----------
  {
    id: "r01", category: "revolveres", name: "Revólver Taurus",
    caliber: "Calibre .22", capacity: "8 cartuchos",
    finish: "Acero Inoxidable", img: "revolver-taurus-22-inox.jpg",
  },

  // ---------- ESCOPETAS ----------
  {
    id: "e01", category: "escopetas", name: "Hatsan",
    caliber: "Calibre 12", capacity: "6 cartuchos",
    use: "Para cacería", img: "escopeta-hatsan-caceria.jpg",
  },
  {
    id: "e02", category: "escopetas", name: "Hatsan Scort Magnum",
    caliber: "Calibre 12", capacity: "6 cartuchos",
    use: "Para cacería · Semiautomática", img: "escopeta-hatsan-scort-magnum.jpg", featured: true,
  },
  {
    id: "e03", category: "escopetas", name: "Akkar Aitay",
    caliber: "Calibre 12", capacity: null,
    use: "Culata plegable", img: "escopeta-akkar-aitay.jpg", featured: true,
  },
  {
    id: "e04", category: "escopetas", name: "Hatsan Scort",
    caliber: "Calibre 12", capacity: null,
    use: "Culata recortada", img: "escopeta-hatsan-scort-recortada.jpg",
  },

  // ---------- RIFLES ----------
  {
    id: "f01", category: "rifles", name: "Mendoza",
    caliber: "Calibre .22", capacity: "Barrilla de 17 cartuchos",
    img: "rifle-mendoza-22.jpg",
  },
  {
    id: "f02", category: "rifles", name: "Savage",
    caliber: "Calibre .22", capacity: "2 cargadores de 10 cartuchos",
    img: "rifle-savage-22.jpg",
  },
  {
    id: "f03", category: "rifles", name: "Tippmann",
    caliber: "Calibre .22", capacity: "2 cargadores de 20 cartuchos",
    img: "rifle-tippmann-22-negro.jpg",
  },
  {
    id: "f04", category: "rifles", name: "Tippmann",
    caliber: "Calibre .22", capacity: "2 tolvas de 20 cartuchos",
    finish: "Pavón Verde musgo", img: "rifle-tippmann-22-verde-musgo.jpg",
  },
  {
    id: "f05", category: "rifles", name: "Fusil Grand Power",
    caliber: "Calibre .223", capacity: "2 cargadores de 30 + 1 cargador de 10",
    finish: "Pavón Verde", img: "fusil-grand-power-223.jpg", featured: true,
  },

  // ---------- RIFLES DE VIENTO ----------
  {
    id: "av01", category: "rifles-viento", name: "Gamo",
    caliber: "5.5 mm", img: "rifle-viento-gamo-1.jpg",
  },
  {
    id: "av02", category: "rifles-viento", name: "Gamo",
    caliber: "5.5 mm", use: "Sistema de pistón",
    img: "rifle-viento-gamo-piston.jpg",
  },
  {
    id: "av03", category: "rifles-viento", name: "Gamo",
    caliber: "5.5 mm", use: "Sistema resortado",
    img: "rifle-viento-gamo-resortado.jpg",
  },
  {
    id: "av04", category: "rifles-viento", name: "Hatsan",
    caliber: "5.5 mm", use: "Sistema resortado",
    img: "rifle-viento-hatsan-resortado.jpg",
  },

  // ---------- PISTOLAS DE VIENTO ----------
  {
    id: "ap01", category: "pistolas-viento", name: "Imitación Pietro Beretta — Swiss Arms",
    caliber: "Calibre 4.5", use: "Operada por CO₂ y balines",
    img: "pistola-viento-beretta-swissarms.jpg",
  },
  {
    id: "ap02", category: "pistolas-viento", name: "Imitación Pietro Beretta",
    caliber: "Calibre 4.5", use: "Operada por CO₂ y balines",
    finish: "Color Arena", img: "pistola-viento-beretta-arena.jpg",
  },
  {
    id: "ap03", category: "pistolas-viento", name: "Imitación Jericho — Desert Eagle",
    caliber: "Calibre 4.5", use: "Operada por CO₂ y balines",
    img: "pistola-viento-jericho-desert-eagle.jpg",
  },

  // ---------- MUNICIÓN Y ACCESORIOS ----------
  {
    id: "am01", category: "municion", name: "Munición",
    caliber: "9 mm", img: "municion-9mm.jpg",
  },
];

const IMG_BASE = "assets/img/products/";
