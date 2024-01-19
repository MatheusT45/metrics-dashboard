export type SubscriptionStatus =
  | 'Active'
  | 'Canceled'
  | 'Late'
  | 'Trial Canceled'
  | 'Upgrade';

export type Subscription = {
  index?: number;
  chargeAmount: number;
  chargeFrequencyInDaysField: number;
  startDate: Date;
  status: SubscriptionStatus;
  statusDate: Date;
  cancellationDate?: Date;
  valueCharged: number;
  nextCycle?: Date;
  userId: number;
};
