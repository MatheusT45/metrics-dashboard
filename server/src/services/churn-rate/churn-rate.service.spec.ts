import { Test, TestingModule } from '@nestjs/testing';
import { ChurnRateService } from './churn-rate.service';
import { CommonService } from '../common/common.service';

describe('ChurnRateService', () => {
  let service: ChurnRateService;
  let commonService: CommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChurnRateService, CommonService],
    }).compile();

    service = module.get<ChurnRateService>(ChurnRateService);
    commonService = module.get<CommonService>(CommonService);
  });

  describe('getYearlyChurnRate', () => {
    it('should return an array of ChurnRateResponse objects', () => {
      jest
        .spyOn(commonService, 'callMonthlyCalculationsPerYear')
        .mockImplementation(() => [
          {
            relatesTo: '01-2020',
            lostSubscriptions: 2,
            subscriptions: 2,
            newSubscriptions: 0,
            churnRate: 100,
          },
        ]);

      const response = service.getYearlyChurnRate([]);

      expect(commonService.callMonthlyCalculationsPerYear).toHaveBeenCalled();
      expect(response).toEqual({
        data: [
          {
            relatesTo: '01-2020',
            lostSubscriptions: 2,
            subscriptions: 2,
            newSubscriptions: 0,
            churnRate: 100,
          },
        ],
        total: {
          relatesTo: 'Total',
          lostSubscriptions: 2,
          subscriptions: 2,
          newSubscriptions: 0,
          churnRate: 100,
        },
      });
    });
  });

  describe('getMonthlyChurnRate', () => {
    it('should return an array of ChurnRateResponse objects', () => {
      jest
        .spyOn(commonService, 'sortSubscriptionsByMonth')
        .mockImplementation(() => [
          {
            index: 0,
            chargeFrequencyInDays: 30,
            status: 'Active',
            statusDate: new Date('2020-01-01 00:00:00'),
            startDate: new Date('2020-01-01 00:00:00'),
            nextCycle: new Date('2020-01-31 00:00:00'),
            cancellationDate: null,
            chargeAmount: 1,
            valueCharged: 100,
            userId: 1,
          },
          {
            index: 0,
            chargeFrequencyInDays: 30,
            status: 'Upgrade',
            statusDate: new Date('2020-01-01 00:00:00'),
            startDate: new Date('2020-01-01 00:00:00'),
            nextCycle: new Date('2020-01-31 00:00:00'),
            cancellationDate: null,
            chargeAmount: 1,
            valueCharged: 100,
            userId: 1,
          },
          {
            index: 0,
            chargeFrequencyInDays: 30,
            status: 'Late',
            statusDate: new Date('2020-01-01 00:00:00'),
            startDate: new Date('2020-01-01 00:00:00'),
            nextCycle: new Date('2020-01-31 00:00:00'),
            cancellationDate: null,
            chargeAmount: 1,
            valueCharged: 100,
            userId: 1,
          },
        ]);

      const response = service.getMonthlyChurnRate([], 0, 2020);

      expect(commonService.sortSubscriptionsByMonth).toHaveBeenCalled();
      expect(response).toEqual({
        relatesTo: '01-2020',
        lostSubscriptions: 0,
        subscriptions: 3,
        newSubscriptions: 3,
        churnRate: 0,
      });
    });

    it('should return an array of ChurnRateResponse objects', () => {
      jest
        .spyOn(commonService, 'sortSubscriptionsByMonth')
        .mockImplementation(() => [
          {
            index: 0,
            chargeFrequencyInDays: 30,
            status: 'Canceled',
            statusDate: new Date('2020-01-01 00:00:00'),
            startDate: new Date('2020-01-01 00:00:00'),
            nextCycle: new Date('2020-01-31 00:00:00'),
            cancellationDate: new Date('2020-01-11 00:00:00'),
            chargeAmount: 1,
            valueCharged: 100,
            userId: 1,
          },
          {
            index: 0,
            chargeFrequencyInDays: 30,
            status: 'Trial Canceled',
            statusDate: new Date('2020-01-01 00:00:00'),
            startDate: new Date('2020-01-01 00:00:00'),
            nextCycle: new Date('2020-01-31 00:00:00'),
            cancellationDate: new Date('2020-01-11 00:00:00'),
            chargeAmount: 1,
            valueCharged: 100,
            userId: 1,
          },
        ]);

      const response = service.getMonthlyChurnRate([], 0, 2020);

      expect(commonService.sortSubscriptionsByMonth).toHaveBeenCalled();
      expect(response).toEqual({
        relatesTo: '01-2020',
        lostSubscriptions: 2,
        subscriptions: 2,
        newSubscriptions: 0,
        churnRate: 100,
      });
    });
  });
});
