import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { getMonthlyChurnRate, getYearlyChurnRate } from 'src/calcs/churn-rate';
import { loadFile } from 'src/helpers/file.helper';
import { subscriptionMapper } from 'src/mappers/subscription.mapper';
import { fileValidators } from '../app.controller';
import { BodyOptions, Options } from 'src/models/metric-options.model';
import { ChurnRateResponse } from 'src/models/responses.model';

@Controller('churn-rate')
export class ChurnRateController {
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body() body: BodyOptions,
    @UploadedFile(fileValidators) file: Express.Multer.File,
  ): ChurnRateResponse[] | ChurnRateResponse {
    const options: Options = JSON.parse(body.options);
    const fileContent = subscriptionMapper(loadFile(file));

    if (options.month && options.year) {
      return getMonthlyChurnRate(fileContent, options.month - 1, options.year);
    }
    return getYearlyChurnRate(
      fileContent,
      options.year,
      options.filterSubscriptionPlan,
    );
  }
}
