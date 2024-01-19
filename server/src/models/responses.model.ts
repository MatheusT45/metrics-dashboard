export type ChurnRateResponse = {
  relatesTo: string;
  lostSubscriptions: number;
  subscriptions: number;
  newSubscriptions: number;
  churn: number;
};

export type RecursiveRevenueResponse = {
  relatesTo: string;
  monthlyRevenue: string;
};
