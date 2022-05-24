export function debounce<T extends any[]>(f: (...args: T) => void, ms: number) {
  let timer: number = 0;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout((...args: T) => f(...args), ms, ...args);
  };
}