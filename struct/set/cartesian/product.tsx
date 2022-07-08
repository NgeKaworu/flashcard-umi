type set = any | any[];

export default function cartesianProduct(...s: set[]) {
  const safeSets = ([] as set[]).concat(s)?.map((i) => (Array.isArray(i) ? i : [i]));
  const sol: set[] = [];
  backtrack(sol, 0, safeSets, []);
  return sol;
}

function backtrack(sol: set[] = [], idx = 0, sets: set[] = [[]], curList: set[] = []) {
  if (sets.length === curList?.length) {
    sol.push([...curList]);

    return;
  }

  for (const j of sets[idx]) {
    curList.push(j);
    backtrack(sol, idx + 1, sets, curList);
    curList.pop();
  }
}
