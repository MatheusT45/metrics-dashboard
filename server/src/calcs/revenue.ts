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

  let monthlyRevenue = 0;
  monthSubscriptions.map((s) => {
    if (
      s.chargeFrequencyInDaysField === 30 &&
      (s.status === 'Active' || s.status === 'Upgrade') // get active and upgrade customers
    ) {
      return (monthlyRevenue += s.valueCharged);
    }

    if (
      s.chargeFrequencyInDaysField === 30 &&
      s.status === 'Late' && // sum late customers payments and skips last one
      s.statusDate.getMonth() > monthIndex &&
      s.statusDate.getFullYear() >= year
    ) {
      return (monthlyRevenue += s.valueCharged);
    }

    if (
      s.chargeFrequencyInDaysField === 30 &&
      s.status === 'Canceled' && // sum canceled customers payments and skips last one
      s.startDate.getMonth() <= monthIndex &&
      s.startDate.getFullYear() <= year &&
      s.cancellationDate.getMonth() > monthIndex &&
      s.cancellationDate.getFullYear() >= year
    ) {
      return (monthlyRevenue += s.valueCharged);
    }

    if (
      (s.chargeFrequencyInDaysField === 360 ||
        s.chargeFrequencyInDaysField === 365) && // sum yearly customers payments
      s.startDate.getMonth() === monthIndex &&
      s.startDate.getFullYear() === year
    ) {
      return (monthlyRevenue += s.valueCharged);
    }
  });

  return {
    relatesTo: `${toDoubleDigits(monthIndex + 1)}-${year}`,
    monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2)),
  };
};
