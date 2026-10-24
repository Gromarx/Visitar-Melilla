'use strict';
// =====================================================
//  VISITAR MELILLA — configuración
// =====================================================
const CONFIG = {
  API_URL: 'https://api.visitarmelilla.es/api',
  // Fotos y audios que devuelve la API son rutas relativas a la web original
  ASSET_BASE: 'https://www.visitarmelilla.es/',
  // Número de WhatsApp de la guía (con prefijo, sin espacios, ej. '34600111222'). Vacío = botón oculto
  WHATSAPP: '',
  // Endpoint de reseñas (GET ?place=ID / POST JSON). Si no existe, se guardan en el dispositivo
  // Clave de Google Maps Platform (Maps JavaScript API + Places API (New)), restringida a tu dominio.
  // Vacía = la web funciona igual, pero sin fotos, horarios ni teléfonos de Google.
  GOOGLE_MAPS_KEY: 'AIzaSyCHGyMyc9g5XkFCdLZbueP-FBaOiP6pHtw',
  // Mostrar también la foto real de Google en las listas (cada foto visible cuenta como una consulta)
  GOOGLE_PHOTOS_IN_LISTS: true,
  // Agenda de eventos (script eventos.php que lee melilla.es)
  EVENTS_URL: 'eventos.php',
  REVIEWS_URL: 'https://api.visitarmelilla.es/api/reviews',
  CENTER: [35.2923, -2.9381],
  TZ: 'Europe/Madrid'
};

// =====================================================
//  Utilidades
// =====================================================
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = s => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const clean = s => String(s ?? '').replace(/\\r\\n|\\n|\\r/g, '\n').replace(/\r\n?/g, '\n').replace(/\\+(["'])/g, '$1').replace(/\\+(\s|$)/g, '$1').replace(/\n{3,}/g, '\n\n').trim();

const ICONS = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  route:'<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H16"/>',
  near:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>',
  heart:'<path d="M12 20s-7-4.35-9.5-8.5C.5 8 2.5 4 6.5 4 9 4 10.5 5.5 12 7.5 13.5 5.5 15 4 17.5 4c4 0 6 4 4 7.5C19 15.65 12 20 12 20z"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h10"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  back:'<path d="M15 18l-6-6 6-6"/>',
  chev:'<path d="m9 18 6-6-6-6"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  nav:'<path d="m3 11 18-8-8 18-2-8-8-2z"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  play:'<path d="M7 4v16l13-8z" fill="currentColor"/>',
  pause:'<path d="M7 4h4v16H7zM13 4h4v16h-4z" fill="currentColor" stroke="none"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  auto:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  headphones:'<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
  video:'<rect x="2" y="5" width="14" height="14" rx="2"/><path d="m22 8-6 4 6 4z"/>',
  calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  walk:'<circle cx="13" cy="4" r="2"/><path d="m9 20 3-6 3 3v4M7 11l3-3 3 1 2 3h3M10 8l-1 5"/>',
  pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  wa:'<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.7-.1a15 15 0 0 1-1.6-.6 12.2 12.2 0 0 1-4.6-4.1 5.3 5.3 0 0 1-1.1-2.8 3 3 0 0 1 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.1.1.7-.1 1.3z"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  fork:'<path d="M7 2v8a2 2 0 0 0 2 2v10M11 2v8a2 2 0 0 1-2 2M17 2c-2 0-3 2-3 6s1 5 3 5v9"/>',
  bed:'<path d="M2 18v-8M2 14h20v4M22 18v-5a3 3 0 0 0-3-3h-8v4"/><circle cx="6.5" cy="11.5" r="1.5"/>',
  landmark:'<path d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M2 10l10-6 10 6z"/>',
  car:'<path d="M5 17h14M3 17v-5l2-5h14l2 5v5"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  bag:'<path d="M6 7h12l1 14H5zM9 7a3 3 0 0 1 6 0"/>',
  shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
  music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  waves:'<path d="M2 10c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M2 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/>',
  ship:'<path d="M3 17c2 2 4 2 6 0 2 2 4 2 6 0 2 2 4 2 6 0M5 14l-1-5h16l-1 5M12 3v6M8 6h8"/>',
  sort:'<path d="M3 6h13M3 12h9M3 18h5M17 8V20M14 17l3 3 3-3"/>',
  cloud:'<path d="M17.5 19H8a5 5 0 1 1 1.4-9.8A6 6 0 0 1 21 11.5 3.8 3.8 0 0 1 17.5 19z"/>',
  rain:'<path d="M17.5 15H8a5 5 0 1 1 1.4-9.8A6 6 0 0 1 21 7.5 3.8 3.8 0 0 1 17.5 15zM8 19l-1 2M12 19l-1 2M16 19l-1 2"/>',
  edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'
};
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const icWa = (cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true" style="fill:currentColor;stroke:none">${ICONS.wa}</svg>`;
const starsHtml = n => `<span class="stars" aria-label="${n}/5">${[1,2,3,4,5].map(i => `<svg viewBox="0 0 24 24" class="${i <= n ? '' : 'off'}">${ICONS.star}</svg>`).join('')}</span>`;

const LOGO = `<svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="var(--brand)"/><path d="M9 29V17l3-2 3 2v-4l5-4 5 4v4l3-2 3 2v12" fill="none" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/><path d="M17 29v-6a3 3 0 0 1 6 0v6" fill="none" stroke="#fff" stroke-width="2.4"/><path d="M6 33c2.3 0 2.3-1.6 4.7-1.6S13 33 15.3 33s2.3-1.6 4.7-1.6 2.3 1.6 4.7 1.6 2.3-1.6 4.6-1.6S31.7 33 34 33" fill="none" stroke="#8EC5FF" stroke-width="2" stroke-linecap="round"/></svg>`;
const brandHtml = () => `${LOGO}<span class="brand-word"><span>${lang === 'ar' ? 'زيارة' : 'VISITAR'}</span><b>${lang === 'ar' ? 'مليلية' : 'MELILLA'}</b></span>`;

// =====================================================
//  Idioma
// =====================================================
const LANGS = ['es', 'en', 'fr', 'ar'];
let lang = store.get('vm_lang', null);
if (!LANGS.includes(lang)) { const nl = (navigator.language || 'es').slice(0, 2); lang = LANGS.includes(nl) ? nl : 'es'; }
const t = (k, vars) => { let s = (I18N[lang] && I18N[lang][k]) ?? I18N.es[k] ?? k; if (vars && typeof s === 'string') for (const v in vars) s = s.replace('{' + v + '}', vars[v]); return s; };
const tl = obj => obj ? (obj[lang] ?? obj.es) : '';

// =====================================================
//  Datos
// =====================================================
let CATS = [], PLACES = [], ROUTES = [];
const byId = { cat: new Map(), place: new Map(), route: new Map() };

const PARENT_STYLE = {
  1:{icon:'fork',color:'#E2553B',img:'tapas'}, 2:{icon:'bed',color:'#3B6FD6',img:'parador'}, 3:{icon:'landmark',color:'#0E8A7A',img:'plazaarmas'},
  4:{icon:'info',color:'#0B5FB0',img:'plazaespana'}, 6:{icon:'car',color:'#7A5AF8',img:'puerto'}, 66:{icon:'bag',color:'#C2417B',img:'mercadoreal'},
  32:{icon:'shield',color:'#475569',img:'asamblea'}, 39:{icon:'music',color:'#D97706',img:'parqueatardecer'}, 44:{icon:'landmark',color:'#0E8A7A',img:'melul'}
};
const HOME_ORDER = [1, 3, 2, 6, 4, 66, 39, 32];
const SUB_POOL = {
  17:['paella','pescaito','tapas'], 18:['tapas','pinchitos'], 19:['cafe'], 31:['puertoatardecer'],
  20:['parador','hotelroom'], 21:['hotelroom'], 22:['hotelroom'], 27:['plazaespana'], 28:['plazaespana'],
  29:['puerto'], 30:['carabos'], 33:['asamblea'], 34:['asamblea'], 35:['asamblea'], 36:['puerto'], 37:['puerto'], 38:['asamblea'],
  40:['parqueatardecer'], 41:['casino'], 42:['casino'], 44:['parque'], 45:['melul','reconquista'], 48:['melul','asamblea','reconquista','casino','mercadoreal'],
  49:['plazaarmas','santiago'], 46:['sagrado','mezquita'], 47:['sagrado'], 67:['melul','reconquista','asamblea'],
  3001:['carabos','hipodromo','trapana'], 3002:['rostrogordo','recinto','plazaarmas'], 3003:['parque','parqueatardecer'], 3004:['casino','plazaespana'],
  6601:['plazaespana'], 6602:['mercadoreal','medieval'], 6603:['mercadoreal'], 6604:['plazaespana'], 6605:['plazaespana']
};
const KEYWORD_IMG = [
  [/asamblea|enrique nieto|art deco/, 'asamblea'], [/reconquista/, 'reconquista'], [/melul|triangulo de oro/, 'melul'], [/casino/, 'casino'],
  [/mercado/, 'mercadoreal'], [/mezquita central/, 'mezquita'], [/sagrado/, 'sagrado'], [/hernandez|ficus|araucaria|yucca|palmito|celestina|junquillo/, 'parque'],
  [/plaza de espana/, 'plazaespana'], [/faro/, 'faro'], [/puerta de santiago/, 'santiago'], [/plaza de armas|bateria real/, 'plazaarmas'],
  [/conventico/, 'conventico'], [/rostrogordo/, 'rostrogordo'], [/trapana/, 'trapana'], [/parador/, 'parador'], [/baluarte de la concepcion/, 'recinto']
];
const ROUTE_IMG = {1:'melul', 2:'sagrado', 3:'asamblea', 4:'recinto', 5:'santiago', 6:'parque'};
const ICON_IMG = /(Hotel\d?star|Hostal\d?star|Pension\d?star|Pension|tourist_office|point_of_information|phone)\.png$/i;

const imgUrl = key => `img/${key}.jpg`;
const asset = u => !u ? '' : /^https?:/i.test(u) ? u : CONFIG.ASSET_BASE + u.replace(/^\//, '');

function placeImg(p) {
  if (p._img) return p._img;
  const n = norm(p.title);
  for (const [re, key] of KEYWORD_IMG) if (re.test(n)) return (p._img = { src: imgUrl(key), illus: false });
  const own = (window.PLACE_PHOTOS || {})[p.id]; if (own) return (p._img = { src: own.src, illus: false });
  if (p.img && !ICON_IMG.test(p.img)) return (p._img = { src: asset(p.img), illus: false });
  const pool = SUB_POOL[p.cat] || [PARENT_STYLE[parentId(p.cat)]?.img || 'hero'];
  return (p._img = { src: imgUrl(pool[p.id % pool.length]), illus: true });
}
const parentId = catId => { const c = byId.cat.get(catId); return c && c.parentId ? c.parentId : catId; };
const pStyle = catId => PARENT_STYLE[parentId(catId)] || {icon:'pin',color:'#0B5FB0',img:'hero'};
const catName = c => {
  if (!c) return '';
  const own = CAT_I18N[c.id]?.[lang];
  const api = c[lang] || (lang === 'es' ? c.name : '');
  return own || (api && api !== c.name ? api : '') || api || c.name;
};
const pName = p => clean(p[lang] || p.title);
const pDesc = p => clean(p['desc_' + lang] || p.desc || '');
const pSub = p => clean(p['sub_' + lang] || p.sub || '');
const rName = r => clean(r[lang] || r.title);
const rDesc = r => clean(r['desc_' + lang] || r.desc || '');
const subCats = id => CATS.filter(c => c.parentId === id);
const placesIn = id => { const ids = new Set([id, ...subCats(id).map(c => c.id)]); return PLACES.filter(p => ids.has(p.cat)); };

async function loadData() {
  const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 12000);
  const get = e => fetch(`${CONFIG.API_URL}/${e}`, { signal: ctrl.signal }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
  try {
    const local = (f, o) => fetch(f, o).then(r => r.ok ? r.json() : null).catch(() => null);
    const [c, p, r, x, u, ed] = await Promise.all([get('categories'), get('places'), get('routes'), local('extra-places.json'), local('place-updates.json'), local('data/ediciones.json', { cache: 'no-cache' })]);
    store.set('vm_cache', { c, p, r, x, u, ed, at: Date.now() });
    return { c, p, r, x: x || [], u, ed };
  } catch (e) {
    const cache = store.get('vm_cache', null);
    if (cache) return cache;
    throw e;
  } finally { clearTimeout(to); }
}
// Datos comprobados a mano (teléfono, horario, dirección). Los lugares cerrados se ocultan.
function applyUpdate(pl, up, checked) {
  if (!up) return true;
  if (up.status === 'closed') return false;
  if (up.phone && !pl.phone) pl.phone = up.phone;
  if (up.horario && !pl.horario) pl.horario = up.horario;
  if (up.address && (!pl.place || pl.place === 'Melilla')) pl.place = up.address;
  if (up.site && !pl.site) pl.site = up.site;
  pl._check = { status: up.status, note: up.note || '', source: up.source || '', date: checked };
  return true;
}
// Cambios hechos desde el panel (admin/): sustituyen a los datos de la API.
function applyEdit(pl, e) {
  if (!e) return true;
  if (e.hidden) return false;
  if (e.name) for (const l in e.name) { if (l === 'es') pl.title = e.name.es; else pl[l] = e.name[l]; }
  if (e.desc) for (const l in e.desc) { if (l === 'es') pl.desc = e.desc.es; else pl['desc_' + l] = e.desc[l]; }
  if (e.phone) pl.phone = e.phone;
  if (e.site) pl.site = e.site;
  if (e.address) pl.place = e.address;
  if (e.horario) { pl.horario = e.horario; pl._ownHours = true; }
  if (e.photo) { pl._img = { src: e.photo, illus: false }; pl._ownPhoto = true; }
  if (e.audio) { window.AUDIO_EXTRA = window.AUDIO_EXTRA || {}; window.AUDIO_EXTRA[pl.id] = { ...(window.AUDIO_EXTRA[pl.id] || {}), ...e.audio }; }
  return true;
}
function indexData({ c, p, r, x = [], u = null, ed = null }) {
  CATS = c.slice();
  for (const v of VIRTUAL_CATS) if (!CATS.some(x => x.id === v.id)) CATS.push(v);
  PLACES = p.concat(x).filter(e => e && e.id);
  if (u && u.places) PLACES = PLACES.filter(pl => applyUpdate(pl, u.places[pl.id], u.checked));
  if (ed && ed.places) PLACES = PLACES.filter(pl => applyEdit(pl, ed.places[pl.id]));
  ROUTES = r;
  byId.cat = new Map(CATS.map(x => [x.id, x]));
  byId.place = new Map(PLACES.map(x => [x.id, x]));
  byId.route = new Map(ROUTES.map(x => [x.id, x]));
  PLACES.forEach(x => { x._hours = x.horario ? parseHours(clean(x.horario)) : null; });
}

// =====================================================
//  Horarios: "Martes a Sábado 10:30 a 14:00 H…" → abierto/cerrado
// =====================================================
const DAYS_ES = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
function parseHours(txt) {
  const s = norm(txt).replace(/\n/g, ' ');
  const re = /(domingo|lunes|martes|miercoles|jueves|viernes|sabado)s?(?:\s+(a|y)\s+(domingo|lunes|martes|miercoles|jueves|viernes|sabado)s?)?|(\d{1,2})[:.](\d{2})\s*h?\s*(?:a|-|–)\s*(\d{1,2})[:.](\d{2})/g;
  const out = {}; let cur = null, m, found = false;
  while ((m = re.exec(s))) {
    if (m[1]) {
      const a = DAYS_ES.indexOf(m[1]);
      if (m[2] === 'a') { cur = []; let d = a; const b = DAYS_ES.indexOf(m[3]); for (let k = 0; k < 7; k++) { cur.push(d); if (d === b) break; d = (d + 1) % 7; } }
      else if (m[2] === 'y') cur = [a, DAYS_ES.indexOf(m[3])];
      else cur = [a];
    } else if (cur) {
      const from = +m[4] * 60 + +m[5], to = +m[6] * 60 + +m[7];
      cur.forEach(d => (out[d] = out[d] || []).push([from, to])); found = true;
    }
  }
  return found ? out : null;
}
function madridNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: CONFIG.TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const g = k => parts.find(x => x.type === k)?.value;
  return { day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')), min: +g('hour') * 60 + +g('minute') };
}
const hhmm = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
function openState(p) {
  const h = p._hours; if (!h) return null;
  const { day, min } = madridNow();
  for (const [a, b] of (h[day] || [])) if (min >= a && min < b) return { open: true, label: t('open_now'), sub: t('closes_at', { t: hhmm(b) }) };
  const later = (h[day] || []).filter(([a]) => a > min).sort((x, y) => x[0] - y[0])[0];
  if (later) return { open: false, label: t('closed_now'), sub: t('opens_at', { t: hhmm(later[0]) }) };
  for (let k = 1; k <= 7; k++) {
    const d = (day + k) % 7; const sl = (h[d] || []).slice().sort((x, y) => x[0] - y[0])[0];
    if (sl) return { open: false, label: t('closed_now'), sub: t('opens_day', { d: k === 1 ? t('tomorrow') : t('days')[d], t: hhmm(sl[0]) }) };
  }
  return { open: false, label: t('closed_now'), sub: '' };
}

// =====================================================
//  Geolocalización
// =====================================================
let me = null; let watchId = null;
const MELILLA_RADIUS = 15000;
function dist(a1, o1, a2, o2) {
  if (a1 == null || a2 == null) return Infinity;
  const R = 6371000, dA = (a2 - a1) * Math.PI / 180, dO = (o2 - o1) * Math.PI / 180;
  const x = Math.sin(dA / 2) ** 2 + Math.cos(a1 * Math.PI / 180) * Math.cos(a2 * Math.PI / 180) * Math.sin(dO / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
const nPlaces = n => `${n} ${n === 1 ? t('place1') : t('places')}`;
const fmtDist = m => m === Infinity ? '' : m >= 1000 ? `${(m / 1000).toFixed(1)} ${t('km')}` : `${Math.round(m / 10) * 10} ${t('m')}`;
function origin() { if (me && dist(me.lat, me.lon, ...CONFIG.CENTER) < MELILLA_RADIUS) return me; return null; }
const hasGeo = p => !!p && Math.abs(+p.lat) > 1 && Math.abs(+p.lon) > 0.5;
const placeDist = p => { const o = origin(); return o ? dist(o.lat, o.lon, p.lat, p.lon) : Infinity; };
function locate() {
  return new Promise((res, rej) => {
    if (!navigator.geolocation) return rej(new Error('nogps'));
    navigator.geolocation.getCurrentPosition(pos => { me = { lat: pos.coords.latitude, lon: pos.coords.longitude }; res(me); }, rej, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
  });
}

// =====================================================
//  Favoritos y reseñas
// =====================================================
let favs = new Set(store.get('vm_favs', []));
function toggleFav(id) {
  favs.has(id) ? favs.delete(id) : favs.add(id);
  store.set('vm_favs', [...favs]);
  $$(`[data-fav="${id}"]`).forEach(b => { b.classList.toggle('on', favs.has(id)); b.classList.remove('pop'); void b.offsetWidth; if (favs.has(id)) b.classList.add('pop'); });
  toast(favs.has(id) ? '♥ ' + t('saved') : '');
}
let remoteReviews = null;
async function fetchReviews() {
  if (remoteReviews) return remoteReviews;
  try {
    const r = await fetch(CONFIG.REVIEWS_URL); if (!r.ok) throw 0;
    const j = await r.json(); remoteReviews = Array.isArray(j) ? j : [];
  } catch { remoteReviews = []; }
  return remoteReviews;
}
async function getReviews(placeId) {
  const all = [...await fetchReviews(), ...store.get('vm_reviews', [])];
  return (placeId == null ? all : all.filter(r => +r.place === +placeId)).sort((a, b) => (b.date || 0) - (a.date || 0));
}
async function saveReview(rv) {
  try {
    const r = await fetch(CONFIG.REVIEWS_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rv) });
    if (!r.ok) throw 0;
    remoteReviews = null;
  } catch {
    const list = store.get('vm_reviews', []); list.push(rv); store.set('vm_reviews', list);
  }
}

// =====================================================
//  Tiempo (Open-Meteo, sin clave)
// =====================================================
let WX = null;
async function loadWeather() {
  try {
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${CONFIG.CENTER[0]}&longitude=${CONFIG.CENTER[1]}&current=temperature_2m,weather_code&daily=sunset&timezone=${encodeURIComponent(CONFIG.TZ)}&forecast_days=1`;
    const j = await (await fetch(u)).json();
    WX = { temp: Math.round(j.current.temperature_2m), code: j.current.weather_code, sunset: (j.daily.sunset[0] || '').slice(11, 16) };
    const el = $('#wx'); if (el) el.outerHTML = wxHtml();
  } catch {}
}
function wxLabel(c) { const keys = [95, 80, 71, 61, 51, 45, 3, 2, 1, 0]; const k = keys.find(x => c >= x) ?? 0; return t('wx')[k]; }
function wxIcon(c) { return c >= 51 ? 'rain' : c >= 3 ? 'cloud' : 'sun'; }
function wxHtml() {
  if (!WX) return '<span id="wx"></span>';
  return `<div class="wx" id="wx">${ic(wxIcon(WX.code), 'sm')}<b>${WX.temp}°</b><span>${esc(wxLabel(WX.code))}</span><span class="dot">·</span><span>${t('sunset')} ${WX.sunset}</span></div>`;
}

// =====================================================
//  Componentes
// =====================================================
const phoneDigits = p => (p.phone || p._gphone || '').replace(/\D/g, '');
const telHref = p => { const d = phoneDigits(p); return d ? `tel:${d.length === 9 ? '+34' + d : d}` : ''; };
const isMobile = p => /^[67]\d{8}$/.test(phoneDigits(p));
const waHref = (num, text = '') => `https://wa.me/${num}${text ? '?text=' + encodeURIComponent(text) : ''}`;
const gmapsSearch = p => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pName(p) + ', Melilla')}`;
const gmapsDir = p => hasGeo(p) ? `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}` : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent((p.title || '') + ', Melilla')}`;
const siteHref = p => p.site ? (/^https?:/.test(p.site) ? p.site : 'https://' + p.site) : '';
const canReserve = p => [1, 2, 6].includes(parentId(p.cat));
const hasAudio = p => !!(p['audio_' + lang] || p.audio_es || (window.AUDIO_EXTRA || {})[p.id]);

function openTag(p) { const s = openState(p); return s ? `<span class="tag ${s.open ? 'ok' : 'bad'}">${ic('clock', 'xs')}${esc(s.label)}</span>` : ''; }
function distTag(p) { const d = placeDist(p); return d < Infinity ? `<span class="tag brand">${ic('pin', 'xs')}${t('away', { d: fmtDist(d) })}</span>` : ''; }

function rowHtml(p, extra = '') {
  const im = placeImg(p); const c = byId.cat.get(p.cat);
  return `<a class="row" href="#/place/${p.id}">
    <div class="row-img"${gAttr(p, im)}><img src="${esc(im.src)}" alt="" loading="lazy" onerror="this.src='img/hero.jpg'"></div>
    <div class="row-body"><b>${esc(pName(p))}</b><div class="row-sub">${esc(pSub(p) || catName(c))}</div>
    <div class="row-meta">${extra}${openTag(p)}${distTag(p)}${hasAudio(p) ? `<span class="tag">${ic('headphones', 'xs')}${t('with_audio')}</span>` : ''}</div></div>
    <span class="muted chev">${ic('chev', 'sm')}</span></a>`;
}
function cardHtml(p) {
  const im = placeImg(p); const c = byId.cat.get(p.cat);
  const tel = telHref(p);
  return `<article class="pcard reveal">
    <a href="#/place/${p.id}" class="pcard-img"${gAttr(p, im)}><img src="${esc(im.src)}" alt="${esc(pName(p))}" loading="lazy" onerror="this.src='img/hero.jpg'">
      <span class="pill">${esc(catName(c))}</span></a>
    <button class="fav-btn ${favs.has(p.id) ? 'on' : ''}" data-fav="${p.id}" aria-label="${t('save')}" style="position:absolute">${ic('heart', 'sm')}</button>
    <a href="#/place/${p.id}" class="pcard-body"><h3>${esc(pName(p))}</h3>
      <div class="row-sub">${esc(pSub(p) || p.place || '')}</div>
      <div class="row-meta">${openTag(p)}${distTag(p)}</div></a>
    <div class="pcard-actions">
      ${tel ? `<a class="chip-btn brand" href="${tel}">${ic('phone', 'xs')}${t('call')}</a>` : ''}
      ${isMobile(p) ? `<a class="chip-btn wa" href="${waHref('34' + phoneDigits(p))}" target="_blank" rel="noopener">${icWa('xs')}WhatsApp</a>` : ''}
      <a class="chip-btn" href="${gmapsDir(p)}" target="_blank" rel="noopener">${ic('nav', 'xs')}${t('directions')}</a>
      ${!tel ? `<a class="chip-btn" href="${gmapsSearch(p)}" target="_blank" rel="noopener">${ic('ext', 'xs')}${t('gmaps')}</a>` : ''}
    </div></article>`;
}
function routeStats(r) {
  const pts = r.postIds.map(id => byId.place.get(id)).filter(hasGeo);
  let m = 0; for (let i = 1; i < pts.length; i++) m += dist(pts[i - 1].lat, pts[i - 1].lon, pts[i].lat, pts[i].lon);
  const mins = Math.round(m * 1.25 / 75 + r.postIds.length * 5);
  return { m: m * 1.25, mins, n: r.postIds.length, audio: pts.some(hasAudio) };
}
function routeCard(r) {
  const s = routeStats(r);
  return `<a class="rcard reveal" href="#/route/${r.id}">
    <div class="rcard-img"><img src="${imgUrl(ROUTE_IMG[r.id] || 'hero')}" alt="" loading="lazy"><span class="pill glass">${ic('walk', 'xs')}${t('walk_time', { n: s.mins })}</span></div>
    <div class="rcard-body"><h3>${esc(rName(r))}</h3><p>${esc(rDesc(r))}</p>
    <div class="stats"><span>${ic('pin', 'xs')}${s.n} ${t('stops')}</span>${s.m > 0 ? `<span>${ic('route', 'xs')}${fmtDist(s.m)}</span>` : ''}${s.audio ? `<span>${ic('headphones', 'xs')}${t('with_audio')}</span>` : ''}</div></div></a>`;
}
function storyHtml(a, small = false) {
  const x = tl(a.t);
  return `<a class="story ${small ? 'sm' : ''} reveal" href="#/article/${a.id}">
    <img src="${imgUrl(a.img)}" alt="" loading="lazy">
    <div class="story-body"><span class="pill">${esc(x.cat)}</span><h3>${esc(x.title)}</h3>${small ? '' : `<p>${esc(x.excerpt)}</p>`}
    <div class="story-meta"><span>${ic('clock', 'xs')}${t('min_read', { n: a.read })}</span>${a.route ? `<span>${ic('route', 'xs')}${t('routes')}</span>` : ''}</div></div></a>`;
}
function reviewHtml(r) {
  const p = r.place ? byId.place.get(+r.place) : null;
  const d = r.date ? new Date(r.date).toLocaleDateString(lang === 'ar' ? 'ar' : lang, { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const hue = [...(r.name || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return `<div class="rev reveal"><div class="rev-top"><span class="avatar" style="background:hsl(${hue} 55% 45%)">${esc((r.name || '?').trim()[0].toUpperCase())}</span>
    <div><b>${esc(r.name)}</b><small>${esc([r.from, d].filter(Boolean).join(' · '))}</small></div></div>
    ${starsHtml(+r.rating || 0)}<p>${esc(r.text)}</p>${p ? `<a class="rev-place" href="#/place/${p.id}">${esc(pName(p))}</a>` : ''}</div>`;
}
function secHead(kick, title, href) {
  return `<div class="sec-head"><div><div class="kicker">${esc(kick)}</div><h2 class="title">${esc(title)}</h2></div>${href ? `<a class="see-all" href="${href}">${t('see_all')}<span class="chev">${ic('chev', 'xs')}</span></a>` : ''}</div>`;
}
const footer = () => `<footer class="footer"><a class="brand" href="#/">${brandHtml()}</a><p>${t('footer')}</p><p style="margin-top:8px"><a href="#/credits">${t('credits')}</a></p></footer>`;

// =====================================================
//  Vistas
// =====================================================
const view = $('#view');
let maps = [];
function setView(html, opts = {}) {
  maps.forEach(m => m.remove()); maps = [];
  view.innerHTML = html;
  view.style.animation = 'none'; void view.offsetWidth; view.style.animation = (opts.noAnim || inVT) ? 'none' : '';
  $('#topbar').classList.toggle('over', !!opts.over);
  $('#topbar').classList.remove('hide');
  topOver = !!opts.over; noHide = !!opts.noAnim;
  if (!opts.keepScroll) window.scrollTo({ top: 0, behavior: 'instant' });
  if (inVT && sharedFrom) { const target = $('.d-hero img, .page-hero img, .hero-img'); if (target) target.style.viewTransitionName = 'shared'; }
  observeReveal(); prepImages(); onScroll(); observeGooglePhotos();
}
let topOver = false, noHide = false;
view.addEventListener('animationend', e => { if (e.target === view) maps.forEach(m => m.invalidateSize()); });

// ---------- Animaciones ----------
const RM = matchMedia('(prefers-reduced-motion: reduce)');
let inVT = false, sharedFrom = null;

// Transición entre pantallas (View Transitions API) con la foto "volando" de la tarjeta a la ficha
function navigate(back) {
  document.documentElement.dataset.nav = back ? 'back' : 'fwd';
  if (!document.startViewTransition || RM.matches) { sharedFrom = null; return route(); }
  inVT = true;
  const vt = document.startViewTransition(() => route());
  vt.finished.finally(() => {
    inVT = false;
    $$('[style*="view-transition-name"]').forEach(el => el.style.viewTransitionName = '');
    sharedFrom = null;
    maps.forEach(m => m.invalidateSize());
  });
}
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#/"]'); if (!a || e.defaultPrevented) return;
  $$('[style*="view-transition-name"]').forEach(el => el.style.viewTransitionName = '');
  const img = a.querySelector('img') || a.closest('.pcard')?.querySelector('.pcard-img img');
  sharedFrom = img && img.getBoundingClientRect().width > 50 ? img : null;
  if (sharedFrom) sharedFrom.style.viewTransitionName = 'shared';
}, true);

// Aparición escalonada al hacer scroll
function observeReveal() {
  const els = $$('.reveal:not(.in)');
  if (!('IntersectionObserver' in window) || RM.matches) return els.forEach(e => e.classList.add('in'));
  const io = new IntersectionObserver(es => {
    es.filter(e => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
      .forEach((e, i) => {
        const el = e.target; el.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
        el.classList.add('in'); io.unobserve(el);
        setTimeout(() => el.style.transitionDelay = '', 900);
      });
  }, { rootMargin: '0px 0px -6% 0px' });
  els.forEach(e => io.observe(e));
}

// Fotos: esqueleto brillante mientras cargan y fundido al aparecer
function prepImages(root = document) {
  $$('img:not(.ld):not(.ld-wait)', root).forEach(img => {
    const done = () => { img.classList.add('ld'); img.parentElement?.classList.add('ld-p'); };
    if (img.complete && img.naturalWidth) return done();
    img.classList.add('ld-wait');
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
}
new MutationObserver(ms => { if (ms.some(m => m.addedNodes.length)) prepImages(); }).observe(document.body, { childList: true, subtree: true });

// Parallax de portadas, cabecera que se oculta al bajar y barra de lectura
let lastY = 0, ticking = false;
function onScroll() {
  const y = scrollY;
  if (topOver) $('#topbar').classList.toggle('over', y < 120);
  if (!RM.matches) {
    const hero = $('.hero-img, .page-hero img, .d-hero img');
    if (hero && y < innerHeight) hero.style.translate = `0 ${y * 0.35}px`;
    const hin = $('.hero-in, .page-hero .wrap');
    if (hin && y < innerHeight) { hin.style.opacity = Math.max(0, 1 - y / 420); hin.style.translate = `0 ${y * -0.12}px`; }
  }
  if (!noHide && innerWidth < 760) {
    const tb = $('#topbar');
    if (y > 140 && y > lastY + 6) tb.classList.add('hide');
    else if (y < lastY - 6 || y < 140) tb.classList.remove('hide');
  }
  const rp = $('.read-prog i');
  if (rp) { const h = document.documentElement.scrollHeight - innerHeight; rp.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`; }
  lastY = y;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { onScroll(); ticking = false; }); } }, { passive: true });

// Indicador deslizante de la barra inferior
function moveTabIndicator() {
  const on = $('.tab.on'), ind = $('.tab-ind'); if (!ind) return;
  if (!on) { ind.style.opacity = 0; return; }
  ind.style.opacity = 1; ind.style.transform = `translateX(${on.offsetLeft + on.offsetWidth / 2 - 14}px)`;
}
addEventListener('resize', moveTabIndicator);

// Arrastrar hacia abajo para cerrar hojas
function enableDrag(panel, onClose) {
  let y0 = null, dy = 0;
  panel.addEventListener('pointerdown', e => {
    if (panel.scrollTop > 0 || e.clientY - panel.getBoundingClientRect().top > 70 || e.target.closest('input,textarea,select,button')) return;
    y0 = e.clientY; dy = 0; panel.style.transition = 'none';
  });
  addEventListener('pointermove', e => { if (y0 == null) return; dy = Math.max(0, e.clientY - y0); panel.style.transform = `translateY(${dy}px)`; });
  addEventListener('pointerup', () => {
    if (y0 == null) return; y0 = null; panel.style.transition = ''; panel.style.transform = '';
    if (dy > 110) onClose();
  });
}

// ---------- Inicio ----------
async function viewHome() {
  const tiles = HOME_ORDER.map(id => byId.cat.get(id)).filter(Boolean).map(c => ({ c, n: placesIn(c.id).length })).filter(x => x.n > 0);
  const picks = [101, 102, 97, 86, 104, 35, 3, 93].map(id => byId.place.get(id)).filter(Boolean).slice(0, 6);
  const routes = ROUTES.slice();
  const revs = (await getReviews()).slice(0, 6);
  const hero = `<section class="hero"><div class="hero-img" style="background-image:url('${imgUrl('recinto')}')"></div>
    <div class="hero-in">${wxHtml()}${holidayChip()}<div class="hero-kicker">${t('hero_kicker')}</div><h1>${t('hero_title')}</h1><p>${t('hero_sub')}</p>
    <button class="hero-search" data-act="search">${ic('search', 'sm')}<span>${t('search_ph')}</span></button></div></section>`;
  const tileHtml = (x, i) => { const st = PARENT_STYLE[x.c.id] || {}; return `<a class="cat-tile reveal ${i === 0 ? 'wide' : ''}" href="#/cat/${x.c.id}">
      <img src="${imgUrl(st.img || 'hero')}" alt="" loading="lazy"><span class="ci">${ic(st.icon || 'pin', 'sm')}</span><b>${esc(catName(x.c))}</b><small>${nPlaces(x.n)}</small></a>`; };
  const routesTile = `<a class="cat-tile reveal" href="#/routes"><img src="${imgUrl('santiago')}" alt="" loading="lazy"><span class="ci">${ic('route', 'sm')}</span><b>${t('routes')}</b><small>${ROUTES.length} ${t('routes').toLowerCase()}</small></a>`;
  const tilesHtml = tiles.map(tileHtml); tilesHtml.splice(2, 0, routesTile);
  setView(`${hero}
  <div class="wrap">
    <section class="section">${secHead(t('explore'), t('what_today'))}<div class="cat-grid">${tilesHtml.join('')}</div></section>
    <div id="home-events">${eventsSection()}</div>
    <section class="section">${secHead(t('reportajes'), t('reportajes'), '#/articles')}
      <div class="stories">${ARTICLES.slice(0, 3).map(a => storyHtml(a)).join('')}</div></section>
    <section class="section">${secHead(t('top_sub'), t('top_picks'), '#/cat/3')}<div class="picks cols">${picks.map(p => rowHtml(p)).join('')}</div></section>
    <section class="section">${secHead(t('plans_kick'), t('plans'))}
      <div class="hscroll plans">${PLANS.map(pl => { const x = tl(pl.t); return `<a class="plan reveal" href="${pl.href}"><div class="plan-img"><img src="${imgUrl(pl.img)}" alt="" loading="lazy"></div><b>${esc(x[0])}</b><small>${esc(x[1])}</small></a>`; }).join('')}</div></section>
    <section class="section">${secHead(t('routes_kick'), t('routes_title'), '#/routes')}<div class="hscroll routes">${routes.slice(0, 6).map(routeCard).join('')}</div></section>
    <section class="section">${secHead(t('reportajes'), t('more_info'))}<div class="hscroll stories-sm">${ARTICLES.slice(3).map(a => storyHtml(a, true)).join('')}</div></section>
    ${bonosBanner()}
    ${guidesSection()}
    ${agendaSection()}
    <section class="section">${secHead(t('reviews_kick'), t('reviews'))}
      ${revs.length ? `<div class="hscroll revs">${revs.map(reviewHtml).join('')}</div>` : `<div class="empty-card">${t('review_empty')}</div>`}
      <div class="cta-row"><button class="btn" data-act="review">${ic('edit', 'sm')}${t('leave_review')}</button></div></section>
    <section class="section">${secHead(t('practical_kick'), t('practical'))}
      <div class="info-grid">
        <a class="info-card alert reveal" href="tel:112"><span class="ic">${ic('phone', 'sm')}</span><b>${t('emergency')} · 112</b><small>${t('emergency_sub')}</small></a>
        <a class="info-card reveal" href="#/place/7"><span class="ic">${ic('info', 'sm')}</span><b>${t('office')}</b><small>${t('office_sub')}</small></a>
        <a class="info-card reveal" href="#/prepara"><span class="ic">${ic('ship', 'sm')}</span><b>${t('prep')}</b><small>${t('prep_sub')}</small></a>
        <a class="info-card reveal" href="#/cat/32"><span class="ic">${ic('shield', 'sm')}</span><b>${t('services')}</b><small>${t('services_sub')}</small></a>
        <div class="info-card reveal"><span class="ic">${ic('ship', 'sm')}</span><b>${t('getting')}</b><small>${t('getting_sub')}</small></div>
      </div></section>
  </div>${footer()}`, { over: true });
}

// ---------- Categoría ----------
let listState = { q: '', sub: 'all', sort: 'az' };
function viewCategory(id, query) {
  const cat = byId.cat.get(id); if (!cat) return viewNotFound();
  const subs = subCats(id).filter(s => PLACES.some(p => p.cat === s.id));
  const preSub = +query.get('sub');
  listState = { q: '', sub: subs.some(s => s.id === preSub) ? preSub : 'all', sort: origin() ? 'near' : 'az' };
  const st = pStyle(id);
  setView(`<section class="page-hero"><img src="${imgUrl(st.img)}" alt=""><div class="wrap"><span class="pill glass">${ic(st.icon, 'xs')}${nPlaces(placesIn(id).length)}</span><h1>${esc(catName(cat))}</h1></div></section>
    <div class="wrap">
      <div class="toolbar"><label class="search-field">${ic('search', 'sm')}<input id="q" type="search" placeholder="${t('search')}…" autocomplete="off"></label>
      ${subs.length ? `<div class="chips" id="subs"><button class="chip" data-sub="all">${t('all')}</button>${subs.map(s => `<button class="chip" data-sub="${s.id}">${esc(catName(s))}</button>`).join('')}</div>` : ''}</div>
      <div class="count-line"><span id="count"></span><button class="sort-btn" id="sort">${ic('sort', 'xs')}<span></span></button></div>
      <div class="pgrid" id="list"></div>
    </div>${footer()}`, { over: true });
  const render = () => {
    const ids = listState.sub === 'all' ? null : listState.sub;
    let list = placesIn(id).filter(p => !ids || p.cat === ids);
    const q = norm(listState.q); if (q) list = list.filter(p => norm(pName(p) + ' ' + pSub(p) + ' ' + p.place).includes(q));
    list.sort(listState.sort === 'near' && origin() ? (a, b) => placeDist(a) - placeDist(b) : (a, b) => {
      const ia = placeImg(a).illus ? 1 : 0, ib = placeImg(b).illus ? 1 : 0; return ia - ib || pName(a).localeCompare(pName(b), lang); });
    $('#count').textContent = t('results', { n: list.length });
    $('#sort span').textContent = listState.sort === 'near' ? t('sort_near') : t('sort_az');
    $$('#subs .chip').forEach(b => b.classList.toggle('on', String(listState.sub) === b.dataset.sub));
    $('#list').innerHTML = list.length ? list.map(cardHtml).join('') : `<div class="empty-card">${t('no_results')}</div>`;
    observeReveal();
  };
  $('#q').addEventListener('input', e => { listState.q = e.target.value; render(); });
  $('#subs')?.addEventListener('click', e => { const b = e.target.closest('[data-sub]'); if (!b) return; listState.sub = b.dataset.sub === 'all' ? 'all' : +b.dataset.sub; render(); });
  $('#sort').addEventListener('click', async () => {
    if (listState.sort === 'az') {
      if (!origin()) { toast(t('gps_searching')); try { await locate(); } catch { return toast(t('gps_denied')); } if (!origin()) toast(t('gps_far')); }
      listState.sort = origin() ? 'near' : 'az';
    } else listState.sort = 'az';
    render();
  });
  render();
}

// ---------- Ficha de lugar ----------
async function viewPlace(id) {
  const p = byId.place.get(id); if (!p) return viewNotFound();
  const c = byId.cat.get(p.cat); const im = placeImg(p); const desc = pDesc(p); const os = openState(p);
  const tel = telHref(p), site = siteHref(p), xa = (window.AUDIO_EXTRA || {})[p.id], audio = xa ? '' : p['audio_' + lang] || p.audio_es;
  const nearby = !hasGeo(p) ? [] : PLACES.filter(x => x.id !== p.id && hasGeo(x)).map(x => [x, dist(p.lat, p.lon, x.lat, x.lon)]).filter(([, d]) => d < 800).sort((a, b) => a[1] - b[1]).slice(0, 4);
  const acts = [
    tel ? `<a class="act" href="${tel}"><span class="ac">${ic('phone', 'sm')}</span>${t('call')}</a>` : `<a class="act" href="${gmapsSearch(p)}" target="_blank" rel="noopener"><span class="ac">${ic('ext', 'sm')}</span>${t('gmaps')}</a>`,
    isMobile(p) ? `<a class="act wa" href="${waHref('34' + phoneDigits(p))}" target="_blank" rel="noopener"><span class="ac">${icWa('sm')}</span>WhatsApp</a>` :
      site ? `<a class="act" href="${esc(site)}" target="_blank" rel="noopener"><span class="ac">${ic('globe', 'sm')}</span>${t('website')}</a>` :
      `<button class="act" data-act="share"><span class="ac">${ic('share', 'sm')}</span>${t('share')}</button>`,
    `<a class="act" href="${gmapsDir(p)}" target="_blank" rel="noopener"><span class="ac">${ic('nav', 'sm')}</span>${t('directions')}</a>`,
    `<button class="act fav ${favs.has(p.id) ? 'on' : ''}" data-fav="${p.id}"><span class="ac">${ic('heart', 'sm')}</span>${t('save')}</button>`
  ];
  const revs = await getReviews(p.id);
  setView(`<div class="d-hero"><img id="d-hero-img" src="${esc(im.src)}" alt="${esc(pName(p))}" onerror="this.src='img/hero.jpg'"><div class="photo-credit" id="photo-credit" hidden></div></div>
  <div class="d-card"><div class="wrap two-col"><div>
    <span class="pill soft">${ic(pStyle(p.cat).icon, 'xs')}${esc(catName(c))}</span>
    <h1 class="d-title">${esc(pName(p))}</h1>
    <div class="d-sub">${pSub(p) ? `<span>${esc(pSub(p))}</span>` : ''}${os ? `<span class="tag ${os.open ? 'ok' : 'bad'}">${esc(os.label)}</span><span>${esc(os.sub)}</span>` : ''}${distTag(p)}</div>
    <div class="actions" id="d-actions">${acts.join('')}</div>
    <div id="g-extra"></div>
    ${canReserve(p) ? `<button class="btn full" style="margin-top:12px" data-act="reserve" data-id="${p.id}">${ic('calendar', 'sm')}${t('reserve')}</button>` : ''}
    ${(site && isMobile(p)) ? `<a class="btn ghost full" style="margin-top:10px" href="${esc(site)}" target="_blank" rel="noopener">${ic('globe', 'sm')}${t('website')}</a>` : ''}
    ${audio ? `<div class="block"><h3>${ic('headphones', 'sm')}${t('audio_guide')}</h3>${playerHtml(asset(audio), pName(p))}</div>` : ''}
    ${p.video ? `<button class="btn ghost full" style="margin-top:14px" data-act="video" data-url="${esc(p.video)}">${ic('video', 'sm')}${t('watch_video')}</button>` : ''}
    ${desc ? `<div class="block"><h3>${ic('info', 'sm')}${t('description')}</h3><p>${esc(desc).replace(/\n/g, '<br>')}</p></div>` : ''}
    ${!tel && !site ? `<a class="notice" href="${gmapsSearch(p)}" target="_blank" rel="noopener">${ic('info', 'sm')}<span>${t('gmaps_long')}</span></a>` : ''}
    ${xa ? audioLangBlock(xa, pName(p)) : ''}
    ${p._check && p._check.note ? `<p class="check-note">${ic('info', 'xs')} ${esc(p._check.note)}</p>` : ''}
    ${p._check && p._check.status === 'notfound' ? `<a class="notice" href="${gmapsSearch(p)}" target="_blank" rel="noopener">${ic('info', 'sm')}<span>${t('check_unconfirmed')}</span></a>` : ''}
    ${p._check && p._check.source ? `<p class="check-src">${t('check_src', { d: new Date(p._check.date).toLocaleDateString(lang === 'ar' ? 'ar' : lang) })} · <a href="${esc(p._check.source)}" target="_blank" rel="noopener">${esc(new URL(p._check.source).hostname.replace('www.', ''))}</a></p>` : ''}
    ${im.illus ? `<p class="muted" id="illus-note" style="font-size:12px;margin-top:10px">${t('photo_note')}</p>` : ''}
  </div><div class="side">
    <div id="g-hours"></div>
    ${p.horario ? `<div class="block"><h3>${ic('clock', 'sm')}${t('hours')}</h3><div class="hours">${esc(clean(p.horario))}</div>${holidayOn(madridToday()) ? `<div class="notice">${ic('calendar', 'sm')}<span><b>${t('today_holiday')}</b> · ${t('holiday_note')}</span></div>` : ''}</div>` : ''}
    ${hasGeo(p) ? `<div class="block"><h3>${ic('pin', 'sm')}${t('location')}</h3><div class="mini-map" id="mini-map"></div><div class="muted" style="font-size:13px;margin-top:8px">${esc(p.place || '')}</div></div>` : ''}
    ${nearby.length ? `<div class="block"><h3>${ic('near', 'sm')}${t('nearby_here')}</h3>${nearby.map(([x, d]) => rowHtml(x, `<span class="tag">${fmtDist(d)}</span>`)).join('')}</div>` : ''}
    <div class="block"><h3>${ic('star', 'sm')}${t('reviews_kick')}</h3>
      ${revs.length ? revs.slice(0, 5).map(r => reviewHtml(r).replace('class="rev reveal"', 'class="rev" style="width:auto;max-width:none;box-shadow:none;padding:12px 0;border-bottom:1px solid var(--line);border-radius:0"')).join('') : `<p class="muted" style="font-size:14px">${t('review_empty')}</p>`}
      <button class="btn ghost full" style="margin-top:12px" data-act="review" data-id="${p.id}">${ic('edit', 'sm')}${t('leave_review')}</button></div>
  </div></div></div>${footer()}`, { over: true });
  if (hasGeo(p)) {
    const m = L.map('mini-map', { zoomControl: false, dragging: !L.Browser.mobile, scrollWheelZoom: false, tap: false }).setView([p.lat, p.lon], 16);
    tiles(m); L.marker([p.lat, p.lon], { icon: markerIcon(p) }).addTo(m); maps.push(m);
  }
  bindPlayer();
  enhancePlace(p);
}

// ---------- Google Places: foto, horario, teléfono y valoración en la ficha ----------
let gLib = null;
function loadGoogle() {
  if (!CONFIG.GOOGLE_MAPS_KEY) return Promise.resolve(null);
  if (gLib) return gLib;
  gLib = new Promise((res, rej) => {
    window.__vmGmaps = res;
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(CONFIG.GOOGLE_MAPS_KEY)}&v=weekly&loading=async&language=${lang}&region=ES&callback=__vmGmaps`;
    s.async = true; s.onerror = rej; document.head.appendChild(s);
  }).then(() => google.maps.importLibrary('places')).catch(() => null);
  return gLib;
}
// Solo se guarda el identificador de Google de cada lugar (lo permiten sus condiciones); el resto se pide al abrir la ficha
const gIds = store.get('vm_gplace2', {});
// Solo se acepta la ficha de Google si está cerca Y el nombre coincide (evita poner la foto de otro negocio)
const GENERIC = /\b(restaurante|restaurant|bar|cafeteria|cafe|caf|pizzeria|pub|hotel|hostal|pension|tienda|la|el|los|las|de|del|y|melilla|cb|sl)\b/g;
const nameTokens = s => norm(s).replace(/[^a-z0-9 ]/g, ' ').replace(GENERIC, ' ').split(/\s+/).filter(w => w.length >= 3);
function sameName(a, b) {
  const ta = nameTokens(a), tb = nameTokens(b);
  if (!ta.length || !tb.length) return norm(a).replace(/\W/g, '') === norm(b).replace(/\W/g, '');
  const ca = ta.join(''), cb = tb.join('');
  return ta.some(w => tb.includes(w)) || ca.includes(cb) || cb.includes(ca);
}
async function findGoogleId(lib, p) {
  if (gIds[p.id] !== undefined) return gIds[p.id];
  let id = '';
  try {
    const { places } = await lib.Place.searchByText({
      textQuery: `${p.title}, Melilla`, fields: ['id', 'location', 'displayName'], maxResultCount: 3,
      locationBias: { center: { lat: p.lat, lng: p.lon }, radius: 500 }, language: 'es', region: 'es'
    });
    const hit = (places || []).find(h => h.location && dist(p.lat, p.lon, h.location.lat(), h.location.lng()) < 600 && sameName(p.title, h.displayName || ''));
    id = hit ? hit.id : '';
  } catch { return null; }
  gIds[p.id] = id; store.set('vm_gplace2', gIds);
  return id;
}
const gCache = new Map();
async function googlePlace(p) {
  const lib = await loadGoogle(); if (!lib) return null;
  if (gCache.has(p.id)) return gCache.get(p.id);
  const id = await findGoogleId(lib, p);
  if (id === null) return null;
  if (!id) { gCache.set(p.id, null); return null; }
  try {
    const place = new lib.Place({ id, requestedLanguage: lang });
    await place.fetchFields({ fields: ['displayName', 'nationalPhoneNumber', 'regularOpeningHours', 'utcOffsetMinutes', 'websiteURI', 'photos', 'googleMapsURI', 'rating', 'userRatingCount', 'businessStatus'] });
    let open; try { open = await place.isOpen(); } catch {}
    const data = { place, open }; gCache.set(p.id, data); return data;
  } catch { return null; }
}
// Foto real de Google en tarjetas y filas: solo para lugares sin foto propia y solo cuando aparecen en pantalla
const gAttr = (p, im) => (CONFIG.GOOGLE_MAPS_KEY && CONFIG.GOOGLE_PHOTOS_IN_LISTS && im.illus) ? ` data-gphoto="${p.id}"` : '';
const gPhotoCache = new Map();
async function googlePhoto(p) {
  if (gPhotoCache.has(p.id)) return gPhotoCache.get(p.id);
  const job = (async () => {
    const full = gCache.get(p.id);
    if (full) return full.place.photos?.[0] || null;
    const lib = await loadGoogle(); if (!lib) return null;
    const id = await findGoogleId(lib, p);
    if (!id) return null;
    try { const place = new lib.Place({ id }); await place.fetchFields({ fields: ['photos'] }); return place.photos?.[0] || null; } catch { return null; }
  })();
  gPhotoCache.set(p.id, job);
  return job;
}
let gIO = null;
function observeGooglePhotos() {
  if (!CONFIG.GOOGLE_MAPS_KEY || !CONFIG.GOOGLE_PHOTOS_IN_LISTS) return;
  gIO = gIO || new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const box = e.target; gIO.unobserve(box);
    const p = byId.place.get(+box.dataset.gphoto); if (!p) return;
    googlePhoto(p).then(ph => {
      if (!ph || !box.isConnected) return;
      const img = box.querySelector('img'); const url = ph.getURI({ maxWidth: 700 });
      const pre = new Image(); pre.onload = () => { img.src = url; img.classList.add('g-swap'); }; pre.src = url;
      const a = (ph.authorAttributions || [])[0];
      if (a && !box.querySelector('.g-credit')) box.insertAdjacentHTML('beforeend', `<span class="g-credit">© ${esc(a.displayName)}</span>`);
    });
  }), { rootMargin: '200px' });
  $$('[data-gphoto]:not([data-gseen])').forEach(el => { el.dataset.gseen = 1; gIO.observe(el); });
}
new MutationObserver(() => observeGooglePhotos()).observe(document.getElementById('view'), { childList: true, subtree: true });

function photoCredit(photo) {
  const a = (photo.authorAttributions || [])[0]; if (!a) return '';
  return `${t('g_photo_by')} ${a.uri ? `<a href="${esc(a.uri)}" target="_blank" rel="noopener">${esc(a.displayName)}</a>` : esc(a.displayName)}`;
}
async function enhancePlace(p) {
  if (!CONFIG.GOOGLE_MAPS_KEY) return;
  $('#g-extra').innerHTML = `<div class="g-loading skel"></div>`;
  const g = await googlePlace(p);
  if (location.hash.split('?')[0] !== `#/place/${p.id}`) return;
  if (!g) { $('#g-extra').innerHTML = ''; return; }
  const pl = g.place, photos = (pl.photos || []).slice(0, 7);
  if (photos.length && !p._ownPhoto) {
    const img = $('#d-hero-img'), big = photos[0].getURI({ maxWidth: 1600 });
    const pre = new Image(); pre.onload = () => { img.src = big; img.classList.add('g-swap'); }; pre.src = big;
    const cr = $('#photo-credit'); cr.innerHTML = photoCredit(photos[0]); cr.hidden = !cr.innerHTML;
    $('#illus-note')?.remove();
  }
  if (!p.phone && pl.nationalPhoneNumber) {
    p._gphone = pl.nationalPhoneNumber;
    const first = $('#d-actions .act'); if (first) first.outerHTML = `<a class="act" href="${telHref(p)}"><span class="ac">${ic('phone', 'sm')}</span>${t('call')}</a>`;
    if (isMobile(p)) { const second = $$('#d-actions .act')[1]; if (second) second.outerHTML = `<a class="act wa" href="${waHref('34' + phoneDigits(p))}" target="_blank" rel="noopener"><span class="ac">${icWa('sm')}</span>WhatsApp</a>`; }
  }
  const status = pl.businessStatus === 'CLOSED_PERMANENTLY' ? `<div class="notice bad-n">${ic('info', 'sm')}<span>${t('g_closed_perm')}</span></div>`
    : pl.businessStatus === 'CLOSED_TEMPORARILY' ? `<div class="notice bad-n">${ic('info', 'sm')}<span>${t('g_closed_temp')}</span></div>` : '';
  const rating = pl.rating ? `<a class="g-rating" href="${esc(pl.googleMapsURI || gmapsSearch(p))}" target="_blank" rel="noopener"><b>${pl.rating.toFixed(1)}</b>${starsHtml(Math.round(pl.rating))}<span>${t('g_reviews', { n: (pl.userRatingCount || 0).toLocaleString(lang) })}</span></a>` : '';
  const site = !siteHref(p) && pl.websiteURI ? `<a class="btn ghost full" style="margin-top:10px" href="${esc(pl.websiteURI)}" target="_blank" rel="noopener">${ic('globe', 'sm')}${t('website')}</a>` : '';
  const gallery = photos.length > 1 ? `<div class="g-gallery">${photos.slice(1).map(ph => `<figure><img src="${esc(ph.getURI({ maxWidth: 400 }))}" data-full="${esc(ph.getURI({ maxWidth: 1600 }))}" alt="" loading="lazy" data-zoom><figcaption>${photoCredit(ph)}</figcaption></figure>`).join('')}</div>` : '';
  $('#g-extra').innerHTML = status + rating + site + gallery + `<p class="g-src">${t('g_source')} · <a href="${esc(pl.googleMapsURI || gmapsSearch(p))}" target="_blank" rel="noopener">Google Maps</a></p>`;
  const days = pl.regularOpeningHours?.weekdayDescriptions;
  if (days && days.length && !p._ownHours) {
    const openTag = g.open === true ? `<span class="tag ok">${t('open_now')}</span>` : g.open === false ? `<span class="tag bad">${t('closed_now')}</span>` : '';
    const todayIdx = (madridNow().day + 6) % 7;
    $('#g-hours').innerHTML = `<div class="block"><h3>${ic('clock', 'sm')}${t('hours')} ${openTag}</h3><ul class="g-hours">${days.map((d, i) => `<li class="${i === todayIdx ? 'today' : ''}">${esc(d)}</li>`).join('')}</ul>
      ${holidayOn(madridToday()) ? `<div class="notice">${ic('calendar', 'sm')}<span><b>${t('today_holiday')}</b> · ${t('holiday_note')}</span></div>` : ''}<p class="g-src">Google Maps</p></div>`;
    $$('.side .block').forEach(b => { if (b.querySelector('.hours')) b.remove(); });
  }
  prepImages($('#g-extra'));
}

// ---------- Rutas ----------
function viewRoutes() {
  setView(`<section class="page-hero"><img src="${imgUrl('santiago')}" alt=""><div class="wrap"><span class="pill glass">${ic('headphones', 'xs')}${ROUTES.length} ${t('routes').toLowerCase()}</span><h1>${t('routes_title')}</h1></div></section>
    <div class="wrap section"><div class="hscroll routes">${ROUTES.map(routeCard).join('')}</div>
      <a class="info-card reveal" style="margin-top:16px" href="#/visitas"><span class="ic">${ic('landmark', 'sm')}</span><b>${t('vis_title')}</b><small>${t('vis_sub')}</small></a></div>${footer()}`, { over: true });
}
function viewRoute(id) {
  const r = byId.route.get(id); if (!r) return viewNotFound();
  const s = routeStats(r); const stops = r.postIds.map(pid => byId.place.get(pid)).filter(Boolean);
  setView(`<section class="page-hero"><img src="${imgUrl(ROUTE_IMG[r.id] || 'hero')}" alt=""><div class="wrap">
    <span class="pill glass">${ic('walk', 'xs')}${t('walk_time', { n: s.mins })}</span><h1>${esc(rName(r))}</h1></div></section>
    <div class="wrap two-col" style="margin-top:18px"><div>
      <div class="stats" style="margin:0 0 6px"><span>${ic('pin', 'xs')}${s.n} ${t('stops')}</span>${s.m > 0 ? `<span>${ic('route', 'xs')}${fmtDist(s.m)}</span>` : ''}${s.audio ? `<span>${ic('headphones', 'xs')}${t('with_audio')}</span>` : ''}</div>
      <div class="block"><p>${esc(rDesc(r))}…</p></div>
      <div class="section" style="margin-top:22px">${secHead(t('stops_list'), t('stops_list'))}
      <div class="timeline">${stops.map((p, i) => `<div class="stop reveal"><span class="num">${i + 1}</span><a class="stop-card" href="#/place/${p.id}">
        <div class="row-img"><img src="${esc(placeImg(p).src)}" alt="" loading="lazy" onerror="this.src='img/hero.jpg'"></div>
        <div class="row-body"><b>${esc(pName(p))}</b><div class="row-meta">${openTag(p)}${hasAudio(p) ? `<span class="tag">${ic('headphones', 'xs')}</span>` : ''}${distTag(p)}</div></div></a></div>`).join('')}</div></div>
    </div><div class="side">
      <div class="block"><div class="mini-map" id="route-map" style="height:300px"></div></div>
      <div class="sticky-cta"><a class="btn full" href="#/map?route=${r.id}">${ic('nav', 'sm')}${t('start_route')}</a></div>
    </div></div>${footer()}`, { over: true });
  const m = L.map('route-map', { zoomControl: false, dragging: !L.Browser.mobile, scrollWheelZoom: false, tap: false });
  tiles(m); drawRoute(m, r); maps.push(m);
}
function drawRoute(m, r) {
  const pts = [];
  r.postIds.map(id => byId.place.get(id)).filter(hasGeo).forEach((p, i) => {
    pts.push([p.lat, p.lon]);
    L.marker([p.lat, p.lon], { icon: L.divIcon({ className: '', html: `<div class="mk-num" style="animation-delay:${i * 60}ms">${i + 1}</div>`, iconSize: [30, 30], iconAnchor: [15, 15] }) })
      .addTo(m).on('click', () => mapCard(p, m));
  });
  if (pts.length > 1) L.polyline(pts, { color: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#E2733B', weight: 4, dashArray: '2 8', lineCap: 'round' }).addTo(m);
  if (pts.length) m.fitBounds(pts, { padding: [30, 30] });
}

// ---------- Mapa ----------
function tiles(m) {
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(m);
}
function markerIcon(p) {
  const st = pStyle(p.cat);
  return L.divIcon({ className: '', html: `<div class="mk" style="background:${st.color};animation-delay:${(p.id % 24) * 22}ms">${ic(st.icon)}</div>`, iconSize: [34, 34], iconAnchor: [17, 34] });
}
let meMarker = null;
function mapCard(p, m) {
  $('.map-card')?.remove();
  const el = document.createElement('div'); el.className = 'map-card';
  el.innerHTML = `<button class="x" aria-label="${t('close')}">${ic('x', 'xs')}</button>${rowHtml(p).replace('class="row"', 'class="row" style="border:0;padding:0;flex:1"')}`;
  el.querySelector('.x').onclick = () => el.remove();
  ($('.map-page') || m.getContainer().parentElement).appendChild(el);
}
function viewMap(query) {
  const routeId = +query.get('route'); const r = routeId ? byId.route.get(routeId) : null;
  const parents = HOME_ORDER.filter(id => byId.cat.has(id) && placesIn(id).some(p => p.lat));
  setView(`<div class="map-page"><div id="bigmap"></div>
    ${r ? `<div class="map-chips"><div class="chips"><span class="chip on">${ic('route', 'xs')}${esc(rName(r))}</span><a class="chip" href="#/map">${ic('x', 'xs')}</a></div></div>` :
    `<div class="map-chips"><div class="chips" id="mchips"><button class="chip on" data-f="all">${t('map_all')}</button>${parents.map(id => `<button class="chip" data-f="${id}"><span style="width:10px;height:10px;border-radius:50%;background:${PARENT_STYLE[id].color}"></span>${esc(catName(byId.cat.get(id)))}</button>`).join('')}</div></div>`}
    <button class="map-fab" id="locate" aria-label="${t('locate')}">${ic('near')}</button></div>`, { noAnim: true });
  const m = L.map('bigmap', { zoomControl: false }).setView(CONFIG.CENTER, 15);
  tiles(m); maps.push(m);
  let layer = L.layerGroup().addTo(m);
  const draw = f => {
    layer.clearLayers();
    PLACES.filter(p => hasGeo(p) && (f === 'all' || parentId(p.cat) === f)).forEach(p => L.marker([p.lat, p.lon], { icon: markerIcon(p) }).addTo(layer).on('click', () => mapCard(p, m)));
  };
  if (r) drawRoute(m, r); else draw('all');
  $('#mchips')?.addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; $$('#mchips .chip').forEach(x => x.classList.toggle('on', x === b)); $('.map-card')?.remove(); draw(b.dataset.f === 'all' ? 'all' : +b.dataset.f); });
  const showMe = (center) => {
    if (!me) return; meMarker = L.marker([me.lat, me.lon], { icon: L.divIcon({ className: '', html: '<div class="me-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }), zIndexOffset: 1000 }).addTo(m);
    if (center) { if (origin()) m.setView([me.lat, me.lon], 16); else toast(t('gps_far')); }
  };
  $('#locate').onclick = async () => { toast(t('gps_searching')); try { await locate(); showMe(true); startWatch(m); } catch { toast(t('gps_denied')); } };
  if (me) showMe(false);
  if (r) { locate().then(() => { showMe(false); startWatch(m); }).catch(() => {}); }
  setTimeout(() => m.invalidateSize(), 50);
}
function startWatch(m) {
  if (!navigator.geolocation || watchId != null) return;
  watchId = navigator.geolocation.watchPosition(pos => { me = { lat: pos.coords.latitude, lon: pos.coords.longitude }; if (meMarker && maps.includes(m)) meMarker.setLatLng([me.lat, me.lon]); }, () => {}, { enableHighAccuracy: true });
}

// ---------- Cerca de mí ----------
async function viewNear() {
  setView(`<div class="wrap" style="padding-top:20px"><div class="kicker">${ic('near', 'xs')} GPS</div><h1 class="d-title">${t('near_title')}</h1><p class="muted">${t('near_sub')}</p>
    <div class="chips" id="nchips" style="margin-top:8px"></div><div id="near-list" class="picks" style="margin-top:12px"><div class="empty-card" style="border:0">${t('gps_searching')}</div></div></div>${footer()}`);
  let far = false;
  try { await locate(); if (!origin()) far = true; } catch { $('#near-list').innerHTML = `<div class="empty-card" style="border:0">${t('gps_denied')}</div>`; return; }
  const o = origin() || { lat: CONFIG.CENTER[0], lon: CONFIG.CENTER[1] };
  const parents = HOME_ORDER.filter(id => byId.cat.has(id) && placesIn(id).length);
  let f = 'all';
  const render = () => {
    const list = PLACES.filter(p => hasGeo(p) && (f === 'all' || parentId(p.cat) === f)).map(p => [p, dist(o.lat, o.lon, p.lat, p.lon)]).sort((a, b) => a[1] - b[1]).slice(0, 40);
    $('#nchips').innerHTML = `<button class="chip ${f === 'all' ? 'on' : ''}" data-f="all">${t('all')}</button>` + parents.map(id => `<button class="chip ${f === id ? 'on' : ''}" data-f="${id}">${ic(PARENT_STYLE[id].icon, 'xs')}${esc(catName(byId.cat.get(id)))}</button>`).join('');
    $('#near-list').innerHTML = (far ? `<div class="notice">${ic('info', 'sm')}<span>${t('gps_far')}</span></div>` : '') + list.map(([p, d]) => rowHtml(p, `<span class="tag brand">${fmtDist(d)}</span>`)).join('');
  };
  $('#nchips').addEventListener('click', e => { const b = e.target.closest('[data-f]'); if (!b) return; f = b.dataset.f === 'all' ? 'all' : +b.dataset.f; render(); });
  render();
}

// ---------- Reportajes ----------
function viewArticles() {
  setView(`<section class="page-hero"><img src="${imgUrl('hero')}" alt=""><div class="wrap"><h1>${t('reportajes')}</h1></div></section>
    <div class="wrap section"><div class="pgrid">${ARTICLES.map(a => storyHtml(a)).join('')}</div></div>${footer()}`, { over: true });
}
function viewArticle(id) {
  const a = ARTICLES.find(x => x.id === id); if (!a) return viewNotFound();
  const x = tl(a.t);
  let places = a.places.map(pid => byId.place.get(pid)).filter(Boolean);
  if (a.food) places = placesIn(1).filter(p => /marroqui|marisco|tapas|mediterranea/.test(norm(p.sub))).slice(0, 8);
  setView(`<div class="read-prog" aria-hidden="true"><i></i></div><section class="page-hero" style="height:clamp(340px,60vh,560px)"><img src="${imgUrl(a.img)}" alt=""><div class="wrap">
    <span class="pill">${esc(x.cat)}</span><h1>${esc(x.title)}</h1><p>${ic('clock', 'xs')} ${t('min_read', { n: a.read })}</p></div></section>
    <div class="wrap"><article class="article">
      <p class="lead">${esc(x.excerpt)}</p>
      ${x.body.map((b, i) => `<p class="body">${esc(b)}</p>${i === 0 ? `<div class="gallery">${a.gallery.map(g => `<img src="${imgUrl(g)}" alt="" loading="lazy" data-zoom>`).join('')}</div>` : ''}`).join('')}
      ${a.beaches ? `<div class="section">${secHead(t('directions'), tl(a.t).cat)}<div class="picks">${a.beaches.map(([n, img]) => `<a class="row" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n + ', Melilla')}" target="_blank" rel="noopener"><div class="row-img"><img src="${imgUrl(img)}" alt="" loading="lazy"></div><div class="row-body"><b>${esc(n)}</b><div class="row-meta"><span class="tag">${ic('waves', 'xs')}${t('directions')}</span></div></div><span class="muted">${ic('ext', 'sm')}</span></a>`).join('')}</div></div>` : ''}
      ${a.route ? `<div class="section"><a class="btn full" href="#/route/${a.route}">${ic('route', 'sm')}${t('related_route')}: ${esc(rName(byId.route.get(a.route) || { title: '' }))}</a></div>` : ''}
      ${places.length ? `<div class="section">${secHead(t('in_article'), t('in_article'))}<div class="picks">${places.map(p => rowHtml(p)).join('')}</div></div>` : ''}
    </article>
    <div class="section">${secHead(t('reportajes'), t('more_info'))}<div class="hscroll stories-sm">${ARTICLES.filter(o => o.id !== a.id).slice(0, 3).map(o => storyHtml(o, true)).join('')}</div></div>
    </div>${footer()}`, { over: true });
}

// ---------- Favoritos / créditos / 404 ----------
// ---------- Calendario ----------
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const parseIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
function madridToday() {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: CONFIG.TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  return p;
}
const daysBetween = (a, b) => Math.round((parseIso(b) - parseIso(a)) / 864e5);
const holidayOn = d => HOLIDAYS.find(h => h.d === d);
const festivalsOn = d => FESTIVALS.filter(f => f.from <= d && d <= f.to);
const eventsOn = d => (EVENTS || []).filter(e => !evLong(e) && e.from <= d && d <= e.to);
const locTag = () => lang === 'ar' ? 'ar' : lang;
const fmtDay = (d, o = { weekday: 'long', day: 'numeric', month: 'long' }) => parseIso(d).toLocaleDateString(locTag(), o);
const kindLabel = k => t('k_' + k);
function nextHoliday(from = madridToday()) { return HOLIDAYS.filter(h => h.d >= from).sort((a, b) => a.d.localeCompare(b.d))[0]; }
function whenLabel(d) { const n = daysBetween(madridToday(), d); return n === 0 ? t('today') : n === 1 ? t('in_1day') : t('in_days', { n }); }

function holidayChip() {
  const today = madridToday(), tom = iso(...(() => { const x = parseIso(today); x.setDate(x.getDate() + 1); return [x.getFullYear(), x.getMonth(), x.getDate()]; })());
  const h = holidayOn(today) || holidayOn(tom); if (!h) return '';
  return `<a class="wx hol-chip" href="#/calendar">${ic('calendar', 'sm')}<b>${t(h.d === today ? 'today_holiday' : 'tomorrow_holiday')}</b><span>${esc(tl(h.n))}</span></a>`;
}
function agendaSection() {
  const today = madridToday();
  const items = [
    ...HOLIDAYS.filter(h => h.d >= today).map(h => ({ d: h.d, title: tl(h.n), kind: h.k, img: null })),
    ...FESTIVALS.filter(f => f.to >= today).map(f => ({ d: f.from < today ? today : f.from, title: tl(f.n), kind: 'fest', img: f.img, approx: f.approx }))
  ].sort((a, b) => a.d.localeCompare(b.d)).slice(0, 4);
  if (!items.length) return '';
  return `<section class="section">${secHead(t('cal_kick'), t('cal_title'), '#/calendar')}
    <div class="agenda">${items.map(it => `<a class="ag-item reveal" href="#/calendar?d=${it.d}">${dateBadge(it.d, it.kind)}
      <div class="row-body"><b>${esc(it.title)}</b><div class="row-meta"><span class="tag ${it.kind === 'fest' ? 'brand' : 'bad'}">${kindLabel(it.kind)}</span><span class="tag">${whenLabel(it.d)}</span>${it.approx ? `<span class="tag">${t('approx')}</span>` : ''}</div></div>
      <span class="muted chev">${ic('chev', 'sm')}</span></a>`).join('')}</div></section>`;
}
function dateBadge(d, kind) {
  const x = parseIso(d);
  return `<div class="date-badge k-${kind}"><small>${x.toLocaleDateString(locTag(), { month: 'short' }).replace('.', '')}</small><b>${x.getDate()}</b></div>`;
}
function icsFor(h) {
  const d = h.d.replace(/-/g, ''); const e = parseIso(h.d); e.setDate(e.getDate() + 1);
  const end = iso(e.getFullYear(), e.getMonth(), e.getDate()).replace(/-/g, '');
  const txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Visitar Melilla//ES', 'BEGIN:VEVENT', `UID:${d}-${h.k}@visitarmelilla.es`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${end}`, `SUMMARY:${tl(h.n).replace(/[,;]/g, ' ')} (Melilla)`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  return URL.createObjectURL(new Blob([txt], { type: 'text/calendar' }));
}
let calMonth = null;
function viewCalendar(query) {
  const today = madridToday();
  const sel = query.get('d') || today;
  const base = parseIso(sel);
  calMonth = { y: base.getFullYear(), m: base.getMonth() };
  const nh = nextHoliday();
  setView(`<section class="page-hero"><img src="${imgUrl('plazaespana')}" alt=""><div class="wrap"><span class="pill glass">${ic('calendar', 'xs')}${t('cal_kick')}</span><h1>${t('cal_title')}</h1></div></section>
  <div class="wrap two-col" style="margin-top:18px"><div>
    ${nh ? `<div class="next-hol reveal">${dateBadge(nh.d, nh.k)}<div class="row-body"><small class="muted">${t('next_holiday')}</small><b>${esc(tl(nh.n))}</b>
      <div class="row-meta"><span class="tag bad">${whenLabel(nh.d)}</span><span class="tag">${esc(fmtDay(nh.d))}</span></div></div></div>` : ''}
    <div class="cal block" id="cal"></div>
    <div id="cal-day"></div>
    <div class="notice">${ic('info', 'sm')}<span>${t('holiday_note')}</span></div>
  </div><div class="side">
    <div class="block"><h3>${ic('calendar', 'sm')}${t('upcoming')}</h3><div id="cal-up"></div><p class="muted" style="font-size:12px;margin-top:10px">${t('cal_source')}</p></div>
  </div></div>
  <div class="wrap section">${secHead(t('cal_kick'), t('festivals'))}
    <div class="hscroll stories-sm">${FESTIVALS.filter(f => f.to >= today).map(f => `<a class="story sm reveal" href="#/calendar?d=${f.from < today ? today : f.from}"><img src="${imgUrl(f.img)}" alt="" loading="lazy">
      <div class="story-body"><span class="pill">${esc(f.from === f.to ? fmtDay(f.from, { day: 'numeric', month: 'short' }) : fmtDay(f.from, { day: 'numeric', month: 'short' }) + ' – ' + fmtDay(f.to, { day: 'numeric', month: 'short' }))}</span>
      <h3>${esc(tl(f.n))}</h3><p>${esc(tl(f.s))}</p>${f.approx ? `<div class="story-meta"><span>${ic('info', 'xs')}${t('approx')}</span></div>` : ''}</div></a>`).join('')}</div>
    <p class="muted" style="font-size:13px;margin-top:10px">${t('approx_note')}</p>
  </div>${footer()}`, { over: true });

  $('#cal-up').innerHTML = HOLIDAYS.filter(h => h.d >= today).slice(0, 8).map(h => `<div class="row">${dateBadge(h.d, h.k)}<div class="row-body"><b>${esc(tl(h.n))}</b>
    <div class="row-meta"><span class="tag ${h.k === 'loc' ? 'brand' : 'bad'}">${kindLabel(h.k)}</span><span class="tag">${whenLabel(h.d)}</span>${h.pending ? `<span class="tag">${t('pending')}</span>` : ''}</div></div>
    <a class="icon-btn" href="${icsFor(h)}" download="melilla-${h.d}.ics" aria-label="${t('add_cal')}" title="${t('add_cal')}">${ic('calendar', 'sm')}</a></div>`).join('');

  let selected = sel;
  const drawMonth = (dir = 0) => {
    const { y, m } = calMonth;
    const first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
    const offset = (first.getDay() + 6) % 7;
    const wk = [...Array(7)].map((_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(locTag(), { weekday: 'narrow' }));
    const title = first.toLocaleDateString(locTag(), { month: 'long', year: 'numeric' });
    const minM = '2026-01', maxM = '2027-12', cur = `${y}-${String(m + 1).padStart(2, '0')}`;
    let cells = '';
    for (let i = 0; i < offset; i++) cells += '<span></span>';
    for (let d = 1; d <= days; d++) {
      const ds = iso(y, m, d), h = holidayOn(ds), f = festivalsOn(ds).length, ev = eventsOn(ds).length, wd = (offset + d - 1) % 7;
      cells += `<button class="cd ${h ? 'h k-' + h.k : ''} ${f ? 'f' : ''} ${ds === today ? 'today' : ''} ${ds === selected ? 'sel' : ''} ${wd === 6 ? 'sun' : ''} ${ev ? 'e' : ''}" data-d="${ds}" aria-label="${esc(fmtDay(ds))}${h ? ' · ' + esc(tl(h.n)) : ''}">${d}<span class="dots">${f ? '<i></i>' : ''}${ev ? '<i class="ev"></i>' : ''}</span></button>`;
    }
    $('#cal').innerHTML = `<div class="cal-head"><button class="icon-btn" data-m="-1" ${cur <= minM ? 'disabled' : ''} aria-label="‹"><span class="flip">${ic('back', 'sm')}</span></button>
      <b>${esc(title)}</b><button class="icon-btn" data-m="1" ${cur >= maxM ? 'disabled' : ''} aria-label="›"><span class="flip">${ic('chev', 'sm')}</span></button></div>
      <div class="cal-grid wk">${wk.map(w => `<span>${esc(w)}</span>`).join('')}</div>
      <div class="cal-grid days ${dir > 0 ? 'from-r' : dir < 0 ? 'from-l' : ''}">${cells}</div>
      <div class="cal-legend"><span><i class="lg k-nat"></i>${t('k_nat')}</span><span><i class="lg k-reg"></i>${t('k_reg')}</span><span><i class="lg k-loc"></i>${t('k_loc')}</span><span><i class="lg f"></i>${t('k_fest')}</span><span><i class="lg ev"></i>${t('events')}</span></div>`;
  };
  const drawDay = () => {
    const h = holidayOn(selected), fs = festivalsOn(selected), evs = eventsOn(selected);
    $('#cal-day').innerHTML = `<div class="block cal-day"><h3>${ic('calendar', 'sm')}${esc(fmtDay(selected))}</h3>
      ${!h && !fs.length && !evs.length ? `<p class="muted" style="font-size:14px">${t('no_events')}</p>` : ''}
      ${h ? `<div class="row">${dateBadge(h.d, h.k)}<div class="row-body"><b>${esc(tl(h.n))}</b><div class="row-meta"><span class="tag bad">${kindLabel(h.k)}</span>${h.pending ? `<span class="tag">${t('pending')}</span>` : ''}</div></div>
        <a class="icon-btn" href="${icsFor(h)}" download="melilla-${h.d}.ics" aria-label="${t('add_cal')}">${ic('calendar', 'sm')}</a></div>` : ''}
      ${fs.map(f => `<div class="row"><div class="row-img"><img src="${imgUrl(f.img)}" alt=""></div><div class="row-body"><b>${esc(tl(f.n))}</b><div class="row-sub">${esc(tl(f.s))}</div>
        <div class="row-meta"><span class="tag brand">${t('k_fest')}</span>${f.approx ? `<span class="tag">${t('approx')}</span>` : ''}</div></div></div>`).join('')}
      ${evs.map(e => `<a class="row" href="#/event/${e.id}"><div class="row-img">${e.img ? `<img src="${esc(e.img)}" alt="">` : ''}</div><div class="row-body"><b>${esc(evTitle(e))}</b><div class="row-sub">${esc([e.time, e.place].filter(Boolean).join(' · '))}</div><div class="row-meta"><span class="tag brand">${t('cat_' + (e.cat || 'otros'))}</span></div></div><span class="muted chev">${ic('chev', 'sm')}</span></a>`).join('')}</div>`;
  };
  $('#cal').addEventListener('click', e => {
    const mb = e.target.closest('[data-m]');
    if (mb) { const dir = +mb.dataset.m; const d = new Date(calMonth.y, calMonth.m + dir, 1); calMonth = { y: d.getFullYear(), m: d.getMonth() }; return drawMonth(dir); }
    const c = e.target.closest('[data-d]'); if (!c) return;
    selected = c.dataset.d; $$('#cal .cd.sel').forEach(x => x.classList.remove('sel')); c.classList.add('sel'); drawDay();
  });
  let sx = null;
  $('#cal').addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  $('#cal').addEventListener('touchend', e => {
    if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) < 50) return; const dir = (dx < 0 ? 1 : -1) * (document.dir === 'rtl' ? -1 : 1);
    const btn = $(`#cal [data-m="${dir}"]`); if (btn && !btn.disabled) btn.click();
  });
  drawMonth(); drawDay();
}

// ---------- Eventos (agenda oficial de melilla.es vía eventos.php) ----------
let EVENTS = null;
const EV_CATS = { musica: 'music', cultura: 'landmark', deporte: 'walk', fiestas: 'star', talleres: 'edit', otros: 'calendar' };
const LONG_DAYS = 14;
const evTitle = e => String(e.title || '').replace(/''/g, '"').replace(/\s+/g, ' ').trim();
const evLong = e => daysBetween(e.from, e.to) > LONG_DAYS;
const evById = id => (EVENTS || []).find(e => e.id === id);
async function loadEvents() {
  if (!CONFIG.EVENTS_URL) return;
  try {
    const r = await fetch(CONFIG.EVENTS_URL); if (!r.ok) throw 0;
    const j = await r.json(); EVENTS = Array.isArray(j.events) ? j.events : [];
    store.set('vm_events', EVENTS);
  } catch { EVENTS = store.get('vm_events', []).filter(e => e.to >= madridToday()); }
  const slot = $('#home-events'); if (slot) { slot.innerHTML = eventsSection(); observeReveal(); }
  if (/^#\/(events|event\/|calendar)/.test(location.hash)) route();
}
function evWhen(e) {
  const today = madridToday();
  if (e.from <= today && today <= e.to) return evLong(e) ? t('ev_until', { d: fmtDay(e.to, { day: 'numeric', month: 'long' }) }) : t('ev_today');
  const n = daysBetween(today, e.from);
  return n === 1 ? t('in_1day') : n < 7 ? fmtDay(e.from, { weekday: 'long' }) : fmtDay(e.from, { day: 'numeric', month: 'short' });
}
function evRange(e) {
  const o = { weekday: 'short', day: 'numeric', month: 'long' };
  return e.from === e.to ? fmtDay(e.from, o) : `${fmtDay(e.from, { day: 'numeric', month: 'short' })} – ${fmtDay(e.to, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}
function evCard(e) {
  const today = madridToday(), live = e.from <= today && today <= e.to;
  return `<a class="ev-card reveal" href="#/event/${e.id}">
    <div class="ev-poster">${e.img ? `<img class="ev-bg" src="${esc(e.img)}" alt="" loading="lazy" aria-hidden="true"><img src="${esc(e.img)}" alt="${esc(evTitle(e))}" loading="lazy" onerror="this.closest('.ev-poster').classList.add('noimg')">` : ''}
      ${dateBadge(e.from < today ? today : e.from, 'fest')}${live ? `<span class="ev-live">${t('ev_today')}</span>` : ''}</div>
    <div class="ev-body"><span class="tag brand">${ic(EV_CATS[e.cat] || 'calendar', 'xs')}${t('cat_' + (e.cat || 'otros'))}</span>
      <b>${esc(evTitle(e))}</b>
      <div class="row-sub">${esc([evWhen(e), e.time].filter(Boolean).join(' · '))}</div>
      ${e.place ? `<div class="row-sub">${ic('pin', 'xs')} ${esc(e.place)}</div>` : ''}</div></a>`;
}
function eventsSection() {
  if (!EVENTS) return `<section class="section">${secHead(t('events_kick'), t('events_title'))}<div class="hscroll events">${[1, 2, 3].map(() => '<div class="ev-card skel" style="height:300px"></div>').join('')}</div></section>`;
  const list = EVENTS.filter(e => !evLong(e)).slice(0, 8);
  if (!list.length) return '';
  return `<section class="section">${secHead(t('events_kick'), t('events_title'), '#/events')}<div class="hscroll events">${list.map(evCard).join('')}</div>
    <p class="muted ev-src">${t('ev_source')}</p></section>`;
}
function icsEvent(e) {
  const pad = d => d.replace(/-/g, '');
  const end = parseIso(e.to); end.setDate(end.getDate() + 1);
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Visitar Melilla//ES', 'BEGIN:VEVENT', `UID:ev${e.id}@visitarmelilla.es`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`];
  if (e.time && e.from === e.to) { const [h, m] = e.time.split(':'); lines.push(`DTSTART;TZID=Europe/Madrid:${pad(e.from)}T${h.padStart(2, '0')}${m}00`, `DURATION:PT2H`); }
  else lines.push(`DTSTART;VALUE=DATE:${pad(e.from)}`, `DTEND;VALUE=DATE:${pad(iso(end.getFullYear(), end.getMonth(), end.getDate()))}`);
  const safe = s => String(s || '').replace(/\\/g, '\\\\').replace(/[,;]/g, m => '\\' + m).replace(/\n/g, '\\n');
  lines.push(`SUMMARY:${safe(evTitle(e))}`, `LOCATION:${safe((e.place ? e.place + ', ' : '') + 'Melilla')}`, `URL:${e.url}`, `DESCRIPTION:${safe((e.summary || '').slice(0, 300))}`, 'END:VEVENT', 'END:VCALENDAR');
  return URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
}
function viewEvents(query) {
  const today = madridToday();
  const all = EVENTS || [];
  const filt = query.get('f') || 'all';
  const d = parseIso(today), wd = d.getDay();
  const add = n => { const x = new Date(d); x.setDate(x.getDate() + n); return iso(x.getFullYear(), x.getMonth(), x.getDate()); };
  const wkStart = [5, 6, 0].includes(wd) ? today : add(5 - wd), wkEnd = wd === 0 ? today : add(7 - wd);
  const inRange = (e, a, b) => e.from <= b && e.to >= a;
  const filters = {
    all: e => !evLong(e), today: e => inRange(e, today, today) && !evLong(e),
    weekend: e => inRange(e, wkStart, wkEnd) && !evLong(e), week: e => inRange(e, today, add(7)) && !evLong(e)
  };
  const cats = [...new Set(all.filter(e => !evLong(e)).map(e => e.cat || 'otros'))];
  const fn = filters[filt] || (e => (e.cat || 'otros') === filt && !evLong(e));
  const list = all.filter(fn), ongoing = all.filter(evLong);
  const chip = (k, label, icon) => `<a class="chip ${filt === k ? 'on' : ''}" href="#/events${k === 'all' ? '' : '?f=' + k}">${icon ? ic(icon, 'xs') : ''}${esc(label)}</a>`;
  setView(`<section class="page-hero"><img src="${imgUrl('medieval')}" alt=""><div class="wrap"><span class="pill glass">${ic('calendar', 'xs')}${all.length} ${t('events').toLowerCase()}</span><h1>${t('events_title')}</h1><p>${t('events_kick')}</p></div></section>
    <div class="wrap">
      <div class="toolbar"><div class="chips">${chip('all', t('all'))}${chip('today', t('ev_today'))}${chip('weekend', t('ev_weekend'))}${chip('week', t('ev_week'))}${cats.map(c => chip(c, t('cat_' + c), EV_CATS[c])).join('')}</div></div>
      ${lang !== 'es' ? `<div class="notice" style="margin-top:4px">${ic('globe', 'sm')}<span>${t('ev_es_only')}</span></div>` : ''}
      ${EVENTS === null ? `<div class="empty-card" style="margin-top:12px">${t('loading')}</div>` : list.length ? `<div class="ev-grid" style="margin-top:12px">${list.map(evCard).join('')}</div>` : `<div class="empty-card" style="margin-top:12px">${t('ev_none')}</div>`}
      ${ongoing.length ? `<div class="section">${secHead(t('ev_ongoing_sub'), t('ev_ongoing'))}<div class="picks">${ongoing.map(e => `<a class="row" href="#/event/${e.id}"><div class="row-img">${e.img ? `<img src="${esc(e.img)}" alt="" loading="lazy">` : ''}</div>
        <div class="row-body"><b>${esc(evTitle(e))}</b><div class="row-meta"><span class="tag brand">${t('cat_' + (e.cat || 'otros'))}</span><span class="tag">${esc(t('ev_until', { d: fmtDay(e.to, { day: 'numeric', month: 'long' }) }))}</span></div></div><span class="muted chev">${ic('chev', 'sm')}</span></a>`).join('')}</div></div>` : ''}
      <p class="muted ev-src">${t('ev_source')}</p>
    </div>${footer()}`, { over: true });
}
function viewEvent(id) {
  const e = evById(id);
  if (!e) { if (EVENTS === null) return setView(`<div class="wrap" style="padding:60px 16px;text-align:center">${t('loading')}</div>`); return viewNotFound(); }
  const others = (EVENTS || []).filter(x => x.id !== e.id && !evLong(x)).slice(0, 6);
  setView(`<div class="ev-hero">${e.img ? `<img class="ev-bg" src="${esc(e.img)}" alt="" aria-hidden="true"><img class="ev-main" src="${esc(e.img)}" alt="${esc(evTitle(e))}" data-zoom>` : ''}</div>
  <div class="d-card"><div class="wrap two-col"><div>
    <span class="pill soft">${ic(EV_CATS[e.cat] || 'calendar', 'xs')}${t('cat_' + (e.cat || 'otros'))}</span>
    <h1 class="d-title">${esc(evTitle(e))}</h1>
    <div class="ev-facts">
      <div><span class="ac">${ic('calendar', 'sm')}</span><div><small>${t('ev_when')}</small><b>${esc(evRange(e))}</b></div></div>
      ${e.time ? `<div><span class="ac">${ic('clock', 'sm')}</span><div><small>${t('ev_time')}</small><b>${esc(e.time)}</b></div></div>` : ''}
      ${e.place ? `<div><span class="ac">${ic('pin', 'sm')}</span><div><small>${t('ev_where')}</small><b>${esc(e.place)}</b></div></div>` : ''}
    </div>
    <div class="actions" style="grid-template-columns:repeat(${e.place ? 4 : 3},1fr)">
      <a class="act" href="${icsEvent(e)}" download="evento-${e.id}.ics"><span class="ac">${ic('calendar', 'sm')}</span>${t('add_cal')}</a>
      ${e.place ? `<a class="act" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.place + ', Melilla')}" target="_blank" rel="noopener"><span class="ac">${ic('nav', 'sm')}</span>${t('directions')}</a>` : ''}
      <button class="act" data-act="share"><span class="ac">${ic('share', 'sm')}</span>${t('share')}</button>
      <a class="act" href="${esc(e.url)}" target="_blank" rel="noopener"><span class="ac">${ic('ext', 'sm')}</span>melilla.es</a>
    </div>
    ${lang !== 'es' ? `<div class="notice">${ic('globe', 'sm')}<span>${t('ev_es_only')}</span></div>` : ''}
    ${e.summary ? `<div class="block"><h3>${ic('info', 'sm')}${t('description')}</h3><p style="white-space:pre-line">${esc(e.summary)}</p></div>` : ''}
    ${e.details && e.details.length ? `<div class="block"><h3>${ic('check', 'sm')}${t('ev_info')}</h3><ul class="ev-list">${e.details.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
    <a class="btn ghost full" style="margin-top:14px" href="${esc(e.url)}" target="_blank" rel="noopener">${ic('ext', 'sm')}${t('ev_more')}</a>
    <p class="muted ev-src">${t('ev_source')}</p>
  </div><div class="side">
    ${others.length ? `<div class="block"><h3>${ic('calendar', 'sm')}${t('events_title')}</h3>${others.map(x => `<a class="row" href="#/event/${x.id}">${dateBadge(x.from < madridToday() ? madridToday() : x.from, 'fest')}<div class="row-body"><b>${esc(evTitle(x))}</b><div class="row-sub">${esc([evWhen(x), x.time].filter(Boolean).join(' · '))}</div></div></a>`).join('')}</div>` : ''}
  </div></div></div>${footer()}`, { over: true });
}

// ---------- Prepara tu viaje (+ agencias de viaje desde Google Maps) ----------
const guideCard = gd => `<a class="story sm reveal" href="${gd.slug}/"><img src="${imgUrl(gd.img)}" alt="" loading="lazy">
  <div class="story-body"><span class="pill">${t('guides_kick')}</span><h3>${esc(tl(gd.t))}</h3></div></a>`;
function bonosBanner() {
  return `<section class="section"><a class="bonos-banner reveal" href="bonos-turisticos-melilla/"><img src="${imgUrl('puerto-panoramica')}" alt="" loading="lazy">
    <div><span class="pill">${ic('ship', 'xs')}${t('bonos')} 2026</span><h3>${t('bonos_sub')}</h3><span class="btn">${t('bonos_cta')} <span class="flip">${ic('chev', 'xs')}</span></span></div></a></section>`;
}
function guidesSection() {
  return `<section class="section">${secHead(t('guides_kick'), t('guides'))}<div class="hscroll stories-sm guides">${GUIDES.map(guideCard).join('')}</div>
    ${lang !== 'es' ? `<p class="muted ev-src">${t('guides_note')}</p>` : ''}</section>`;
}
let AGENCIES = null;
async function loadAgencies() {
  if (AGENCIES) return AGENCIES;
  const lib = await loadGoogle(); if (!lib) return [];
  try {
    const { places } = await lib.Place.searchByText({
      textQuery: 'agencia de viajes en Melilla', includedType: 'travel_agency', maxResultCount: 20, language: lang, region: 'es',
      locationBias: { center: { lat: CONFIG.CENTER[0], lng: CONFIG.CENTER[1] }, radius: 5000 },
      fields: ['id', 'displayName', 'formattedAddress', 'rating', 'userRatingCount', 'nationalPhoneNumber', 'websiteURI', 'googleMapsURI', 'photos', 'businessStatus', 'location', 'regularOpeningHours']
    });
    AGENCIES = (places || []).filter(a => a.businessStatus !== 'CLOSED_PERMANENTLY' && a.location && dist(CONFIG.CENTER[0], CONFIG.CENTER[1], a.location.lat(), a.location.lng()) < 8000);
  } catch { AGENCIES = []; }
  return AGENCIES;
}
function agencyCard(a) {
  const ph = a.photos?.[0], cr = ph?.authorAttributions?.[0];
  const todayIdx = (madridNow().day + 6) % 7, today = a.regularOpeningHours?.weekdayDescriptions?.[todayIdx];
  const tel = a.nationalPhoneNumber ? `tel:+34${a.nationalPhoneNumber.replace(/\D/g, '')}` : '';
  return `<article class="pcard reveal">
    <div class="pcard-img">${ph ? `<img src="${esc(ph.getURI({ maxWidth: 700 }))}" alt="${esc(a.displayName)}" loading="lazy">` : `<img src="${imgUrl('puerto')}" alt="" loading="lazy">`}
      <span class="pill">${ic('globe', 'xs')}${t('agencies').split(' ')[0]}</span>${cr ? `<span class="g-credit">© ${esc(cr.displayName)}</span>` : ''}</div>
    <div class="pcard-body"><h3>${esc(a.displayName)}</h3>
      ${a.rating ? `<div class="row-meta">${starsHtml(Math.round(a.rating))}<span class="tag">${a.rating.toFixed(1)} · ${t('g_reviews', { n: (a.userRatingCount || 0).toLocaleString(lang) })}</span></div>` : ''}
      <div class="row-sub" style="white-space:normal">${ic('pin', 'xs')} ${esc(a.formattedAddress || '')}</div>
      ${today ? `<div class="row-sub">${ic('clock', 'xs')} ${esc(today)}</div>` : ''}</div>
    <div class="pcard-actions">
      ${tel ? `<a class="chip-btn brand" href="${tel}">${ic('phone', 'xs')}${t('call')}</a>` : ''}
      ${a.websiteURI ? `<a class="chip-btn" href="${esc(a.websiteURI)}" target="_blank" rel="noopener">${ic('globe', 'xs')}${t('website')}</a>` : ''}
      <a class="chip-btn" href="${esc(a.googleMapsURI || '#')}" target="_blank" rel="noopener">${ic('nav', 'xs')}${t('directions')}</a>
    </div></article>`;
}
async function viewPrepara() {
  const info = [
    ['ship', 'bonos', 'bonos_sub', 'bonos-turisticos-melilla/'], ['ship', 'arrive_t', 'arrive_s', '#/article/costa'], ['info', 'docs_t', 'docs_s', 'turismo-en-melilla-por-libre/'],
    ['bag', 'money_t', 'money_s', '#/cat/66'], ['bed', 'sleep_t', 'sleep_s', '#/cat/2'],
    ['calendar', 'holidays_t', 'holidays_s', '#/calendar'], ['phone', 'office_t', 'office_s', '#/place/7'], ['landmark', 'vis', 'vis_sub', '#/visitas']
  ];
  setView(`<section class="page-hero"><img src="${imgUrl('puerto')}" alt=""><div class="wrap"><span class="pill glass">${ic('ship', 'xs')}${t('prep_kick')}</span><h1>${t('prep')}</h1><p>${t('prep_sub')}</p></div></section>
    <div class="wrap">
      <section class="section">${WX ? `<div class="notice">${ic(wxIcon(WX.code), 'sm')}<span><b>${t('now_in')}: ${WX.temp}° · ${esc(wxLabel(WX.code))}</b> · ${t('sunset')} ${WX.sunset}</span></div>` : ''}
        <div class="info-grid" style="margin-top:14px">${info.map(([i, a, b, h]) => `<a class="info-card reveal" href="${h}"><span class="ic">${ic(i, 'sm')}</span><b>${t(a)}</b><small>${t(b)}</small></a>`).join('')}</div></section>
      ${guidesSection()}
      <section class="section">${secHead(t('agencies_sub'), t('agencies'))}<div id="agencies" class="pgrid">${[1, 2, 3].map(() => '<div class="pcard skel" style="height:320px"></div>').join('')}</div>
        <p class="muted ev-src" id="ag-src"></p></section>
    </div>${footer()}`, { over: true });
  const box = $('#agencies');
  if (!CONFIG.GOOGLE_MAPS_KEY) { box.innerHTML = `<div class="empty-card">${t('agencies_nokey')}</div>`; return; }
  const list = await loadAgencies();
  if (!$('#agencies')) return;
  box.innerHTML = list.length ? list.map(agencyCard).join('') : `<div class="empty-card">${t('agencies_none')}</div>`;
  $('#ag-src').textContent = list.length ? t('google_results') : '';
  observeReveal(); prepImages(box);
}

// ---------- Visitas guiadas (Fundación Melilla Monumental, datos en visitas.js) ----------
const VIS_IMG = { I: 'conventico', II: 'plazaarmas', III: 'recinto', IV: 'medieval', mod: 'asamblea', ext: 'parque', hist: 'santiago', bici: 'parqueatardecer', sup: 'puerto', gastro: 'tapas', virt: 'hero', intl: 'forcas', '': 'hero' };
const VIS_GROUPS = [['old', ['I', 'II', 'III']], ['IV', ['IV']], ['mod', ['mod']], ['ext', ['ext', 'hist']], ['exp', ['bici', 'sup', 'gastro', 'virt', 'intl', '']]];
const visDur = d => d >= 240 ? t('vis_half') : d >= 60 ? `${Math.floor(d / 60)} h${d % 60 ? ' ' + (d % 60) + ' min' : ''}` : `${d} min`;
const visTag = m => `<span class="tag ${m === 'g' ? 'ok' : m === 'x' ? '' : 'brand'}">${t('vis_m_' + m)}</span>`;
function visPlace(v) {
  const k = norm(v.name.split('(')[0]).replace(/^(museo|iglesia) (de la |del |de )?/, '').trim();
  if (k.length < 5) return null;
  for (const p of byId.place.values()) { const n = norm(p.title); if (n.length > 5 && (n.includes(k) || k.includes(n))) return p; }
  return null;
}
function visCard(v) {
  const p = v.pl !== false && ['I', 'II', 'III', 'IV', 'ext'].includes(v.r) ? visPlace(v) : null;
  const link = v.url || (p ? `#/place/${p.id}` : '');
  const ext = v.url ? ' target="_blank" rel="noopener"' : '';
  const sub = [v.at, visDur(v.d), v.cap ? `${t('vis_cap')} ${v.cap}` : ''].filter(Boolean).join(' · ');
  const inner = `<div class="row-img"><img src="${imgUrl(VIS_IMG[v.r] ?? 'hero')}" alt="" loading="lazy"></div>
    <div class="row-body"><b>${esc(v.name)}</b><div class="row-sub">${esc(sub)}</div>
    <div class="row-meta">${visTag(v.m)}<span class="tag">${esc(t('vis_r_' + v.r))}</span>${v.by ? `<span class="tag">${esc(v.by)}</span>` : ''}</div></div>
    ${link ? `<span class="muted chev">${ic(v.url ? 'globe' : 'chev', 'sm')}</span>` : ''}`;
  return link ? `<a class="row reveal" href="${esc(link)}"${ext}>${inner}</a>` : `<div class="row reveal">${inner}</div>`;
}
function viewVisitas(q) {
  const S = VISITAS_SRC, all = VISITAS, m = q.get('m') || '', g = q.get('g') || '';
  const grp = VIS_GROUPS.find(x => x[0] === g);
  const list = all.filter(v => (!m || v.m === m) && (!grp || grp[1].includes(v.r)));
  const href = (mm, gg) => { const p = new URLSearchParams(); if (mm) p.set('m', mm); if (gg) p.set('g', gg); const s = p.toString(); return '#/visitas' + (s ? '?' + s : ''); };
  const chip = (on, h, label) => `<a class="chip ${on ? 'on' : ''}" href="${h}">${esc(label)}</a>`;
  const grpLabel = { old: 'Melilla la Vieja', IV: t('vis_r_IV'), mod: t('vis_r_mod'), ext: t('vis_r_ext'), exp: t('vis_r_') };
  const free = all.filter(v => v.m === 'g').length;
  setView(`<section class="page-hero"><img src="${imgUrl('recinto')}" alt=""><div class="wrap"><span class="pill glass">${ic('landmark', 'xs')}${t('vis_kick')}</span><h1>${t('vis_title')}</h1><p>${t('vis_sub')}</p></div></section>
    <div class="wrap">
      <div class="stats" style="margin:16px 0 4px"><span>${ic('route', 'xs')}${all.length} ${t('vis').toLowerCase()}</span><span>${ic('star', 'xs')}${free} ${t('vis_free')}</span></div>
      <div class="pcard-actions" style="margin:10px 0 4px"><a class="chip-btn brand" href="${S.book}" target="_blank" rel="noopener">${ic('calendar', 'xs')}${t('vis_book')}</a>
        <a class="chip-btn" href="tel:${S.tel}">${ic('phone', 'xs')}${t('call')}</a><a class="chip-btn" href="mailto:${S.mail}">${ic('globe', 'xs')}${t('vis_contact')}</a></div>
      <div class="toolbar"><div class="chips">${chip(!m, href('', g), t('vis_all'))}${['g', 's', 't', 'p', 'x'].map(k => chip(m === k, href(k, g), t('vis_m_' + k))).join('')}</div></div>
      <div class="toolbar" style="margin-top:0"><div class="chips">${chip(!g, href(m, ''), t('vis_all'))}${VIS_GROUPS.map(([k]) => chip(g === k, href(m, k), grpLabel[k])).join('')}</div></div>
      <div class="notice" style="margin-top:6px">${ic('info', 'sm')}<span>${t('vis_note')}${m === 'x' ? ' ' + t('vis_soon') : ''}</span></div>
      <div class="block picks" style="margin-top:12px">${list.length ? list.map(visCard).join('') : `<div class="empty-card">${t('vis_none')}</div>`}</div>
      <section class="section"><div class="block"><h3>${ic('ship', 'sm')}${t('shuttle')}</h3><p>${t('shuttle_sub')}</p>
        <p style="margin-top:8px"><b>${esc(S.shuttle.hours[lang] || S.shuttle.hours.es)}</b></p>
        <p class="muted" style="margin-top:6px;font-size:13.5px">${t('shuttle_stops')}: ${esc(S.shuttle.stops.join(' · '))}</p>
        <div class="pcard-actions" style="margin-top:10px"><a class="chip-btn brand" href="tel:${S.shuttle.tel}">${ic('phone', 'xs')}${t('call')}</a><a class="chip-btn" href="${waHref(S.shuttle.tel.replace('+', ''))}" target="_blank" rel="noopener">${ic('wa', 'xs')}WhatsApp</a></div></div></section>
      <section class="section"><div class="block"><h3>${ic('walk', 'sm')}${t('vis_tip')}</h3><ul class="vis-tips"><li>${t('vis_tip1')}</li><li>${t('vis_tip2')} <a href="#/routes">${t('routes')}</a></li><li>${t('vis_tip3')}</li></ul></div></section>
      <p class="muted ev-src">${t('vis_src', { d: fmtDay(S.checked, { day: 'numeric', month: 'long', year: 'numeric' }) })} <a href="${S.url}" target="_blank" rel="noopener">melillamonumental.es</a></p>
    </div>${footer()}`, { over: true });
  prepImages($('.picks'));
}

function viewFavs() {
  const list = [...favs].map(id => byId.place.get(id)).filter(Boolean);
  setView(`<div class="wrap" style="padding-top:20px"><div class="kicker">${ic('heart', 'xs')}</div><h1 class="d-title">${t('favs')}</h1>
    ${list.length ? `<div class="pgrid" style="margin-top:16px">${list.map(cardHtml).join('')}</div>` : `<div class="empty-card" style="margin-top:16px">${t('favs_empty')}</div>`}</div>${footer()}`);
}
function viewCredits() {
  setView(`<div class="wrap article" style="padding-top:20px"><h1 class="d-title">${t('credits')}</h1><p class="muted">${t('credits_intro')}</p>
    <p class="muted" style="margin-top:10px;font-size:14px">Mapas y datos de lugares adicionales: © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">colaboradores de OpenStreetMap</a> (ODbL). Agenda de eventos: Ciudad Autónoma de Melilla (melilla.es).</p>
    <div style="margin-top:16px">${PHOTO_CREDITS.map(c => `<div class="credit-row"><img src="${imgUrl(c.key)}" alt="" loading="lazy"><div><b>${esc(c.title)}</b><br>${esc(c.author)} · ${esc(c.license)} · <a href="${esc(c.source)}" target="_blank" rel="noopener">Wikimedia Commons</a></div></div>`).join('')}
    ${Object.values(window.PLACE_PHOTOS || {}).map(c => `<div class="credit-row"><img src="${esc(c.src)}" alt="" loading="lazy"><div><b>${esc(c.title)}</b><br>${esc(c.author)} · ${esc(c.license)} · <a href="${esc(c.source)}" target="_blank" rel="noopener">Wikimedia Commons</a></div></div>`).join('')}</div></div>${footer()}`);
}
function viewNotFound() { setView(`<div class="wrap" style="padding:60px 16px;text-align:center"><h1 class="d-title">404</h1><a class="btn" href="#/">${t('home')}</a></div>`); }

// =====================================================
//  Audio (reproductor + mini reproductor persistente)
// =====================================================
const audio = $('#audio'); let audioTitle = '';
const fmtT = s => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00';
function playerHtml(src, title) {
  const same = audio.src === src;
  return `<div class="player" data-src="${esc(src)}" data-title="${esc(title)}"><button class="play-btn" data-act="play" aria-label="${t('listen')}">${ic(same && !audio.paused ? 'pause' : 'play')}</button>
    <div class="p-main"><b>${t('listen')} · ${esc(title)}</b><div class="p-bar" data-act="seek"><i></i></div><div class="p-time"><span class="cur">0:00</span><span class="dur">--:--</span></div></div>
    <button class="speed" data-act="speed">${audio.playbackRate || 1}×</button></div>`;
}
// Audioguía con selector de idioma (datos en audios.js)
const FLAGS = {
  es: '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/></svg>',
  en: '<svg viewBox="0 0 60 30" aria-hidden="true"><clipPath id="fl-uk"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath><rect width="60" height="30" fill="#012169"/><path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30m0-30L0 30" clip-path="url(#fl-uk)" stroke="#C8102E" stroke-width="4"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>'
};
const FLAG_NAME = { es: 'Español', en: 'English' };
function audioLangBlock(xa, title) {
  const langs = ['es', 'en'].filter(l => xa[l]);
  const cur = xa[lang] ? lang : langs.includes('en') && lang !== 'es' ? 'en' : langs[0];
  return `<div class="block audio-langs" data-title="${esc(title)}"><h3>${ic('headphones', 'sm')}${t('audio_guide')}</h3>
    <div class="flag-seg" role="group" aria-label="${t('language')}">${langs.map(l => `<button class="${l === cur ? 'on' : ''}" data-act="audio-lang" data-src="${esc(xa[l])}" aria-pressed="${l === cur}"><span class="flag">${FLAGS[l]}</span>${FLAG_NAME[l]}</button>`).join('')}</div>
    <div class="al-player">${playerHtml(new URL(xa[cur], location.href).href, title)}</div></div>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act="audio-lang"]'); if (!b || b.classList.contains('on')) return;
  const box = b.closest('.audio-langs'), was = !audio.paused && box.querySelector('.player')?.dataset.src === audio.src;
  box.querySelectorAll('[data-act="audio-lang"]').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
  if (was) audio.pause();
  box.querySelector('.al-player').innerHTML = playerHtml(new URL(b.dataset.src, location.href).href, box.dataset.title);
  syncPlayers();
  if (was) box.querySelector('[data-act="play"]').click();
});
function bindPlayer() { syncPlayers(); }
function syncPlayers() {
  $$('.player').forEach(pl => {
    const mine = audio.src && pl.dataset.src === audio.src;
    pl.classList.toggle('playing', !!mine && !audio.paused);
    pl.querySelector('.play-btn').innerHTML = ic(mine && !audio.paused ? 'pause' : 'play');
    pl.querySelector('.p-bar i').style.width = mine && audio.duration ? (audio.currentTime / audio.duration * 100) + '%' : '0';
    if (mine) { pl.querySelector('.cur').textContent = fmtT(audio.currentTime); pl.querySelector('.dur').textContent = fmtT(audio.duration); }
  });
  const mp = $('#mini-player');
  if (audio.src && (!audio.paused || audio.currentTime > 0) && !$('.player[data-src="' + CSS.escape(audio.src) + '"]')) {
    mp.hidden = false; document.body.classList.add('has-player');
    mp.innerHTML = `<button class="play-btn" data-act="mp-toggle">${ic(audio.paused ? 'play' : 'pause')}</button><div class="p-main"><b>${esc(audioTitle)}</b><div class="p-bar"><i style="width:${audio.duration ? audio.currentTime / audio.duration * 100 : 0}%"></i></div></div><button class="icon-btn" data-act="mp-close" style="background:transparent;color:inherit">${ic('x', 'sm')}</button>`;
  } else { mp.hidden = true; document.body.classList.remove('has-player'); }
}
['play', 'pause', 'timeupdate', 'loadedmetadata', 'ended'].forEach(ev => audio.addEventListener(ev, syncPlayers));
audio.addEventListener('error', () => { if (audio.src) toast('Audio no disponible'); });

// =====================================================
//  Hojas (idioma, reserva, reseña), búsqueda, menú
// =====================================================
function openSheet(html) {
  $('#sheet-panel').innerHTML = `<div class="grab"></div>${html}`;
  clearTimeout(closeT.sheet); $('#sheet').classList.remove('out');
  $('#sheet').hidden = false; document.body.style.overflow = 'hidden';
  setTimeout(() => $('#sheet-panel input, #sheet-panel button')?.focus({ preventScroll: true }), 350);
}
const closeT = {};
function animateClose(id, key) {
  const el = $(id); if (el.hidden || el.classList.contains('out')) return;
  document.body.style.overflow = '';
  if (RM.matches) { el.hidden = true; return; }
  el.classList.add('out');
  closeT[key] = setTimeout(() => { el.hidden = true; el.classList.remove('out'); }, 260);
}
function closeSheet() { animateClose('#sheet', 'sheet'); }
$('#sheet').addEventListener('click', e => { if (e.target.closest('[data-close]')) closeSheet(); });
enableDrag($('#sheet-panel'), closeSheet);

function langSheet() {
  openSheet(`<h3>${t('choose_lang')}</h3>${LANGS.map(l => `<button class="lang-opt ${l === lang ? 'on' : ''}" data-lang="${l}"><span class="code">${l.toUpperCase()}</span>${I18N[l].name}</button>`).join('')}`);
}
function reserveSheet(p) {
  const today = new Date().toISOString().slice(0, 10);
  const tel = telHref(p), mob = isMobile(p);
  openSheet(`<h3>${esc(t('reserve_title', { p: pName(p) }))}</h3>
    ${!tel ? `<p class="muted" style="margin-bottom:14px">${t('reserve_nophone')}</p><a class="btn full" href="${gmapsSearch(p)}" target="_blank" rel="noopener">${ic('ext', 'sm')}${t('gmaps')}</a>` : `
    <form id="rform"><div class="two"><div class="field"><label>${t('reserve_date')}</label><input type="date" name="d" min="${today}" value="${today}" required></div>
    <div class="field"><label>${t('reserve_time')}</label><input type="time" name="t" value="14:00" required></div></div>
    <div class="two"><div class="field"><label>${t('reserve_people')}</label><input type="number" name="n" min="1" max="50" value="2" required></div>
    <div class="field"><label>${t('reserve_name')}</label><input name="name" required autocomplete="name"></div></div>
    ${mob ? `<button class="btn wa full" type="submit">${icWa('sm')}${t('reserve_wa')}</button>` : ''}
    <a class="btn ${mob ? 'ghost' : ''} full" style="margin-top:10px" href="${tel}">${ic('phone', 'sm')}${t('reserve_call')}</a></form>`}`);
  $('#rform')?.addEventListener('submit', e => {
    e.preventDefault(); const f = new FormData(e.target);
    const d = new Date(f.get('d') + 'T12:00').toLocaleDateString(lang === 'ar' ? 'ar' : lang, { weekday: 'long', day: 'numeric', month: 'long' });
    const msg = t('reserve_msg', { p: pName(p), n: f.get('n'), d, t: f.get('t'), name: f.get('name') });
    open(waHref('34' + phoneDigits(p), msg), '_blank', 'noopener'); closeSheet();
  });
}
function reviewSheet(placeId) {
  let rating = 0;
  const opts = PLACES.filter(p => [1, 2, 3].includes(parentId(p.cat))).sort((a, b) => pName(a).localeCompare(pName(b), lang));
  openSheet(`<h3>${t('leave_review')}</h3><form id="vform">
    <div class="field"><label>${t('review_rating')}</label><div class="rate-pick">${[1, 2, 3, 4, 5].map(i => `<button type="button" data-r="${i}" aria-label="${i}"><svg viewBox="0 0 24 24">${ICONS.star}</svg></button>`).join('')}</div></div>
    <div class="field"><label>${t('review_place')}</label><select name="place"><option value="">${t('review_general')}</option>${opts.map(p => `<option value="${p.id}" ${p.id === placeId ? 'selected' : ''}>${esc(pName(p))}</option>`).join('')}</select></div>
    <div class="two"><div class="field"><label>${t('review_name')}</label><input name="name" maxlength="40" required autocomplete="given-name"></div>
    <div class="field"><label>${t('review_from')}</label><input name="from" maxlength="40"></div></div>
    <div class="field"><label>${t('review_text')}</label><textarea name="text" maxlength="600" required></textarea></div>
    <button class="btn full" type="submit">${t('review_send')}</button></form>`);
  $('.rate-pick').addEventListener('click', e => { const b = e.target.closest('[data-r]'); if (!b) return; rating = +b.dataset.r; $$('.rate-pick button').forEach(x => x.classList.toggle('on', +x.dataset.r <= rating)); });
  $('#vform').addEventListener('submit', async e => {
    e.preventDefault(); const f = new FormData(e.target);
    if (!rating || !f.get('name').trim() || !f.get('text').trim()) return toast(t('review_err'));
    await saveReview({ name: f.get('name').trim(), from: f.get('from').trim(), text: f.get('text').trim(), rating, place: f.get('place') ? +f.get('place') : null, lang, date: Date.now() });
    closeSheet(); toast(t('review_thanks')); route();
  });
}
function openVideo(url) {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([\w-]{6,})/);
  const src = yt ? `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1` : url;
  const el = document.createElement('div'); el.className = 'lightbox';
  el.innerHTML = `<button class="icon-btn" aria-label="${t('close')}">${ic('x')}</button><iframe src="${esc(src)}" style="width:min(94vw,900px);aspect-ratio:16/9;border:0;border-radius:12px" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  el.onclick = e => { if (e.target === el || e.target.closest('button')) el.remove(); };
  document.body.appendChild(el);
}
function openSearch() {
  const el = document.createElement('div'); el.className = 'search-ov';
  el.innerHTML = `<div class="search-top"><button class="icon-btn" data-x aria-label="${t('close')}">${ic('back')}</button><label class="search-field">${ic('search', 'sm')}<input type="search" placeholder="${t('search_ph')}" autocomplete="off"></label></div><div class="search-res"></div>`;
  document.body.appendChild(el); document.body.style.overflow = 'hidden';
  const inp = el.querySelector('input'), res = el.querySelector('.search-res');
  const close = () => { el.remove(); document.body.style.overflow = ''; };
  el.querySelector('[data-x]').onclick = close;
  el.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  const render = () => {
    const q = norm(inp.value.trim());
    if (q.length < 2) { res.innerHTML = `<h5>${t('explore')}</h5><div class="chips" style="flex-wrap:wrap;margin:0;padding:6px 0">${HOME_ORDER.filter(id => byId.cat.has(id) && placesIn(id).length).map(id => `<a class="chip" href="#/cat/${id}">${ic(PARENT_STYLE[id].icon, 'xs')}${esc(catName(byId.cat.get(id)))}</a>`).join('')}</div>`; return; }
    const pl = PLACES.filter(p => norm(pName(p) + ' ' + p.title + ' ' + pSub(p) + ' ' + catName(byId.cat.get(p.cat))).includes(q)).slice(0, 30);
    const rt = ROUTES.filter(r => norm(rName(r) + ' ' + r.title).includes(q));
    const ar = ARTICLES.filter(a => norm(tl(a.t).title + ' ' + tl(a.t).excerpt).includes(q));
    res.innerHTML = (!pl.length && !rt.length && !ar.length) ? `<div class="empty-card" style="margin-top:20px">${t('no_results')}</div>` :
      (ar.length ? `<h5>${t('reportajes')}</h5>${ar.map(a => `<a class="row" href="#/article/${a.id}"><div class="row-img"><img src="${imgUrl(a.img)}" alt=""></div><div class="row-body"><b>${esc(tl(a.t).title)}</b></div></a>`).join('')}` : '') +
      (rt.length ? `<h5>${t('routes')}</h5>${rt.map(r => `<a class="row" href="#/route/${r.id}"><div class="row-img"><img src="${imgUrl(ROUTE_IMG[r.id] || 'hero')}" alt=""></div><div class="row-body"><b>${esc(rName(r))}</b><div class="row-sub">${r.postIds.length} ${t('stops')}</div></div></a>`).join('')}` : '') +
      (pl.length ? `<h5>${t('places')}</h5>${pl.map(p => rowHtml(p)).join('')}` : '');
  };
  inp.addEventListener('input', render); render(); setTimeout(() => inp.focus(), 30);
}
function drawerHtml() {
  const th = store.get('vm_theme', 'auto');
  return `<div style="display:flex;align-items:center;justify-content:space-between"><a class="brand" href="#/">${brandHtml()}</a><button class="icon-btn" data-close aria-label="${t('close')}">${ic('x')}</button></div>
    <h4>${t('explore')}</h4>
    ${HOME_ORDER.filter(id => byId.cat.has(id) && placesIn(id).length).map(id => `<a class="d-link" href="#/cat/${id}"><span class="ic">${ic(PARENT_STYLE[id].icon, 'sm')}</span>${esc(catName(byId.cat.get(id)))}</a>`).join('')}
    <a class="d-link" href="#/routes"><span class="ic">${ic('route', 'sm')}</span>${t('routes')}</a>
    <a class="d-link" href="#/visitas"><span class="ic">${ic('landmark', 'sm')}</span>${t('vis')}</a>
    <a class="d-link" href="bonos-turisticos-melilla/"><span class="ic">${ic('ship', 'sm')}</span>${t('bonos')}</a>
    <a class="d-link" href="#/prepara"><span class="ic">${ic('ship', 'sm')}</span>${t('prep')}</a>
    <a class="d-link" href="#/events"><span class="ic">${ic('music', 'sm')}</span>${t('events')}</a>
    <a class="d-link" href="#/calendar"><span class="ic">${ic('calendar', 'sm')}</span>${t('calendar')}</a>
    <a class="d-link" href="#/articles"><span class="ic">${ic('edit', 'sm')}</span>${t('reportajes')}</a>
    <a class="d-link" href="#/favs"><span class="ic">${ic('heart', 'sm')}</span>${t('favs')}</a>
    <h4>${t('theme')}</h4><div class="seg" id="theme-seg">${['light', 'dark', 'auto'].map(v => `<button class="${th === v ? 'on' : ''}" data-theme="${v}">${ic(v === 'light' ? 'sun' : v === 'dark' ? 'moon' : 'auto', 'xs')}${t('theme_' + v)}</button>`).join('')}</div>
    <h4>${t('language')}</h4><div class="seg" style="grid-template-columns:repeat(4,1fr)">${LANGS.map(l => `<button class="${l === lang ? 'on' : ''}" data-lang="${l}">${l.toUpperCase()}</button>`).join('')}</div>
    <h4>${t('practical')}</h4><a class="d-link" href="tel:112"><span class="ic">${ic('phone', 'sm')}</span>${t('emergency')} · 112</a>
    <a class="d-link" href="#/credits"><span class="ic">${ic('info', 'sm')}</span>${t('credits')}</a>`;
}
function openDrawer() { clearTimeout(closeT.drawer); $('#drawer').classList.remove('out'); $('#drawer-panel').innerHTML = drawerHtml(); $('#drawer').hidden = false; document.body.style.overflow = 'hidden'; }
function closeDrawer() { animateClose('#drawer', 'drawer'); }
$('#drawer').addEventListener('click', e => { if (e.target.closest('[data-close]') || e.target.closest('a')) closeDrawer(); });

let toastT;
function toast(msg) { if (!msg) return; const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600); }

// =====================================================
//  Tema
// =====================================================
const mq = matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
  const th = store.get('vm_theme', 'auto'); const root = document.documentElement;
  if (th === 'auto') delete root.dataset.theme; else root.dataset.theme = th;
  root.dataset.themeResolved = th === 'auto' ? (mq.matches ? 'dark' : 'light') : th;
  $('#btn-theme').innerHTML = ic(root.dataset.themeResolved === 'dark' ? 'sun' : 'moon');
  $$('meta[name="theme-color"]').forEach(m => m.content = root.dataset.themeResolved === 'dark' ? '#0B111C' : '#0B5FB0');
}
function setTheme(v) { store.set('vm_theme', v); applyTheme(); $$('#theme-seg button').forEach(b => b.classList.toggle('on', b.dataset.theme === v)); if (maps.length) route(); }
mq.addEventListener?.('change', () => { applyTheme(); if (maps.length) route(); });

// =====================================================
//  Navegación (hash) — el botón atrás del móvil funciona
// =====================================================
function chrome() {
  document.documentElement.lang = lang; document.documentElement.dir = I18N[lang].dir;
  $('#brand').innerHTML = brandHtml();
  $('#btn-lang').textContent = lang.toUpperCase();
  $('#btn-menu').innerHTML = ic('menu'); $('#btn-search').innerHTML = ic('search'); $('#btn-back').innerHTML = ic('back');
  $('#btn-back').setAttribute('aria-label', t('back')); $('#btn-menu').setAttribute('aria-label', t('menu')); $('#btn-search').setAttribute('aria-label', t('search'));
  const tabs = [['#/', 'home', 'home'], ['#/map', 'map', 'map'], ['#/routes', 'route', 'routes'], ['#/near', 'near', 'near'], ['#/favs', 'heart', 'favs']];
  $('#tabbar').innerHTML = '<span class="tab-ind" aria-hidden="true"></span>' + tabs.map(([h, i, k]) => `<a class="tab" href="${h}" data-tab="${h}">${ic(i)}<span>${t(k)}</span></a>`).join('');
  $('#desk-nav').innerHTML = tabs.map(([h, , k]) => `<a href="${h}" data-tab="${h}">${t(k)}</a>`).join('') + `<a href="#/articles" data-tab="#/articles">${t('reportajes')}</a><a href="#/events" data-tab="#/events">${t('events')}</a><a href="#/prepara" data-tab="#/prepara">${t('prep')}</a><a href="#/calendar" data-tab="#/calendar">${t('calendar')}</a>`;
  const wa = $('#wa-fab');
  if (CONFIG.WHATSAPP) { wa.hidden = false; wa.href = waHref(CONFIG.WHATSAPP); wa.innerHTML = `<svg viewBox="0 0 24 24">${ICONS.wa}</svg>`; } else wa.hidden = true;
}
function setLang(l) { lang = l; store.set('vm_lang', l); chrome(); closeSheet(); closeDrawer(); route(); }

let depth = 0;
function route() {
  const h = location.hash || '#/'; const [path, qs] = h.slice(1).split('?'); const q = new URLSearchParams(qs || '');
  const seg = path.split('/').filter(Boolean);
  const tabKey = '#/' + (seg[0] && ['map', 'routes', 'near', 'favs', 'articles', 'calendar', 'events', 'prepara', 'visitas'].includes(seg[0]) ? seg[0] : seg[0] === 'route' ? 'routes' : seg[0] === 'article' ? 'articles' : seg[0] === 'event' ? 'events' : '');
  $$('[data-tab]').forEach(a => a.classList.toggle('on', a.dataset.tab === tabKey || (tabKey === '#/' && a.dataset.tab === '#/')));
  moveTabIndicator();
  const isRoot = seg.length === 0 || ['map', 'routes', 'near', 'favs'].includes(seg[0]) && seg.length === 1 && !q.get('route');
  $('#btn-back').hidden = isRoot; $('#btn-menu').hidden = !isRoot && innerWidth < 760;
  $('.map-card')?.remove(); $('.search-ov')?.remove(); $('.lightbox')?.remove(); closeSheet(); closeDrawer();
  switch (seg[0]) {
    case undefined: return viewHome();
    case 'cat': return viewCategory(+seg[1], q);
    case 'place': return viewPlace(+seg[1]);
    case 'routes': return viewRoutes();
    case 'route': return viewRoute(+seg[1]);
    case 'map': return viewMap(q);
    case 'near': return viewNear();
    case 'articles': return viewArticles();
    case 'article': return viewArticle(seg[1]);
    case 'favs': return viewFavs();
    case 'credits': return viewCredits();
    case 'calendar': return viewCalendar(q);
    case 'events': return viewEvents(q);
    case 'prepara': return viewPrepara();
    case 'visitas': return viewVisitas(q);
    case 'event': return viewEvent(+seg[1]);
    default: return viewNotFound();
  }
}
let goingBack = false;
addEventListener('hashchange', () => { const back = goingBack; if (goingBack) { depth = Math.max(0, depth - 1); goingBack = false; } else depth++; navigate(back); });
$('#btn-back').onclick = () => { if (depth > 0) { goingBack = true; history.back(); } else location.hash = '#/'; };
$('#btn-menu').onclick = openDrawer;
$('#btn-search').onclick = openSearch;
$('#btn-lang').onclick = langSheet;
$('#btn-theme').onclick = () => setTheme(document.documentElement.dataset.themeResolved === 'dark' ? 'light' : 'dark');

// Acciones delegadas
document.addEventListener('click', async e => {
  const fav = e.target.closest('[data-fav]'); if (fav) { e.preventDefault(); return toggleFav(+fav.dataset.fav); }
  const l = e.target.closest('[data-lang]'); if (l) return setLang(l.dataset.lang);
  const th = e.target.closest('[data-theme]'); if (th && th.tagName === 'BUTTON') return setTheme(th.dataset.theme);
  const z = e.target.closest('[data-zoom]'); if (z) { const el = document.createElement('div'); el.className = 'lightbox'; el.innerHTML = `<button class="icon-btn">${ic('x')}</button><img src="${z.dataset.full || z.src}" alt="">`; el.onclick = () => el.remove(); return document.body.appendChild(el); }
  const a = e.target.closest('[data-act]'); if (!a) return;
  const act = a.dataset.act;
  if (act === 'search') openSearch();
  else if (act === 'review') reviewSheet(a.dataset.id ? +a.dataset.id : null);
  else if (act === 'reserve') reserveSheet(byId.place.get(+a.dataset.id));
  else if (act === 'video') openVideo(a.dataset.url);
  else if (act === 'share') {
    const data = { title: document.title, url: location.href };
    if (navigator.share) navigator.share(data).catch(() => {}); else { try { await navigator.clipboard.writeText(location.href); toast(t('link_copied')); } catch {} }
  } else if (act === 'play') {
    const pl = a.closest('.player');
    if (audio.src !== pl.dataset.src) { audio.src = pl.dataset.src; audioTitle = pl.dataset.title; }
    audio.paused ? audio.play().catch(() => toast('Audio no disponible')) : audio.pause();
  } else if (act === 'seek') {
    const pl = a.closest('.player'); if (audio.src !== pl.dataset.src || !audio.duration) return;
    const r = a.getBoundingClientRect(); let x = (e.clientX - r.left) / r.width; if (document.dir === 'rtl') x = 1 - x;
    audio.currentTime = Math.max(0, Math.min(1, x)) * audio.duration;
  } else if (act === 'speed') {
    const rates = [1, 1.25, 1.5, 0.75]; audio.playbackRate = rates[(rates.indexOf(audio.playbackRate) + 1) % rates.length]; a.textContent = audio.playbackRate + '×';
  } else if (act === 'mp-toggle') audio.paused ? audio.play() : audio.pause();
  else if (act === 'mp-close') { audio.pause(); audio.removeAttribute('src'); audio.load(); syncPlayers(); }
});
addEventListener('keydown', e => { if (e.key === 'Escape') { closeSheet(); closeDrawer(); $('.search-ov')?.remove(); $('.lightbox')?.remove(); document.body.style.overflow = ''; } });

// =====================================================
//  Arranque
// =====================================================
async function boot() {
  applyTheme(); chrome();
  $('#splash-logo').innerHTML = `<span class="brand">${brandHtml()}</span>`;
  loadWeather(); loadEvents();
  try { indexData(await loadData()); }
  catch {
    $('#splash').classList.add('hide');
    view.innerHTML = `<div class="wrap" style="padding:80px 16px;text-align:center"><p>${t('error_load')}</p><button class="btn" style="margin-top:16px" onclick="location.reload()">${t('retry')}</button></div>`;
    return;
  }
  await route();
  setTimeout(() => $('#splash').classList.add('hide'), 250);
}
boot();
