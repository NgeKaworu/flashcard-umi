import getIn from '.';

describe('getIn test', () => {
  it("expect(getIn({}, ['a', 1, '3'])).toEqual(void 0)", () => {
    expect(getIn({}, ['a', 1, '3'])).toEqual(void 0);
  });

  it("expect(getIn([], ['a', 1, '3'])).toEqual(void 0)", () => {
    expect(getIn([], ['a', 1, '3'])).toEqual(void 0);
  });

  it("expect(getIn([{ a: 'a' }], [0, 'a'])).toEqual('a')", () => {
    expect(getIn([{ a: 'a' }], [0, 'a'])).toEqual('a');
  });

  it("expect(getIn([{ a: 'a' }], [0, 'b'])).toEqual(void 0)", () => {
    expect(getIn([{ a: 'a' }], [0, 'b'])).toEqual(void 0);
  });

  it("expect(getIn([{ a: 'a', c: [, 1] }], [0, 'c', 1])).toEqual(1)", () => {
    expect(getIn([{ a: 'a', c: [, 1] }], [0, 'c', 1])).toEqual(1);
  });

  it("expect(getIn({ test: [{ a: 'a', c: [, 1] }] }, ['test', 0, 'c', 1])).toEqual(1)", () => {
    expect(getIn({ test: [{ a: 'a', c: [, 1] }] }, ['test', 0, 'c', 1])).toEqual(1);
  });
});
