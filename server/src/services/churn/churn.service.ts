import { Injectable } from '@nestjs/common';
import { toDoubleDigits } from 'src/helpers/numbers.helper';
import { ChurnRateResponse } from 'src/models/responses.model';
import { Subscription } from 'src/models/subscription.model';
import { SubscriptionPlanFilter } from 'src/models/metric-options.model';
import { CommonService } from '../common/common.service';

@Injectable()
export class ChurnService {
  constructor(private commonService: CommonService) {}

  getYearlyChurnRate = (
    subscriptions: Subscription[],
    year?: number,
    filterSubscriptionPlan?: SubscriptionPlanFilter,
  ): ChurnRateResponse[] => {
    return this.commonService.callMonthlyCalculationsPerYear(
      subscriptions,
      year,
      filterSubscriptionPlan,
      this.getMonthlyChurnRate,
    );
  };

  getMonthlyChurnRate = (
    subscriptions: Subscription[],
    monthIndex: number,
    year: number,
  ): ChurnRateResponse => {
    const monthSubscriptions = this.commonService.sortSubscriptionsByMonth(
      subscriptions,
      monthIndex,
      year,
    );

    // TODO: consider status date to avoid counting a customer whose status wasnt updated yet
    // monthSubscriptions.forEach((s) => {
    //   if (
    //     s.chargeFrequencyInDays === 30 &&
    //     (s.status === 'Active' || s.status === 'Upgrade') &&
    //     s.statusDate.getMonth() > monthIndex &&
    //     s.statusDate.getFullYear() >= year
    //   ) {
    //     console.log(s);
    //   }
    // });

    const lostSubscriptions = monthSubscriptions.filter(
      (s) =>
        (s.status === 'Canceled' || s.status === 'Trial Canceled') &&
        s.cancellationDate.getMonth() === monthIndex &&
        s.cancellationDate.getFullYear() === year,
    );

    const newSubscriptions = monthSubscriptions.filter(
      (s) =>
        (s.status === 'Active' || // Check only for active new customers
          s.status === 'Upgrade' ||
          s.status === 'Late') &&
        s.startDate.getMonth() === monthIndex &&
        s.startDate.getFullYear() === year,
    );

    return {
      relatesTo: `${toDoubleDigits(monthIndex + 1)}-${year}`,
      lostSubscriptions: lostSubscriptions.length,
      subscriptions: monthSubscriptions.length,
      newSubscriptions: newSubscriptions.length,
      churnRate: Math.round(
        (lostSubscriptions.length / monthSubscriptions.length) * 100,
      ),
    };
  };
}
