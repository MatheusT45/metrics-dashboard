import { SheetHeaders } from 'src/models/sheet.model';
import { csvJSON, xlsxJSON } from './json.helper';

export const loadFile = (file: Express.Multer.File): SheetHeaders[] => {
  if (
    file.mimetype ===
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return xlsxJSON(file.buffer);
  }

  if (file.mimetype === 'text/csv') {
    return csvJSON(file.buffer.toString());
  }

  if ((file as any).type === 'text/csv') {
    return csvJSON((file as any).arrayBuffer.toString());
  }
};
