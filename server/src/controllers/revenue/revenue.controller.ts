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
import { RevenueService } from 'src/services/revenue/revenue.service';
import { SubscriptionMapper } from 'src/mappers/subscription.mapper';

@Controller('recurring-revenue')
export class RevenueController {
  constructor(
    private revenueService: RevenueService,
    private subscriptionMapper: SubscriptionMapper,
  ) {}
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: BodyOptions,
    @UploadedFile(fileValidators) file: Express.Multer.File,
  ): any {
    // TODO: change type any to RecurringRevenueResponse[] | RecurringRevenueResponse
    const options: Options = JSON.parse(body.options);
    const fileContent = this.subscriptionMapper.map(loadFile(file));

    if (options.month && options.year) {
      return this.revenueService.getMonthlyRecurringRevenue(
        fileContent,
        options.month - 1,
        options.year,
      );
    }

    return this.revenueService.getYearlyRecurringRevenue(
      fileContent,
      options.year,
      options.filterSubscriptionPlan,
    );
  }
}
