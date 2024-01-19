import { Subscription } from 'src/models/subscription.model';

export const sortSubscriptionsByMonth = (
  subscriptions: Subscription[],
  monthIndex: number,
  year: number,
): Subscription[] => {
  subscriptions.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  return subscriptions.filter((s) => {
    return (
      (s.startDate.getMonth() <= monthIndex &&
        s.startDate.getFullYear() <= year &&
        s.nextCycle === null) ||
      (s.startDate.getMonth() <= monthIndex &&
        s.startDate.getFullYear() <= year &&
        s.nextCycle.getMonth() >= monthIndex &&
        s.nextCycle.getFullYear() >= year)
    );
  });
};

export function callMonthlyCalculationsPerYear(
  subscriptions: Subscription[],
  callbackFunction: (s: Subscription[], m: number, y: number) => any,
): any {
  subscriptions.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const firstYear = subscriptions[0].startDate.getFullYear();
  const lastYear =
    subscriptions[subscriptions.length - 1].startDate.getFullYear();
  const years = [];

  for (let i = firstYear; i <= lastYear; i++) {
    years.push(i);
  }

  const results = [];
  years.forEach((year) => {
    for (let i = 0; i < 12; i++) {
      results.push(callbackFunction(subscriptions, i, year));
    }
  });

  return results;
}
