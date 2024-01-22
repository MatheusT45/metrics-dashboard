import { Injectable } from '@nestjs/common';

import { toDoubleDigits } from 'src/helpers/numbers.helper';
import { Subscription } from '../../models/subscription.model';
import { CommonService } from '../common/common.service';
import { LifetimeValueResponse } from 'src/models/responses.model';
import { SubscriptionPlanFilter } from 'src/models/metric-options.model';

@Injectable()
export class LifetimeValueService {
  constructor(private commonService: CommonService) {}

  getYearlyLifetimeValue = (
    subscriptions: Subscription[],
    year?: number,
    filterSubscriptionPlan?: SubscriptionPlanFilter,
  ): LifetimeValueResponse[] => {
    return this.commonService.callMonthlyCalculationsPerYear(
      subscriptions,
      year,
      filterSubscriptionPlan,
      this.getMonthlyLifetimeValue,
    );
  };

  getMonthlyLifetimeValue = (
    subscriptions: Subscription[],
    monthIndex: number,
    year: number,
  ): LifetimeValueResponse => {
    const monthSubscriptions = this.commonService.sortSubscriptionsByMonth(
      subscriptions,
      monthIndex,
      year,
    );

    let monthlyRevenue = 0;
    let monthlyRetention = 0;
    monthSubscriptions.map((s) => {
      if (s.chargeFrequencyInDays === 30) {
        return (
          (monthlyRevenue += s.valueCharged),
          (monthlyRetention += s.chargeAmount)
        );
      }

      if (s.chargeFrequencyInDays === 360 || s.chargeFrequencyInDays === 365) {
        return (
          (monthlyRevenue += s.valueCharged),
          (monthlyRetention += s.chargeAmount)
        );
      }
    });

    return {
      relatesTo: `${toDoubleDigits(monthIndex + 1)}-${year}`,
      averageTicketValue: parseFloat(
        (monthlyRevenue / monthSubscriptions.length).toFixed(2),
      ),

      averageRetentionTime: parseFloat(
        (monthlyRetention / monthSubscriptions.length).toFixed(2),
      ),

      lifetimeValue: parseFloat(
        (
          (monthlyRevenue / monthSubscriptions.length) *
          (monthlyRetention / monthSubscriptions.length)
        ).toFixed(2),
      ),
    };
  };
}
