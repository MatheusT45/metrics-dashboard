import { Test, TestingModule } from '@nestjs/testing';
import { RecurringRevenueController } from './recurring-revenue.controller';
import { RecurringRevenueService } from 'src/services/recurring-revenue/recurring-revenue.service';
import { SubscriptionMapper } from 'src/mappers/subscription.mapper';
import { loadFile } from 'src/helpers/file.helper';
import { CommonService } from 'src/services/common/common.service';

jest.mock('src/helpers/file.helper', () => ({
  loadFile: jest.fn(() => []),
}));

describe('RecurringRevenueController', () => {
  let controller: RecurringRevenueController;
  let recurringRevenueService: RecurringRevenueService;

  const expectedResult = {
    data: [
      {
        relatesTo: '01-2022',
        revenue: 100.0,
      },
    ],
    total: {
      relatesTo: 'Total',
      revenue: 100.0,
    },
  };
  const file: any = {
    originalname: 'test-sheet.csv',
    buffer: Buffer.from('test'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecurringRevenueController],
      providers: [RecurringRevenueService, SubscriptionMapper, CommonService],
    }).compile();

    recurringRevenueService = module.get<RecurringRevenueService>(
      RecurringRevenueService,
    );
    controller = module.get<RecurringRevenueController>(
      RecurringRevenueController,
    );
  });

  it('should be call yearly function', () => {
    jest
      .spyOn(recurringRevenueService, 'getYearlyRecurringRevenue')
      .mockImplementation(() => expectedResult);

    expect(jest.isMockFunction(loadFile)).toBeTruthy();
    expect(controller.uploadFile({ options: '{}' }, file)).toEqual(
      expectedResult,
    );
    expect(recurringRevenueService.getYearlyRecurringRevenue([])).toBe(
      expectedResult,
    );
  });

  it('should be call monthly function', () => {
    jest
      .spyOn(recurringRevenueService, 'getMonthlyRecurringRevenue')
      .mockImplementation(() => expectedResult[0]);

    const response = controller.uploadFile(
      { options: JSON.stringify({ month: 1, year: 2022 }) },
      file,
    );
    expect(jest.isMockFunction(loadFile)).toBeTruthy();
    expect(response).toEqual(expectedResult[0]);
    expect(
      recurringRevenueService.getMonthlyRecurringRevenue([], 0, 2022),
    ).toBe(expectedResult[0]);
  });
});
