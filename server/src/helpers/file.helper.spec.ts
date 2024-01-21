import { csvJSON, xlsxJSON } from 'src/helpers/json.helper';
import { loadFile } from './file.helper';

jest.mock('src/helpers/json.helper', () => ({
  csvJSON: jest.fn(() => []),
  xlsxJSON: jest.fn(() => []),
}));

describe('File Helper', () => {
  it('should be defined', () => {
    expect(jest.isMockFunction(csvJSON)).toBeTruthy();
    expect(jest.isMockFunction(xlsxJSON)).toBeTruthy();
    loadFile({ mimetype: 'text/csv', buffer: Buffer.from('') } as any);
    expect(csvJSON).toHaveBeenCalled();
  });
});
