import xlsx from 'node-xlsx';
import { csvJSON, xlsxJSON } from 'src/helpers/json.helper';

describe('JSON Helper', () => {
  it('when calling csvJSON, should return an object', () => {
    const response = csvJSON(
      'data início,data fim,valor\n01/01/2021 00:00,01/01/2021 00:00,100',
    );
    expect(response).toEqual([
      {
        data_início: '01/01/2021 00:00',
        data_fim: '01/01/2021 00:00',
        valor: '100',
      },
    ]);
  });
  it('when calling xlsxJSON, should return an object', () => {
    jest.spyOn(xlsx, 'parse').mockReturnValue([
      {
        name: '',
        data: [
          ['data início', 'data fim', 'valor'],
          [new Date('2022-12-02'), new Date('2022-12-02'), '100.0'],
        ],
      },
    ]);

    const response = xlsxJSON(
      Buffer.from(
        'data início, data fim, valor, 02/12/2022 00:00, 02/12/2022 00:00, 100',
      ),
    );

    expect(response).toEqual([
      {
        data_início: '12/2/2022 0:0',
        data_fim: '12/2/2022 0:0',
        valor: '100,0',
      },
    ]);
  });
});
