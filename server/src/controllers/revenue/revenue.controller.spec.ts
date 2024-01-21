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

  const expectedResult = [
    {
      relatesTo: '01-2022',
      monthlyRevenue: 100.0,
    },
  ];

  const file: any = {
    originalname: 'test-sheet.csv',
    buffer: Buffer.from('test'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevenueController],
      providers: [RevenueService, SubscriptionMapper, CommonService],
    }).compile();

    revenueService = module.get<RevenueService>(RevenueService);
    controller = module.get<RevenueController>(RevenueController);
  });

  it('should be call yearly function', () => {
    jest
      .spyOn(revenueService, 'getYearlyRecurringRevenue')
      .mockImplementation(() => expectedResult);

    expect(jest.isMockFunction(loadFile)).toBeTruthy();
    expect(controller.uploadFile({ options: '{}' }, file)).toEqual(
      expectedResult,
    );
    expect(revenueService.getYearlyRecurringRevenue([])).toBe(expectedResult);
  });

  it('should be call monthly function', () => {
    jest
      .spyOn(revenueService, 'getMonthlyRecurringRevenue')
      .mockImplementation(() => expectedResult[0]);

    const response = controller.uploadFile(
      { options: JSON.stringify({ month: 1, year: 2022 }) },
      file,
    );
    expect(jest.isMockFunction(loadFile)).toBeTruthy();
    expect(response).toEqual(expectedResult[0]);
    expect(revenueService.getMonthlyRecurringRevenue([], 0, 2022)).toBe(
      expectedResult[0],
    );
  });
});
