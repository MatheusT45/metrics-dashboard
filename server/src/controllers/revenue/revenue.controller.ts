import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { loadFile } from 'src/helpers/file.helper';
import { subscriptionMapper } from 'src/mappers/subscription.mapper';
import { fileValidators } from '../app.controller';
import {
  getMonthlyRecursiveRevenue,
  getYearlyRecursiveRevenue,
} from 'src/calcs/revenue';
import { BodyOptions, Options } from 'src/models/file-upload-options.model';

@Controller('monthly-recursive-revenue')
export class RevenueController {
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: BodyOptions,
    @UploadedFile(fileValidators) file: Express.Multer.File,
  ): any {
    const options: Options = JSON.parse(body.options);
    const fileContent = subscriptionMapper(loadFile(file));

    if (options.month && options.year) {
      return getMonthlyRecursiveRevenue(
        fileContent,
        options.month - 1,
        options.year,
      );
    }

    return getYearlyRecursiveRevenue(fileContent);
  }
}
