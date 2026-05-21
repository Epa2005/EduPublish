import translations from './translations';

export function getLang() {
  try {
    return localStorage.getItem('app_lang') || 'en';
  } catch { return 'en'; }
}

export function setLang(lang) {
  try { localStorage.setItem('app_lang', lang); } catch {}
}

export function toggleLang() {
  const next = getLang() === 'en' ? 'kin' : 'en';
  setLang(next);
  window.location.reload();
}

export function t(path) {
  const lang = getLang();
  const keys = path.split('.');
  let val = translations[lang];
  for (const key of keys) {
    if (val && typeof val === 'object' && key in val) val = val[key];
    else return path;
  }
  if (val === null || val === undefined) return path;
  return val;
}
