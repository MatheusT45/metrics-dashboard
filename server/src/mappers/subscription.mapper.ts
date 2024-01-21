import { Injectable } from '@nestjs/common';
import { SheetHeaders } from 'src/models/sheet.model';
import {
  Subscription,
  SubscriptionStatus,
} from 'src/models/subscription.model';

@Injectable()
export class SubscriptionMapper {
  statusMapper = (status: string): SubscriptionStatus => {
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

  // Some dates are being registered in the
  // wrong format, so this function fixes
  // the ones that can be detected e.g.: 30/06/2023
  fixInvalidNextCycleDates = (
    jsonSheet: SheetHeaders[],
    subscriptions: Subscription[],
  ): Subscription[] => {
    subscriptions.map((s) => {
      s.nextCycle.getTime();

      if (isNaN(s.nextCycle.getTime())) {
        const nextCycleDate = jsonSheet[s.index].próximo_ciclo.split('/');
        const fixedNextCycleDate = new Date(
          `${nextCycleDate[1]}/${nextCycleDate[0]}/${nextCycleDate[2]}`,
        );
        s.nextCycle = fixedNextCycleDate;
        return s;
      }
    });
    return subscriptions;
  };

  // Some Status Dates are registered before the actual start date
  fixStatusDates = (subscriptions: Subscription[]): Subscription[] => {
    subscriptions.map((s) => {
      const fixedStatusDate = new Date(s.startDate);
      fixedStatusDate.setMonth(s.startDate.getMonth() + s.chargeAmount - 1);
      if (
        s.chargeFrequencyInDays === 30 &&
        s.status === 'Active' &&
        (fixedStatusDate.getMonth() != s.statusDate.getMonth() ||
          fixedStatusDate.getFullYear() != s.statusDate.getFullYear())
      ) {
        s.statusDate = fixedStatusDate;
        return s;
      }
      return s;
    });
    return subscriptions;
  };

  // Some Next Cycle dates are calculated wrong
  fixMonthlyNextCycleDates = (
    subscriptions: Subscription[],
  ): Subscription[] => {
    subscriptions.map((s) => {
      const fixedNextCycleDate = new Date(s.startDate);
      fixedNextCycleDate.setMonth(s.startDate.getMonth() + s.chargeAmount);
      if (
        s.chargeFrequencyInDays === 30 &&
        (fixedNextCycleDate.getMonth() != s.nextCycle.getMonth() ||
          fixedNextCycleDate.getFullYear() != s.nextCycle.getFullYear())
      ) {
        s.nextCycle = fixedNextCycleDate;
        return s;
      }
      return s;
    });
    return subscriptions;
  };

  // Some Next Cycle dates are calculated wrong
  fixYearlyNextCycleDates = (subscriptions: Subscription[]): Subscription[] => {
    subscriptions.map((s) => {
      const fixedNextCycleDate = new Date(s.startDate);
      fixedNextCycleDate.setFullYear(
        s.startDate.getFullYear() + s.chargeAmount,
      );
      if (
        (s.chargeFrequencyInDays === 365 || s.chargeFrequencyInDays === 360) &&
        fixedNextCycleDate.getFullYear() != s.nextCycle.getFullYear()
      ) {
        s.nextCycle = fixedNextCycleDate;
        return s;
      }
      return s;
    });
    return subscriptions;
  };

  // Data treatment and validations
  treatData = (
    jsonSheet: SheetHeaders[],
    subscriptions: Subscription[],
  ): Subscription[] => {
    const fixedInvalidNextCycleDates = this.fixInvalidNextCycleDates(
      jsonSheet,
      subscriptions,
    );
    const fixedStatusDates = this.fixStatusDates(fixedInvalidNextCycleDates);
    const fixedNextCycleDates = this.fixMonthlyNextCycleDates(fixedStatusDates);
    const fixedYearlyNextCycleDates =
      this.fixYearlyNextCycleDates(fixedNextCycleDates);

    return fixedYearlyNextCycleDates;
  };

  map = (jsonSheet: SheetHeaders[]): Subscription[] => {
    const subscriptions: Subscription[] = jsonSheet.map((headerField, i) => {
      return {
        index: i,
        chargeAmount: parseInt(headerField.quantidade_cobranças),
        chargeFrequencyInDays: parseInt(headerField.cobrada_a_cada_X_dias),
        startDate: new Date(headerField.data_início),
        status: this.statusMapper(headerField.status),
        statusDate: new Date(headerField.data_status),
        cancellationDate: headerField.data_cancelamento
          ? new Date(headerField.data_cancelamento)
          : null,
        valueCharged: parseFloat(headerField.valor.replace(',', '.')),
        nextCycle: headerField.próximo_ciclo
          ? new Date(headerField.próximo_ciclo)
          : null,
        userId: parseInt(headerField.ID_assinante.replace('user_', '')),
      };
    });

    return this.treatData(jsonSheet, subscriptions);
  };
}
