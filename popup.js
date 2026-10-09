document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('themeSelect');
  const statusMsg = document.getElementById('statusMsg');

  chrome.storage.local.get(['allegroDarkMode'], (res) => {
    const isDark = res.allegroDarkMode !== undefined ? res.allegroDarkMode : true;
    select.value = isDark ? 'dark' : 'light';
  });

  select.addEventListener('change', () => {
    const isDark = select.value === 'dark';
    chrome.storage.local.set({ allegroDarkMode: isDark }, () => {
      if (statusMsg) {
        statusMsg.textContent = '✓ Zmieniono motyw!';
        setTimeout(() => {
          statusMsg.textContent = '';
        }, 1500);
      }
    });
  });
});