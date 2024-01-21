import { Test, TestingModule } from '@nestjs/testing';
import { ChurnRateController } from './churn-rate.controller';
import { ChurnService } from 'src/services/churn/churn.service';
import { SubscriptionMapper } from 'src/mappers/subscription.mapper';
import { loadFile } from 'src/helpers/file.helper';
import { CommonService } from 'src/services/common/common.service';

jest.mock('src/helpers/file.helper', () => ({
  loadFile: jest.fn(() => []),
}));

describe('ChurnRateController', () => {
  let controller: ChurnRateController;
  let churnService: ChurnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChurnRateController],
      providers: [ChurnService, SubscriptionMapper, CommonService],
    }).compile();

    churnService = module.get<ChurnService>(ChurnService);
    controller = module.get<ChurnRateController>(ChurnRateController);
  });

  it('should be defined', () => {
    const result = [
      {
        relatesTo: '01-2022',
        lostSubscriptions: 23,
        subscriptions: 207,
        newSubscriptions: 85,
        churnRate: 11,
      },
    ];

    expect(jest.isMockFunction(loadFile)).toBeTruthy();
    jest
      .spyOn(churnService, 'getYearlyChurnRate')
      .mockImplementation(() => result);

    expect(churnService.getYearlyChurnRate([])).toBe(result);
    expect(controller).toBeDefined();
  });
});
