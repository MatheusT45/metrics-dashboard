import { Test, TestingModule } from '@nestjs/testing';
import { LifetimeValueService } from './lifetime-value.service';
import { CommonService } from '../common/common.service';

describe('LifetimeValueService', () => {
  let service: LifetimeValueService;
  let commonService: CommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifetimeValueService, CommonService],
    }).compile();

    service = module.get<LifetimeValueService>(LifetimeValueService);
    commonService = module.get<CommonService>(CommonService);
  });

  describe('getYearlyLifetimeValue', () => {
    it('should return an array of LifetimeResponse objects', () => {
      jest
        .spyOn(commonService, 'callMonthlyCalculationsPerYear')
        .mockImplementation(() => [
          {
            relatesTo: '01-2020',
            averageTicketValue: 100,
            averageRetentionTime: 1,
            lifetimeValue: 100,
          },
        ]);

      const response = service.getYearlyLifetimeValue([]);

      expect(commonService.callMonthlyCalculationsPerYear).toHaveBeenCalled();
      expect(response).toEqual({
        data: [
          {
            relatesTo: '01-2020',
            averageTicketValue: 100,
            averageRetentionTime: 1,
            lifetimeValue: 100,
          },
        ],
        total: {
          relatesTo: 'Total',
          averageTicketValue: 100,
          averageRetentionTime: 1,
          lifetimeValue: 100,
        },
      });
    });
  });

  describe('getMonthlyLifetimeValue', () => {
    it('should count active subscriptions as revenue', () => {
      jest
        .spyOn(commonService, 'sortSubscriptionsByMonth')
        .mockImplementation(() => [
          {
            index: 0,
            chargeFrequencyInDays: 30,
            status: 'Active',
            startDate: new Date('2020-01-01 03:00:00'), // adjust to timezone
            statusDate: new Date('2020-01-01 03:00:00'),
            nextCycle: new Date('2020-01-31 03:00:00'),
            cancellationDate: null,
            chargeAmount: 1,
            valueCharged: 100,
            userId: 1,
          },
          {
            index: 1,
            chargeFrequencyInDays: 30,
            status: 'Canceled', // should be skipped
            startDate: new Date('2020-01-01 03:00:00'),
            statusDate: new Date('2020-01-01 03:00:00'),
            nextCycle: new Date('2020-01-31 03:00:00'),
            cancellationDate: new Date('2020-01-12 03:00:00'),
            chargeAmount: 1,
            valueCharged: 100,
            userId: 2,
          },

          {
            index: 1,
            chargeFrequencyInDays: 30,
            status: 'Canceled', // should be counted
            startDate: new Date('2020-01-01 03:00:00'),
            statusDate: new Date('2020-03-01 03:00:00'),
            nextCycle: new Date('2020-04-31 03:00:00'),
            cancellationDate: new Date('2020-03-12 03:00:00'),
            chargeAmount: 3,
            valueCharged: 100,
            userId: 2,
          },
          {
            index: 2,
            chargeFrequencyInDays: 30,
            status: 'Late', // should be counted
            startDate: new Date('2020-01-01 03:00:00'),
            statusDate: new Date('2020-03-01 03:00:00'),
            nextCycle: new Date('2020-04-31 03:00:00'),
            cancellationDate: null,
            chargeAmount: 3,
            valueCharged: 100,
            userId: 3,
          },
          {
            index: 3,
            chargeFrequencyInDays: 365,
            status: 'Canceled', // should be counted
            startDate: new Date('2020-01-01 03:00:00'),
            statusDate: new Date('2020-01-01 03:00:00'),
            nextCycle: new Date('2021-01-10 03:00:00'),
            cancellationDate: null,
            chargeAmount: 1,
            valueCharged: 1000,
            userId: 4,
          },
        ]);

      const response = service.getMonthlyLifetimeValue([], 0, 2020);

      expect(commonService.sortSubscriptionsByMonth).toHaveBeenCalled();
      expect(response).toEqual({
        relatesTo: '01-2020',
        averageTicketValue: 280,
        averageRetentionTime: 1.8,
        lifetimeValue: 504,
      });
    });
  });
});
