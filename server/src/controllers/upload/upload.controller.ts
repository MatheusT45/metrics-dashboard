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
import { getMonthlyChurnRate } from 'src/calcs/churn-rate.calc';
import { csvJSON } from 'src/helpers/json.helper';
import { subscriptionMapper } from 'src/mappers/subscription.mapper';

const validators = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 1000000 }), // 1 Mb
    new FileTypeValidator({
      fileType:
        '^(text/csv|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)',
    }),
  ],
});

@Controller('upload')
export class UploadController {
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: any,
    @UploadedFile(validators) file: Express.Multer.File,
  ): any {
    const options = JSON.parse(body.options);

    if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      return {
        options,
        fileContent: file.buffer.toString('base64'),
      };
    }

    if (file.mimetype === 'text/csv') {
      const fileContent = subscriptionMapper(csvJSON(file.buffer.toString()));

      getMonthlyChurnRate(fileContent, 0, 2023);

      return {
        options,
        fileContent,
      };
    }
  }
}
