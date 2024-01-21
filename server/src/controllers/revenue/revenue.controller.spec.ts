import { Test, TestingModule } from '@nestjs/testing';
import { RevenueController } from './revenue.controller';
import { RevenueService } from 'src/services/revenue/revenue.service';
import { SubscriptionMapper } from 'src/mappers/subscription.mapper';
import { loadFile } from 'src/helpers/file.helper';
import { CommonService } from 'src/services/common/common.service';

jest.mock('src/helpers/file.helper', () => ({
  loadFile: jest.fn(() => []),
}));

describe('RevenueController', () => {
  let controller: RevenueController;
  let revenueService: RevenueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevenueController],
      providers: [RevenueService, SubscriptionMapper, CommonService],
    }).compile();

    revenueService = module.get<RevenueService>(RevenueService);
    controller = module.get<RevenueController>(RevenueController);
  });

  it('should be defined', () => {
    const result = [
      {
        relatesTo: '01-2022',
        monthlyRevenue: 100.0,
      },
    ];

    expect(jest.isMockFunction(loadFile)).toBeTruthy();
    jest
      .spyOn(revenueService, 'getYearlyRecurringRevenue')
      .mockImplementation(() => result);

    expect(revenueService.getYearlyRecurringRevenue([])).toBe(result);
    expect(controller).toBeDefined();
  });
});
