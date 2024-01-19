import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { ChurnRateController } from './controllers/churn-rate/churn-rate.controller';

@Module({
  imports: [],
  controllers: [AppController, ChurnRateController],
  providers: [AppService],
})
export class AppModule {}
