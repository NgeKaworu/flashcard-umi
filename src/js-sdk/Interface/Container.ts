export type WithSuccess<T, V extends any = any, F extends (v: V) => void = any> = T & {
  onSuccess: F;
};
