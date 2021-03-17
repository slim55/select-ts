export const toggleArrayItem: (
  arr: Array<string>,
  item: string
) => Array<string> = (arr, item) =>
  arr.includes(item)
    ? arr.filter((elem: string) => elem !== item)
    : [...arr, item];

export default { toggleArrayItem };
