import { toDoubleDigits } from 'src/helpers/numbers.helper';

describe('Number Helper', () => {
  it('should return double digit numbers', () => {
    const response = toDoubleDigits(1);
    expect(response).toEqual('01');
  });
});
