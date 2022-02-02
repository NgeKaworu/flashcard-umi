export type Key = string | number | symbol;

export default (obj: Record<Key, any> | any[], path: Key | Key[] | readonly Key[]) => {
  const safePath = ([] as Key[]).concat(path);
  let cur = obj;
  for (const key of safePath) {
    if (typeof cur !== 'object' || cur === null) return void 0;
    cur = (cur as Record<Key, any>)?.[key];
  }
  return cur;
};
