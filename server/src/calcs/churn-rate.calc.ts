import {
  AnualChurnRateResponse,
  ChurnRateResponse,
} from 'src/models/responses.model';
import { Subscription } from 'src/models/subscription.model';

export const getYearlyChurnRate = (
  subscriptions: Subscription[],
): AnualChurnRateResponse[] => {
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
      results.push({
        relatesTo: `${i + 1}-${year}`,
        data: getMonthlyChurnRate(subscriptions, i, year),
      });
    }
  });

  return results;
};

export const getMonthlyChurnRate = (
  subscriptions: Subscription[],
  monthIndex: number,
  year: number,
): ChurnRateResponse => {
  subscriptions.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  const monthSubscriptions = subscriptions.filter((s) => {
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

  const lostSubscriptions = monthSubscriptions.filter(
    (s) =>
      s.status === 'Canceled' &&
      s.cancellationDate.getMonth() === monthIndex &&
      s.cancellationDate.getFullYear() === year,
  );

  const newSubscriptions = monthSubscriptions.filter(
    (s) =>
      s.status === 'Active' && // Check only for active new customers
      s.startDate.getMonth() === monthIndex &&
      s.startDate.getFullYear() === year,
  );

  return {
    relatesTo: `${monthIndex + 1}-${year}`,
    lostSubscriptions: lostSubscriptions.length,
    subscriptions: monthSubscriptions.length,
    newSubscriptions: newSubscriptions.length,
    churn: (lostSubscriptions.length / monthSubscriptions.length) * 100,
  };
};
