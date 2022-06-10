import 'jest';

import trimStartWith from '.';

describe('trimStartWith test', () => {
  it('12345 trimStart with 123 eq 45', () => {
    expect(trimStartWith('12345', '123')).toBe('45');
  });

  it('12345 trimStart with 34 eq 12345', () => {
    expect(trimStartWith('12345', '34')).toBe('12345');
  });

  it('data:image/png;base64,iVBORw0 trimStart with data:image/png;base64,iVBORw0 eq iVBORw0', () => {
    expect(trimStartWith('data:image/png;base64,iVBORw0', 'data:image/png;base64,')).toBe('iVBORw0');
  });
});
