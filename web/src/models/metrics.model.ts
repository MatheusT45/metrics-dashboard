export type SubscriptionPlanFilter = "All" | "Monthly" | "Yearly";

export type ChurnRate = {
  relatesTo: string;
  lostSubscriptions: number;
  subscriptions: number;
  newSubscriptions: number;
  churnRate: number;
};

export type RecurringRevenue = {
  relatesTo: string;
  revenue: number;
};
