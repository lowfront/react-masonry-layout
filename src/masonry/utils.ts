export function debounce<T extends any[]>(f: (...args: T) => void, ms: number) {
  let timer: number = 0;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout((...args: T) => f(...args), ms, ...args);
  };
}

export function getScrollbarSize() {
  const el = document.createElement('div') as HTMLElement;
  let scrollbarSize = 0;
  el.style.overflow = 'scroll';
  el.style.position = 'absolute';
  el.style.opacity = '0';
  document.body.appendChild(el);
  scrollbarSize = (el.offsetWidth - el.clientWidth) || 0;
  document.body.removeChild(el);
  return scrollbarSize;
};
