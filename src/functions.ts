export const toggleArrayItem: (
  arr: Array<string>,
  item: string
) => Array<string> = (arr, item) =>
  arr.includes(item)
    ? arr.filter((elem: string) => elem !== item)
    : [...arr, item];

export const checkMobileDevice: () => boolean = () => {
  return !!/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.exec(
    window.navigator.userAgent
  );
};

export default { toggleArrayItem, checkMobileDevice };
