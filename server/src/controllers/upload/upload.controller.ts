import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { csvJSON } from 'src/helpers/json.helper';

@Controller('upload')
export class UploadController {
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }), // 1 Mb
          new FileTypeValidator({
            fileType:
              '^(text/csv|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): any {
    return {
      fileContent: csvJSON(file.buffer.toString()),
    };
  }
}
