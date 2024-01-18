import { SheetHeaders } from 'src/models/sheet.model';
import {
  Subscription,
  SubscriptionStatus,
} from 'src/models/subscription.model';

const statusMapper = (status: string): SubscriptionStatus => {
  switch (status) {
    case 'Ativa':
      return 'Active';
    case 'Cancelada':
      return 'Canceled';
    case 'Atrasada':
      return 'Late';
    case 'Trial cancelado':
      return 'Trial Canceled';
    case 'Upgrade':
      return 'Upgrade';
    default:
      return 'Active';
  }
};

export const subscriptionMapper = (
  jsonSheet: SheetHeaders[],
): Subscription[] => {
  const subscriptions: Subscription[] = jsonSheet.map((headerField) => ({
    chargeAmount: parseInt(headerField.quantidade_cobranças),
    chargeFrequencyInDaysField: parseInt(headerField.cobrada_a_cada_X_dias),
    startDate: new Date(headerField.data_início),
    status: statusMapper(headerField.status),
    statusDate: new Date(headerField.data_status),
    cancellationDate: new Date(headerField.data_cancelamento),
    valueCharged: parseFloat(headerField.valor.replace(',', '.')),
    nextCycle: new Date(headerField.próximo_ciclo),
    userId: parseInt(headerField.ID_assinante.replace('user_', '')),
  }));
  return subscriptions;
};
