import { Subscription } from 'src/models/subscription.model';

export const getYearlyChurnRate = (subscriptions: Subscription[]): any => {
  console.log(subscriptions);
};

export const getMonthlyChurnRate = (
  subscriptions: Subscription[],
  monthIndex: number,
  year: number,
): any => {
  subscriptions.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  const monthSubscriptions = subscriptions.filter((s) => {
    console.log(s.startDate.getMonth());
    if (
      s.startDate.getMonth() <= monthIndex &&
      s.startDate.getFullYear() <= year &&
      // s.nextCycle === null) ||
      s.nextCycle.getMonth() > monthIndex &&
      s.nextCycle.getFullYear() > year
    )
      return true;
    return false;
  });

  console.log(monthSubscriptions);

  const monthLostSubscriptions = monthSubscriptions.filter(
    (s) => s.status === 'Canceled',
  );

  const newCustomers = monthSubscriptions.filter(
    (s) =>
      s.startDate.getMonth() === monthIndex &&
      s.startDate.getFullYear() === 2022,
  );

  console.log('month number: ', monthIndex + 1);
  console.log('monthLostSubscriptions: ', monthLostSubscriptions.length);
  console.log('monthSubscriptions: ', monthSubscriptions.length);
  console.log('newCustomers: ', newCustomers.length);
  console.log(
    'churn: ',
    (monthLostSubscriptions.length / monthSubscriptions.length) * 100,
  );
};
