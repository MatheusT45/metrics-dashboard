import { toDoubleDigits } from 'src/helpers/numbers.helper';
import { ChurnRateResponse } from 'src/models/responses.model';
import { Subscription } from 'src/models/subscription.model';
import {
  callMonthlyCalculationsPerYear,
  sortSubscriptionsByMonth,
} from './common/common';

export const getYearlyChurnRate = (
  subscriptions: Subscription[],
): ChurnRateResponse[] => {
  return callMonthlyCalculationsPerYear(subscriptions, getMonthlyChurnRate);
};

export const getMonthlyChurnRate = (
  subscriptions: Subscription[],
  monthIndex: number,
  year: number,
): ChurnRateResponse => {
  const monthSubscriptions = sortSubscriptionsByMonth(
    subscriptions,
    monthIndex,
    year,
  );

  // TODO: consider status date to avoid counting a customer whose status wasnt updated yet
  // monthSubscriptions.forEach((s) => {
  //   if (
  //     s.chargeFrequencyInDaysField === 30 &&
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
