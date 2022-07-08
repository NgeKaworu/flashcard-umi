import 'jest';

import safeJSONParse from './safeParse';

describe('safeJSONParse test', () => {
  it('[] parse to []', () => {
    expect(safeJSONParse('[]')).toBe([]);
  });
  it('{} parse to {}', () => {
    expect(safeJSONParse('{}')).toBe({});
  });

  it('"" parse to void 0', () => {
    expect(safeJSONParse('')).toBe(void 0);
  });
});
