import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { ChurnRateController } from './controllers/churn-rate/churn-rate.controller';
import { RecurringRevenueController } from './controllers/recurring-revenue/recurring-revenue.controller';
import { ChurnRateService } from './services/churn-rate/churn-rate.service';
import { RecurringRevenueService } from './services/recurring-revenue/recurring-revenue.service';
import { CommonService } from './services/common/common.service';
import { SubscriptionMapper } from './mappers/subscription.mapper';
import { LifetimeValueController } from './controllers/lifetime-value/lifetime-value.controller';
import { LifetimeValueService } from './services/lifetime-value/lifetime-value.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    ChurnRateController,
    RecurringRevenueController,
    LifetimeValueController,
  ],
  providers: [
    AppService,
    ChurnRateService,
    RecurringRevenueService,
    LifetimeValueService,
    CommonService,
    SubscriptionMapper,
  ],
})
export class AppModule {}
