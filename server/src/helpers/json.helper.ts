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
