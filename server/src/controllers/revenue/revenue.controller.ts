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
import { fileValidators } from '../../validators/file.validator';
import {
  getMonthlyRecurringRevenue,
  getYearlyRecurringRevenue,
} from 'src/calcs/revenue';
import { BodyOptions, Options } from 'src/models/metric-options.model';

@Controller('recurring-revenue')
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
      return getMonthlyRecurringRevenue(
        fileContent,
        options.month - 1,
        options.year,
      );
    }

    return getYearlyRecurringRevenue(
      fileContent,
      options.year,
      options.filterSubscriptionPlan,
    );
  }
}
