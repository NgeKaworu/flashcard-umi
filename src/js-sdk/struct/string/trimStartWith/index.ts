export default (s1: string, s2: string) => (s1?.startsWith?.(s2) ? s1?.slice?.(s2?.length) : s1);
