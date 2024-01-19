import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { AppService } from '../app.service';

export const fileValidators = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 20000000 }), // 20 Mb
    new FileTypeValidator({
      fileType:
        '^(text/csv|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)',
    }),
  ],
});

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
