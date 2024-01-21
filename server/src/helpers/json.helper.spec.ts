import { csvJSON } from 'src/helpers/json.helper';

describe('JSON Helper', () => {
  it('csvJSON', () => {
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
  // it('xlsxJSON', () => {
  //   const response = xlsxJSON(
  //     Buffer.from(
  //       'data início, data fim, valor, 01/01/2021 00:00, 01/01/2021 00:00, 100',
  //     ),
  //   );

  //   expect(response).toEqual([
  //     {
  //       data_início: '01/01/2021 00:00',
  //       data_fim: '01/01/2021 00:00',
  //       valor: '100',
  //     },
  //   ]);
  // });
});
