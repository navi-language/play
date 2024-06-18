type Theme = 'dark' | 'light';

export const getTheme = (): Theme => {
  const theme = localStorage.getItem('vitepress-theme-appearance');
  if (theme == 'dark' || theme == 'light') {
    return theme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

document.addEventListener('DOMContentLoaded', () => {
  const theme = getTheme();
  if (theme) {
    const rootNode = document.querySelector('html');
    rootNode?.classList.add(theme);
  }
});
