import { Test, TestingModule } from '@nestjs/testing';
import { ChurnRateController } from './churn-rate.controller';
import { ChurnRateService } from 'src/services/churn-rate/churn-rate.service';
import { SubscriptionMapper } from 'src/mappers/subscription.mapper';
import { loadFile } from 'src/helpers/file.helper';
import { CommonService } from 'src/services/common/common.service';

jest.mock('src/helpers/file.helper', () => ({
  loadFile: jest.fn(() => []),
}));

describe('ChurnRateController', () => {
  let controller: ChurnRateController;
  let churnRateService: ChurnRateService;

  const expectedResult = [
    {
      relatesTo: '01-2022',
      lostSubscriptions: 10,
      subscriptions: 100,
      newSubscriptions: 5,
      churnRate: 10,
    },
  ];

  const file: any = {
    originalname: 'test-sheet.csv',
    buffer: Buffer.from('test'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChurnRateController],
      providers: [ChurnRateService, SubscriptionMapper, CommonService],
    }).compile();

    churnRateService = module.get<ChurnRateService>(ChurnRateService);
    controller = module.get<ChurnRateController>(ChurnRateController);
  });

  it('should be call yearly function', () => {
    jest
      .spyOn(churnRateService, 'getYearlyChurnRate')
      .mockImplementation(() => expectedResult);

    expect(jest.isMockFunction(loadFile)).toBeTruthy();
    expect(controller.uploadFile({ options: '{}' }, file)).toEqual(
      expectedResult,
    );
    expect(churnRateService.getYearlyChurnRate([])).toBe(expectedResult);
  });

  it('should be call monthly function', () => {
    jest
      .spyOn(churnRateService, 'getMonthlyChurnRate')
      .mockImplementation(() => expectedResult[0]);

    const response = controller.uploadFile(
      { options: JSON.stringify({ month: 1, year: 2022 }) },
      file,
    );
    expect(jest.isMockFunction(loadFile)).toBeTruthy();
    expect(response).toEqual(expectedResult[0]);
    expect(churnRateService.getMonthlyChurnRate([], 0, 2022)).toBe(
      expectedResult[0],
    );
  });
});
