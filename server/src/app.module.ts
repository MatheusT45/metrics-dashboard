import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { ChurnRateController } from './controllers/churn-rate/churn-rate.controller';
import { RevenueController } from './controllers/revenue/revenue.controller';

@Module({
  imports: [],
  controllers: [AppController, ChurnRateController, RevenueController],
  providers: [AppService],
})
export class AppModule {}
