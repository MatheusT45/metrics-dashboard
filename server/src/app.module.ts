import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { ChurnRateController } from './controllers/churn-rate/churn-rate.controller';
import { RevenueController } from './controllers/revenue/revenue.controller';
import { ChurnService } from './services/churn/churn.service';
import { RevenueService } from './services/revenue/revenue.service';
import { CommonService } from './services/common/common.service';
import { SubscriptionMapper } from './mappers/subscription.mapper';

@Module({
  imports: [],
  controllers: [AppController, ChurnRateController, RevenueController],
  providers: [
    AppService,
    ChurnService,
    RevenueService,
    CommonService,
    SubscriptionMapper,
  ],
})
export class AppModule {}
