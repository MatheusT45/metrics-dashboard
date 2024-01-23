import { Injectable } from '@nestjs/common';

import { toDoubleDigits } from 'src/helpers/numbers.helper';
import { Subscription } from '../../models/subscription.model';
import { CommonService } from '../common/common.service';
import {
  RecurringRevenueResponse,
  YearlyResponse,
} from 'src/models/responses.model';
import { SubscriptionPlanFilter } from 'src/models/metric-options.model';

@Injectable()
export class RecurringRevenueService {
  constructor(private commonService: CommonService) {}

  getYearlyRecurringRevenue = (
    subscriptions: Subscription[],
    year?: number,
    filterSubscriptionPlan?: SubscriptionPlanFilter,
  ): YearlyResponse => {
    const data = this.commonService.callMonthlyCalculationsPerYear(
      subscriptions,
      year,
      filterSubscriptionPlan,
      this.getMonthlyRecurringRevenue,
    );

    const total: RecurringRevenueResponse = {
      relatesTo: 'Total',
      revenue: 0,
    };

    data.forEach((r) => {
      total.revenue += r.revenue;
    });

    total.revenue = parseFloat(total.revenue.toFixed(2));

    return { data, total };
  };

  getMonthlyRecurringRevenue = (
    subscriptions: Subscription[],
    monthIndex: number,
    year: number,
  ): RecurringRevenueResponse => {
    const monthSubscriptions = this.commonService.sortSubscriptionsByMonth(
      subscriptions,
      monthIndex,
      year,
    );

    let revenue = 0;
    monthSubscriptions.map((s) => {
      if (
        s.chargeFrequencyInDays === 30 &&
        (s.status === 'Active' || s.status === 'Upgrade') // get active and upgrade customers
      ) {
        return (revenue += s.valueCharged);
      }

      if (
        s.chargeFrequencyInDays === 30 &&
        s.status === 'Late' && // sum late customers payments and skips last one
        s.statusDate.getMonth() > monthIndex &&
        s.statusDate.getFullYear() >= year
      ) {
        return (revenue += s.valueCharged);
      }

      if (
        s.chargeFrequencyInDays === 30 &&
        s.status === 'Canceled' && // sum canceled customers payments and skips last one
        s.startDate.getMonth() <= monthIndex &&
        s.startDate.getFullYear() <= year &&
        s.cancellationDate.getMonth() > monthIndex &&
        s.cancellationDate.getFullYear() >= year
      ) {
        return (revenue += s.valueCharged);
      }

      if (
        (s.chargeFrequencyInDays === 360 || s.chargeFrequencyInDays === 365) && // sum yearly customers payments
        s.startDate.getMonth() === monthIndex &&
        s.startDate.getFullYear() === year
      ) {
        return (revenue += s.valueCharged);
      }
    });

    return {
      relatesTo: `${toDoubleDigits(monthIndex + 1)}-${year}`,
      revenue: parseFloat(revenue.toFixed(2)),
    };
  };
}
