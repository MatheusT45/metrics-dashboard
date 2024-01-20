export type SubscriptionPlanFilter = 'All' | 'Monthly' | 'Yearly';

export type Options = {
  month?: number;
  year?: number;
  filterSubscriptionPlan?: SubscriptionPlanFilter;

  // separator?: string;
  // dateFormat?: string;
  // startDateField?: string;
  // statusDateField?: string;
  // cancellationDateField?: string;
  // activeField?: string;
  // activeFieldValue?: string;
  // chargeAmountField?: string;
  // chargeFrequencyInDaysField?: string;
  // nextCycleField?: string;
  // idField?: string;
};

export type BodyOptions = {
  options: string;
};
