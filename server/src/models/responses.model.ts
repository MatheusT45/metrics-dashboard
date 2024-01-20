export type ChurnRateResponse = {
  relatesTo: string;
  lostSubscriptions: number;
  subscriptions: number;
  newSubscriptions: number;
  churnRate: number;
};

export type RecurringRevenueResponse = {
  relatesTo: string;
  monthlyRevenue: number;
};
