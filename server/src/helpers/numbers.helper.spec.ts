import { toDoubleDigits } from 'src/helpers/numbers.helper';

describe('Number Helper', () => {
  it('works', () => {
    const response = toDoubleDigits(1);
    expect(response).toEqual('01');
  });
});
