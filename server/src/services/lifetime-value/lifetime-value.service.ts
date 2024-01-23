import { Injectable } from '@nestjs/common';

import { toDoubleDigits } from 'src/helpers/numbers.helper';
import { Subscription } from '../../models/subscription.model';
import { CommonService } from '../common/common.service';
import {
  LifetimeValueResponse,
  YearlyResponse,
} from 'src/models/responses.model';
import { SubscriptionPlanFilter } from 'src/models/metric-options.model';

@Injectable()
export class LifetimeValueService {
  constructor(private commonService: CommonService) {}

  getYearlyLifetimeValue = (
    subscriptions: Subscription[],
    year?: number,
    filterSubscriptionPlan?: SubscriptionPlanFilter,
  ): YearlyResponse => {
    const data = this.commonService.callMonthlyCalculationsPerYear(
      subscriptions,
      year,
      filterSubscriptionPlan,
      this.getMonthlyLifetimeValue,
    );

    const total: LifetimeValueResponse = {
      relatesTo: 'Total',
      averageTicketValue: 0,
      averageRetentionTime: 0,
      lifetimeValue: 0,
    };

    data.forEach((r) => {
      total.averageTicketValue += r.averageTicketValue;
      total.averageRetentionTime += r.averageRetentionTime;
      total.lifetimeValue += r.lifetimeValue;
    });

    total.averageTicketValue = parseFloat(
      (total.averageTicketValue / data.length).toFixed(2),
    );

    total.averageRetentionTime = parseFloat(
      (total.averageRetentionTime / data.length).toFixed(2),
    );

    total.lifetimeValue = parseFloat(
      (total.lifetimeValue / data.length).toFixed(2),
    );

    return { data, total };
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

    let ticketValue = 0;
    let monthlyRetention = 0;
    monthSubscriptions.map((s) => {
      if (s.chargeFrequencyInDays === 30) {
        return (
          (ticketValue += s.valueCharged), (monthlyRetention += s.chargeAmount)
        );
      }

      if (s.chargeFrequencyInDays === 360 || s.chargeFrequencyInDays === 365) {
        return (
          (ticketValue += s.valueCharged), (monthlyRetention += s.chargeAmount)
        );
      }
    });

    return {
      relatesTo: `${toDoubleDigits(monthIndex + 1)}-${year}`,
      averageTicketValue: parseFloat(
        (ticketValue / monthSubscriptions.length).toFixed(2),
      ),

      averageRetentionTime: parseFloat(
        (monthlyRetention / monthSubscriptions.length).toFixed(2),
      ),

      lifetimeValue: parseFloat(
        (
          (ticketValue / monthSubscriptions.length) *
          (monthlyRetention / monthSubscriptions.length)
        ).toFixed(2),
      ),
    };
  };
}
