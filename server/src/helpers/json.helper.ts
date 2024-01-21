import xlsx from 'node-xlsx';
import { SheetHeaders } from 'src/models/sheet.model';

export function csvJSON(csv: string): SheetHeaders[] {
  const lines = csv.split('\n');

  const result = [];

  const headers = lines[0].replaceAll('\r', '').replaceAll(' ', '_').split(',');

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i]
      .replaceAll('\r', '')
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Ignore quoted commas

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j].replaceAll(`\"`, '');
    }

    result.push(obj);
  }

  return result;
}

export function xlsxJSON(file: Buffer): SheetHeaders[] {
  const fileContent = xlsx.parse(file.buffer, {
    type: 'buffer',
    cellDates: true,
    cellHTML: false,
    dateNF: 'mm/dd/yyyy hh:mm',
    cellNF: true,
  })[0].data;
  const [headers, ...values] = fileContent;
  const content = [];
  values.map((value) => {
    let obj = {};
    headers.map((header, j) => {
      if (header === 'valor') {
        value[j] = value[j].toString().replace('.', ',');
      }
      if (typeof value[j] === 'object') {
        value[j].setHours(value[j].getHours() + 3); // Fix timezone

        const formattedDate = `${value[j].getMonth() + 1}/${value[j].getDate()}/${value[j].getFullYear()} ${value[j].getHours()}:${value[j].getMinutes()}`;
        value[j] = formattedDate;
      }
      obj = { ...obj, [header.replaceAll(' ', '_')]: value[j] };
    });

    content.push(obj);
  });
  return content;
}
