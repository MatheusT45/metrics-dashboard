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
import {
  // getMonthlyChurnRate,
  getYearlyChurnRate,
} from 'src/calcs/churn-rate';
import { csvJSON } from 'src/helpers/json.helper';
import { subscriptionMapper } from 'src/mappers/subscription.mapper';

const validators = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 20000000 }), // 20 Mb
    new FileTypeValidator({
      fileType:
        '^(text/csv|application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)',
    }),
  ],
});

type Options = {
  month?: number;
  year?: number;
  separator?: string;
  startDateField?: string;
  statusDateField?: string;
  cancellationDateField?: string;
  activeField?: string;
  activeFieldValue?: string;
  chargeAmountField?: string;
  chargeFrequencyInDaysField?: string;
  nextCycleField?: string;
  idField?: string;
};

type Body = {
  options: string;
};

@Controller('upload')
export class UploadController {
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: Body,
    @UploadedFile(validators) file: Express.Multer.File,
  ): any {
    const options: Options = JSON.parse(body.options);

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

      // getMonthlyChurnRate(fileContent, options.month - 1, options.year);
      getYearlyChurnRate(fileContent);

      return getYearlyChurnRate(fileContent);
    }
  }
}
