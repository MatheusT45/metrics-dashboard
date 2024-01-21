import { Test, TestingModule } from '@nestjs/testing';
import { ChurnService } from './churn.service';
import { CommonService } from '../common/common.service';

describe('ChurnService', () => {
  let service: ChurnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChurnService, CommonService],
    }).compile();

    service = module.get<ChurnService>(ChurnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
