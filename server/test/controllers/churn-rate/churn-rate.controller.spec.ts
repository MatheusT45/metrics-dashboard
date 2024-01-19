import { Test, TestingModule } from '@nestjs/testing';
import { ChurnRateController } from '../../../src/controllers/churn-rate/churn-rate.controller';

describe('ChurnRateController', () => {
  let controller: ChurnRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChurnRateController],
    }).compile();

    controller = module.get<ChurnRateController>(ChurnRateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
