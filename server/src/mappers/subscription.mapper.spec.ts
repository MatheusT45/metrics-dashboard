import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionMapper } from './subscription.mapper';

describe('SubscriptionMapper', () => {
  let service: SubscriptionMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionMapper],
    }).compile();

    service = module.get<SubscriptionMapper>(SubscriptionMapper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
