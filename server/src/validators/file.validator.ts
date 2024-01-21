import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const fileValidators = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 20000000 }), // 20 Mb
    new FileTypeValidator({
      fileType:
        '^(text/csv|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)',
    }),
  ],
});
