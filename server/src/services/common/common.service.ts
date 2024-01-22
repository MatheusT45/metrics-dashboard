import { Injectable } from '@nestjs/common';
import { SubscriptionPlanFilter } from 'src/models/metric-options.model';
import { Subscription } from 'src/models/subscription.model';

@Injectable()
export class CommonService {
  sortSubscriptionsByMonth = (
    subscriptions: Subscription[],
    monthIndex: number,
    year: number,
  ): Subscription[] => {
    subscriptions.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    return subscriptions.filter((s) => {
      const currentMonthStartDate = new Date(year, monthIndex, 1);
      const currentMonthEndDate = new Date(year, monthIndex + 1, 0);

      return (
        (s.startDate <= currentMonthStartDate &&
          s.nextCycle >= currentMonthEndDate) ||
        (s.startDate.getMonth() === monthIndex &&
          s.startDate.getFullYear() === year) ||
        (s.nextCycle.getMonth() === monthIndex &&
          s.nextCycle.getFullYear() === year)
      );
    });
  };

  callMonthlyCalculationsPerYear(
    subscriptions: Subscription[],
    year: number,
    filterSubscriptionPlan: SubscriptionPlanFilter,
    callbackFunction: (s: Subscription[], m: number, y: number) => any,
  ): any {
    subscriptions.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    if (filterSubscriptionPlan === 'Monthly') {
      subscriptions = subscriptions.filter(
        (s) => s.chargeFrequencyInDays === 30,
      );
    }

    if (filterSubscriptionPlan === 'Yearly') {
      subscriptions = subscriptions.filter(
        (s) =>
          s.chargeFrequencyInDays === 365 || s.chargeFrequencyInDays === 360,
      );
    }

    const years = [];

    if (!year) {
      const firstYear = subscriptions[0].startDate.getFullYear();
      const lastYear =
        subscriptions[subscriptions.length - 1].nextCycle.getFullYear();
      for (let i = firstYear; i <= lastYear; i++) {
        years.push(i);
      }
    } else {
      years.push(year);
    }
    const results = [];
    years.forEach((year) => {
      for (let i = 0; i < 12; i++) {
        results.push(callbackFunction(subscriptions, i, year));
      }
    });

    return results;
  }
}
