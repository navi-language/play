type Theme = 'dark' | 'light';

const getStoredTheme = () => {
  const theme = localStorage.getItem('vitepress-theme-appearance');
  if (theme == 'dark' || theme == 'light') {
    return theme;
  }

  return 'auto';
};

export const getTheme = (): Theme => {
  const theme = getStoredTheme();
  if (theme != 'auto') {
    return theme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const checkToSetTheme = () => {
  const theme = getTheme();
  if (theme) {
    const rootNode = document.querySelector('html');
    rootNode?.classList.remove('dark');
    rootNode?.classList.remove('light');
    rootNode?.classList.add(theme);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  checkToSetTheme();
});

export const registerThemeChanged = (callback: (theme: Theme) => void) => {
  window.addEventListener('storage', () => {
    callback(getTheme());
  });

  // Get media query is dark mode
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  // Watch dark mode change
  mediaQuery.addEventListener('change', (e) => {
    if (getStoredTheme() != 'auto') {
      return;
    }

    const newTheme = e.matches ? 'dark' : 'light';
    callback(newTheme);
  });
};

registerThemeChanged(() => {
  checkToSetTheme();
});
