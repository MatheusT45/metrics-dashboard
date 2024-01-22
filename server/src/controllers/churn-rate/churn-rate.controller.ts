import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { loadFile } from 'src/helpers/file.helper';
import { SubscriptionMapper } from 'src/mappers/subscription.mapper';
import { BodyOptions, Options } from 'src/models/metric-options.model';
import { ChurnRateResponse } from 'src/models/responses.model';
import { ChurnRateService } from 'src/services/churn-rate/churn-rate.service';
import { fileValidators } from 'src/validators/file.validator';
import { LocalFileData } from 'get-file-object-from-local-path';

@Controller('churn-rate')
export class ChurnRateController {
  constructor(
    private churnRateService: ChurnRateService,
    private subscriptionMapper: SubscriptionMapper,
  ) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: BodyOptions,
    @UploadedFile(fileValidators) file?: Express.Multer.File,
  ): ChurnRateResponse[] | ChurnRateResponse {
    const options: Options = JSON.parse(body.options);

    const testFile = new LocalFileData('src/assets/test-sheet.csv');

    const fileContent = this.subscriptionMapper.map(loadFile(file || testFile));

    if (options.month && options.year) {
      return this.churnRateService.getMonthlyChurnRate(
        fileContent,
        options.month - 1,
        options.year,
      );
    }

    return this.churnRateService.getYearlyChurnRate(
      fileContent,
      options.year,
      options.filterSubscriptionPlan,
    );
  }
}
