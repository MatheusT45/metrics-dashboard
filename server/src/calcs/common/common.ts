import { SubscriptionPlanFilter } from 'src/models/metric-options.model';
import { Subscription } from 'src/models/subscription.model';

export const sortSubscriptionsByMonth = (
  subscriptions: Subscription[],
  monthIndex: number,
  year: number,
): Subscription[] => {
  subscriptions.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  return subscriptions.filter((s) => {
    return (
      s.startDate.getMonth() <= monthIndex &&
      s.startDate.getFullYear() <= year &&
      s.nextCycle.getMonth() >= monthIndex &&
      s.nextCycle.getFullYear() >= year
    );
  });
};

export function callMonthlyCalculationsPerYear(
  subscriptions: Subscription[],
  year: number,
  filterSubscriptionPlan: SubscriptionPlanFilter,
  callbackFunction: (s: Subscription[], m: number, y: number) => any,
): any {
  subscriptions.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  if (filterSubscriptionPlan === 'Monthly') {
    subscriptions = subscriptions.filter(
      (s) => s.chargeFrequencyInDaysField === 30,
    );
  }

  if (filterSubscriptionPlan === 'Yearly') {
    subscriptions = subscriptions.filter(
      (s) =>
        s.chargeFrequencyInDaysField === 365 ||
        s.chargeFrequencyInDaysField === 360,
    );
  }

  const years = [];

  if (!year) {
    const firstYear = subscriptions[0].startDate.getFullYear();
    const lastYear =
      subscriptions[subscriptions.length - 1].startDate.getFullYear();
    for (let i = firstYear; i <= lastYear; i++) {
      years.push(i);
    }
  } else {
    // TODO: remove else
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
