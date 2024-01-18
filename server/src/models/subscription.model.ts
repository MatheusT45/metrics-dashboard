export type SubscriptionStatus =
  | 'Active'
  | 'Canceled'
  | 'Late'
  | 'Trial Canceled'
  | 'Upgrade';

export type SheetHeaders = {
  quantidade_cobranças: string;
  cobrada_a_cada_X_dias: string;
  data_início: string;
  status: string;
  data_status: string;
  data_cancelamento: string;
  valor: string;
  próximo_ciclo: string;
  ID_assinante: string;
};

export type Subscription = {
  chargeAmount: number;
  chargeFrequencyInDaysField: number;
  startDate: Date;
  status: SubscriptionStatus;
  statusDate: Date;
  cancellationDate?: Date;
  valueCharged: number;
  nextCycle: Date;
  userId: number;
};

export type Month =
  | 'jan'
  | 'feb'
  | 'mar'
  | 'apr'
  | 'may'
  | 'jun'
  | 'jul'
  | 'aug'
  | 'sep'
  | 'oct'
  | 'nov'
  | 'dec';
