import { Test, TestingModule } from '@nestjs/testing';
import { CommonService } from './common.service';
import { Subscription } from 'src/models/subscription.model';

describe('CommonService', () => {
  let service: CommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonService],
    }).compile();

    service = module.get<CommonService>(CommonService);
  });

  describe('sortSubscriptionsByMonth', () => {
    it('should return subscriptions for a given month', () => {
      const subscriptions = [
        {
          startDate: new Date(2020, 0, 1),
          nextCycle: new Date(2020, 0, 1),
        },
        {
          startDate: new Date(2020, 0, 1),
          nextCycle: new Date(2020, 1, 1),
        },
        {
          startDate: new Date(2020, 1, 1),
          nextCycle: new Date(2020, 1, 1),
        },
        {
          startDate: new Date(2020, 1, 1),
          nextCycle: new Date(2020, 2, 1),
        },
      ];

      const result = service.sortSubscriptionsByMonth(
        subscriptions as Partial<Subscription[]>,
        0,
        2020,
      );

      expect(result.length).toBe(2);
    });
  });

  describe('callMonthlyCalculationsPerYear', () => {
    it('should return yearly churn rate for monthly plans', () => {
      const subscriptions = [
        {
          startDate: new Date(2020, 0, 1),
          nextCycle: new Date(2020, 0, 1),
          status: 'Active',
        },
        {
          startDate: new Date(2020, 0, 1),
          nextCycle: new Date(2020, 1, 1),
          status: 'Canceled',
          cancellationDate: new Date(2020, 0, 1),
        },
        {
          startDate: new Date(2020, 1, 1),
          nextCycle: new Date(2020, 1, 1),
          status: 'Active',
        },
        {
          startDate: new Date(2020, 1, 1),
          nextCycle: new Date(2020, 2, 1),
          status: 'Canceled',
          cancellationDate: new Date(2020, 1, 1),
        },
      ];

      const mockedCallbackFunction = jest.fn().mockReturnValue({
        lostSubscriptions: 1,
        subscriptions: 2,
        newSubscriptions: 1,
        churnRate: 50,
      });

      const result = service.callMonthlyCalculationsPerYear(
        subscriptions as Partial<Subscription[]>,
        2020,
        'Monthly',
        mockedCallbackFunction,
      );

      expect(result.length).toBe(12);
      expect(result[0].lostSubscriptions).toBe(1);
      expect(result[0].subscriptions).toBe(2);
      expect(result[0].newSubscriptions).toBe(1);
      expect(result[0].churnRate).toBe(50);
    });

    it('should return yearly churn rate for yearly plans', () => {
      const subscriptions = [
        {
          startDate: new Date(2020, 0, 1),
          nextCycle: new Date(2020, 0, 1),
          status: 'Active',
        },
        {
          startDate: new Date(2020, 0, 1),
          nextCycle: new Date(2020, 1, 1),
          status: 'Canceled',
          cancellationDate: new Date(2020, 0, 1),
        },
        {
          startDate: new Date(2020, 0, 1),
          nextCycle: new Date(2020, 1, 1),
          status: 'Active',
          chargeFrequencyInDays: 365,
        },
        {
          startDate: new Date(2020, 1, 1),
          nextCycle: new Date(2020, 1, 1),
          status: 'Active',
        },
        {
          startDate: new Date(2020, 1, 1),
          nextCycle: new Date(2020, 2, 1),
          status: 'Canceled',
          cancellationDate: new Date(2020, 1, 1),
        },
      ];

      const mockedCallbackFunction = jest.fn().mockReturnValue({
        lostSubscriptions: 0,
        subscriptions: 1,
        newSubscriptions: 1,
        churnRate: 0,
      });

      const result = service.callMonthlyCalculationsPerYear(
        subscriptions as Partial<Subscription[]>,
        2020,
        'Yearly',
        mockedCallbackFunction,
      );

      expect(result.length).toBe(12);
      expect(result[0].lostSubscriptions).toBe(0);
      expect(result[0].subscriptions).toBe(1);
      expect(result[0].newSubscriptions).toBe(1);
      expect(result[0].churnRate).toBe(0);
    });

    it('should return yearly churn rate for all available years', () => {
      const subscriptions = [
        {
          startDate: new Date(2020, 0, 1),
          nextCycle: new Date(2020, 0, 1),
          status: 'Active',
        },
        {
          startDate: new Date(2020, 0, 1),
          nextCycle: new Date(2020, 1, 1),
          status: 'Canceled',
          cancellationDate: new Date(2020, 0, 1),
        },
        {
          startDate: new Date(2020, 0, 1),
          nextCycle: new Date(2020, 1, 1),
          status: 'Active',
          chargeFrequencyInDays: 365,
        },
        {
          startDate: new Date(2020, 1, 1),
          nextCycle: new Date(2020, 1, 1),
          status: 'Active',
        },
        {
          startDate: new Date(2020, 1, 1),
          nextCycle: new Date(2020, 2, 1),
          status: 'Canceled',
          cancellationDate: new Date(2020, 1, 1),
        },
        {
          startDate: new Date(2022, 1, 1),
          nextCycle: new Date(2022, 2, 1),
          status: 'Active',
        },
      ];

      const mockedCallbackFunction = jest.fn().mockReturnValue({
        lostSubscriptions: 1,
        subscriptions: 2,
        newSubscriptions: 1,
        churnRate: 50,
      });

      const result = service.callMonthlyCalculationsPerYear(
        subscriptions as Partial<Subscription[]>,
        null,
        'All',
        mockedCallbackFunction,
      );

      expect(result.length).toBe(36);
      expect(result[0].lostSubscriptions).toBe(1);
      expect(result[0].subscriptions).toBe(2);
      expect(result[0].newSubscriptions).toBe(1);
      expect(result[0].churnRate).toBe(50);
    });
  });
});
