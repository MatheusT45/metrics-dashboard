import { toDoubleDigits } from 'src/helpers/numbers.helper';
import { Subscription } from '../models/subscription.model';
import {
  callMonthlyCalculationsPerYear,
  sortSubscriptionsByMonth,
} from './common/common';
import {
  ChurnRateResponse,
  RecursiveRevenueResponse,
} from 'src/models/responses.model';

export const getYearlyRecursiveRevenue = (
  subscriptions: Subscription[],
): ChurnRateResponse[] => {
  return callMonthlyCalculationsPerYear(
    subscriptions,
    getMonthlyRecursiveRevenue,
  );
};

export const getMonthlyRecursiveRevenue = (
  subscriptions: Subscription[],
  monthIndex: number,
  year: number,
): RecursiveRevenueResponse => {
  const monthSubscriptions = sortSubscriptionsByMonth(
    subscriptions,
    monthIndex,
    year,
  );

  const activeSubscriptions = monthSubscriptions.filter(
    (s) => s.status === 'Active' || s.status === 'Upgrade',
  );

  let monthlyRevenue = 0;
  activeSubscriptions.map((s) => {
    if (s.chargeFrequencyInDaysField === 30) {
      return (monthlyRevenue += s.valueCharged);
    }
    if (
      s.chargeFrequencyInDaysField === 360 ||
      s.chargeFrequencyInDaysField === 365
    ) {
      return (monthlyRevenue += s.valueCharged / 12);
    }
  });

  return {
    relatesTo: `${toDoubleDigits(monthIndex + 1)}-${year}`,
    monthlyRevenue: monthlyRevenue.toFixed(2),
  };
};
