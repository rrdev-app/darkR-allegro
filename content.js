(function () {
  const STYLE_ID = 'rrdev-dark-allegro-invert';

  const INVERT_CSS = `
    html[data-rrdev-dark="true"] {
      filter: invert(1) hue-rotate(180deg) !important;
      background-color: #e9e9e7 !important;
    }

    html[data-rrdev-dark="true"] body {
      background-color: #e9e9e7 !important;
    }

    html[data-rrdev-dark="true"] picture,
    html[data-rrdev-dark="true"] figure {
      filter: none !important;
      background: transparent !important;
    }

    html[data-rrdev-dark="true"] img,
    html[data-rrdev-dark="true"] video,
    html[data-rrdev-dark="true"] canvas,
    html[data-rrdev-dark="true"] iframe,
    html[data-rrdev-dark="true"] [style*="background-image"] {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    html[data-rrdev-dark="true"] [style*="background-image"] img {
      filter: none !important;
    }

    html[data-rrdev-dark="true"] svg {
      filter: none !important;
    }

    html[data-rrdev-dark="true"] a[href*="koszyk"],
    html[data-rrdev-dark="true"] [aria-label*="koszyk" i],
    html[data-rrdev-dark="true"] [data-role="cart"],
    html[data-rrdev-dark="true"] [data-box-name*="cart" i] {
      filter: invert(1) hue-rotate(180deg) !important;
    }

    html[data-rrdev-dark="true"] a[href*="koszyk"] *,
    html[data-rrdev-dark="true"] [aria-label*="koszyk" i] *,
    html[data-rrdev-dark="true"] [data-role="cart"] *,
    html[data-rrdev-dark="true"] [data-box-name*="cart" i] * {
      filter: none !important;
    }
  `;

  function unifyBackgrounds() {
    if (!document.documentElement.hasAttribute('data-rrdev-dark')) return;

    const elements = document.querySelectorAll('main, div, section, article, aside');
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      if (el.tagName === 'PICTURE' || el.querySelector('img, video') === el) continue;

      const bg = window.getComputedStyle(el).backgroundColor;
      if (bg === 'rgb(255, 255, 255)') {
        el.style.setProperty('background-color', '#e9e9e7', 'important');
      }
    }
  }

  function applyTheme(enabled) {
    if (enabled) {
      document.documentElement.setAttribute('data-rrdev-dark', 'true');
      let el = document.getElementById(STYLE_ID);
      if (!el) {
        el = document.createElement('style');
        el.id = STYLE_ID;
        (document.head || document.documentElement).appendChild(el);
      }
      el.textContent = INVERT_CSS;
      unifyBackgrounds();
    } else {
      document.documentElement.removeAttribute('data-rrdev-dark');
      const el = document.getElementById(STYLE_ID);
      if (el) el.remove();
      const elements = document.querySelectorAll('[style*="background-color"]');
      elements.forEach(el => el.style.removeProperty('background-color'));
    }
  }

  chrome.storage.local.get(['allegroDarkMode'], (res) => {
    const isDark = res.allegroDarkMode !== undefined ? res.allegroDarkMode : true;
    applyTheme(isDark);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.allegroDarkMode) {
      applyTheme(changes.allegroDarkMode.newValue);
    }
  });

  const observer = new MutationObserver(() => {
    unifyBackgrounds();
  });

  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();