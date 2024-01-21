import { csvJSON, xlsxJSON } from 'src/helpers/json.helper';
import { loadFile } from './file.helper';

jest.mock('src/helpers/json.helper', () => ({
  csvJSON: jest.fn(() => []),
  xlsxJSON: jest.fn(() => []),
}));

describe('File Helper', () => {
  it('should call csvJSON', () => {
    loadFile({ mimetype: 'text/csv', buffer: Buffer.from('') } as any);
    expect(csvJSON).toHaveBeenCalled();
  });

  it('should call xlsxJSON', () => {
    loadFile({
      mimetype:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from(''),
    } as any);
    expect(xlsxJSON).toHaveBeenCalled();
  });

  it('should call csvJSON on test sheet', () => {
    loadFile({ type: 'text/csv', buffer: Buffer.from('') } as any);
    expect(csvJSON).toHaveBeenCalled();
  });
});
