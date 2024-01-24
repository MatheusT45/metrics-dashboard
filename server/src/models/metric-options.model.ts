export type SubscriptionPlanFilter = 'All' | 'Monthly' | 'Yearly';

export type Options = {
  month?: number;
  year?: number;
  filterSubscriptionPlan?: SubscriptionPlanFilter;
};

export type BodyOptions = {
  options: string;
};
