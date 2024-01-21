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
      providers: [ChurnService, SubscriptionMapper, CommonService],
    }).compile();

    churnService = module.get<ChurnService>(ChurnService);
    controller = module.get<ChurnRateController>(ChurnRateController);
  });

  it('should be call yearly function', () => {
    jest
      .spyOn(churnService, 'getYearlyChurnRate')
      .mockImplementation(() => expectedResult);

    expect(jest.isMockFunction(loadFile)).toBeTruthy();
    expect(controller.uploadFile({ options: '{}' }, file)).toEqual(
      expectedResult,
    );
    expect(churnService.getYearlyChurnRate([])).toBe(expectedResult);
  });

  it('should be call monthly function', () => {
    jest
      .spyOn(churnService, 'getMonthlyChurnRate')
      .mockImplementation(() => expectedResult[0]);

    const response = controller.uploadFile(
      { options: JSON.stringify({ month: 1, year: 2022 }) },
      file,
    );
    expect(jest.isMockFunction(loadFile)).toBeTruthy();
    expect(response).toEqual(expectedResult[0]);
    expect(churnService.getMonthlyChurnRate([], 0, 2022)).toBe(
      expectedResult[0],
    );
  });
});
