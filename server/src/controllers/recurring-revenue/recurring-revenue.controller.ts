import { LocalFileData } from 'get-file-object-from-local-path';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { loadFile } from 'src/helpers/file.helper';
import { fileValidators } from '../../validators/file.validator';
import { BodyOptions, Options } from 'src/models/metric-options.model';
import { RecurringRevenueService } from 'src/services/recurring-revenue/recurring-revenue.service';
import { SubscriptionMapper } from 'src/mappers/subscription.mapper';
import { RecurringRevenueResponse } from 'src/models/responses.model';

@Controller('recurring-revenue')
export class RecurringRevenueController {
  constructor(
    private recurringRevenueService: RecurringRevenueService,
    private subscriptionMapper: SubscriptionMapper,
  ) {}
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: BodyOptions,
    @UploadedFile(fileValidators) file?: Express.Multer.File,
  ): RecurringRevenueResponse[] | RecurringRevenueResponse {
    const options: Options = JSON.parse(body.options);

    const testFile = new LocalFileData('src/assets/test-sheet.csv');

    const fileContent = this.subscriptionMapper.map(loadFile(file || testFile));

    if (options.month && options.year) {
      return this.recurringRevenueService.getMonthlyRecurringRevenue(
        fileContent,
        options.month - 1,
        options.year,
      );
    }

    return this.recurringRevenueService.getYearlyRecurringRevenue(
      fileContent,
      options.year,
      options.filterSubscriptionPlan,
    );
  }
}
