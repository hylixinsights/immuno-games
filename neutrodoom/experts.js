(() => {
  'use strict';
  const preferenceKey = 'neutrodoom.preferences';
  const readPreferences = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(preferenceKey) || '{}');
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    } catch (_) {
      return {};
    }
  };
  const requestedLanguage = new URLSearchParams(location.search).get('lang');
  let language = ['pt', 'en'].includes(requestedLanguage)
    ? requestedLanguage
    : (readPreferences().lang === 'pt' ? 'pt' : 'en');

  function applyLanguage() {
    const portuguese = language === 'pt';
    document.documentElement.lang = portuguese ? 'pt-BR' : 'en';
    document.title = (portuguese ? 'Pesquisa em neutrófilos no Brasil' : 'Neutrophil research in Brazil') + ' · NEUTRODOOM';
    document.querySelector('meta[name="description"]').content = portuguese
      ? 'Conheça cinco pesquisadores no Brasil que estudam neutrófilos em infecções e na inflamação. Uma página do NEUTRODOOM com resumos de pesquisa e perfis do Google Scholar.'
      : 'Meet five researchers in Brazil exploring neutrophils in infection and inflammation. A NEUTRODOOM page with research summaries and Google Scholar profiles.';
    document.querySelectorAll('[data-en]').forEach(node => {
      node.textContent = node.dataset[language];
    });
    document.querySelector('[data-language-group]').setAttribute('aria-label', portuguese ? 'Idioma' : 'Language');
    document.querySelectorAll('[data-lang]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.lang === language));
    });
    document.querySelectorAll('[data-back]').forEach(link => {
      link.href = './?lang=' + language;
    });
    document.querySelectorAll('[data-scholar]').forEach(link => {
      const url = new URL(link.href);
      url.searchParams.set('hl', portuguese ? 'pt-BR' : 'en');
      link.href = url.href;
    });
    try {
      localStorage.setItem(preferenceKey, JSON.stringify({...readPreferences(), lang: language}));
    } catch (_) { /* Language links still work when browser storage is unavailable. */ }
  }

  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => {
      language = button.dataset.lang;
      applyLanguage();
      try {
        const url = new URL(location.href);
        url.searchParams.set('lang', language);
        history.replaceState(null, '', url);
      } catch (_) { /* The page also works when opened directly from disk. */ }
    });
  });
  applyLanguage();
})();
