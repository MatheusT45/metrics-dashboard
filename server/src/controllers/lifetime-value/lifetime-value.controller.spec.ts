import { Test, TestingModule } from '@nestjs/testing';
import { LifetimeValueController } from './lifetime-value.controller';
import { LifetimeValueService } from 'src/services/lifetime-value/lifetime-value.service';
import { SubscriptionMapper } from 'src/mappers/subscription.mapper';
import { loadFile } from 'src/helpers/file.helper';
import { CommonService } from 'src/services/common/common.service';

jest.mock('src/helpers/file.helper', () => ({
  loadFile: jest.fn(() => []),
}));

describe('LifetimeValueController', () => {
  let controller: LifetimeValueController;
  let lifetimeValueService: LifetimeValueService;

  const expectedResult = {
    data: [
      {
        relatesTo: '01-2022',
        averageTicketValue: 100,
        averageRetentionTime: 2,
        lifetimeValue: 50,
      },
    ],
    total: {
      relatesTo: 'Total',
      averageTicketValue: 100,
      averageRetentionTime: 2,
      lifetimeValue: 50,
    },
  };

  const file: any = {
    originalname: 'test-sheet.csv',
    buffer: Buffer.from('test'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifetimeValueController],
      providers: [LifetimeValueService, SubscriptionMapper, CommonService],
    }).compile();

    lifetimeValueService =
      module.get<LifetimeValueService>(LifetimeValueService);
    controller = module.get<LifetimeValueController>(LifetimeValueController);
  });

  it('should be call yearly function', () => {
    jest
      .spyOn(lifetimeValueService, 'getYearlyLifetimeValue')
      .mockImplementation(() => expectedResult);

    expect(jest.isMockFunction(loadFile)).toBeTruthy();
    expect(controller.uploadFile({ options: '{}' }, file)).toEqual(
      expectedResult,
    );
    expect(lifetimeValueService.getYearlyLifetimeValue([])).toBe(
      expectedResult,
    );
  });

  it('should be call monthly function', () => {
    jest
      .spyOn(lifetimeValueService, 'getMonthlyLifetimeValue')
      .mockImplementation(() => expectedResult[0]);

    const response = controller.uploadFile(
      { options: JSON.stringify({ month: 1, year: 2022 }) },
      file,
    );
    expect(jest.isMockFunction(loadFile)).toBeTruthy();
    expect(response).toEqual(expectedResult[0]);
    expect(lifetimeValueService.getMonthlyLifetimeValue([], 0, 2022)).toBe(
      expectedResult[0],
    );
  });
});
