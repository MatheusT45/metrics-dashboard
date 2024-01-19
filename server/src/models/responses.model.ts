export type ChurnRateResponse = {
  relatesTo: string;
  lostSubscriptions: number;
  subscriptions: number;
  newSubscriptions: number;
  churn: number;
};

export type AnualChurnRateResponse = {
  relatesTo: string;
  data: ChurnRateResponse[];
};
