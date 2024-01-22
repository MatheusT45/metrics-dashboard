import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionMapper } from './subscription.mapper';

describe('SubscriptionMapper', () => {
  let mapper: SubscriptionMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionMapper],
    }).compile();

    mapper = module.get<SubscriptionMapper>(SubscriptionMapper);
  });

  describe('statusMapper', () => {
    it('should return Active status', () => {
      expect(mapper.statusMapper('Ativa')).toEqual('Active');
    });
    it('should return Canceled status', () => {
      expect(mapper.statusMapper('Cancelada')).toEqual('Canceled');
    });
    it('should return Late status', () => {
      expect(mapper.statusMapper('Atrasada')).toEqual('Late');
    });
    it('should return Trial Canceled status', () => {
      expect(mapper.statusMapper('Trial cancelado')).toEqual('Trial Canceled');
    });
    it('should return Upgrade status', () => {
      expect(mapper.statusMapper('Upgrade')).toEqual('Upgrade');
    });
    it('should return Active status by default', () => {
      expect(mapper.statusMapper('')).toEqual('Active');
    });
  });

  describe('fixInvalidNextCycleDates', () => {
    it('should fix invalid nextCycle dates', () => {
      const jsonSheet = [
        {
          próximo_ciclo: '30/06/2023',
        },
      ];

      const subscriptions = [
        {
          index: 0,
          nextCycle: new Date('30/06/2023'),
        },
      ];

      expect(
        mapper.fixInvalidNextCycleDates(jsonSheet as any, subscriptions as any),
      ).toEqual([
        {
          index: 0,
          nextCycle: new Date('2023-06-30T03:00:00.000Z'),
        },
      ]);
    });
  });

  describe('fixStatusDates', () => {
    let subscriptions = [];

    beforeEach(() => {
      subscriptions = [
        {
          index: 0,
          startDate: new Date('2023-02-15'),
          statusDate: new Date('2024-09-13'),
          chargeFrequencyInDays: 30,
          status: 'Active',
          chargeAmount: 1,
        },
      ];
    });

    it('should fix the status dates when its after the fixed status date', () => {
      expect(mapper.fixStatusDates(subscriptions as any)).toMatchObject([
        {
          statusDate: new Date('2023-03-15'),
        },
      ]);
    });

    it('should fix the status dates when its before the fixed status date', () => {
      const response = mapper.fixStatusDates([
        {
          ...subscriptions[0],
          chargeAmount: 5,
          statusDate: new Date('2023-01-13'),
        },
      ] as any);

      expect(response).toMatchObject([
        {
          statusDate: new Date('2023-07-15'),
        },
      ]);
    });

    it('should not fix when the subscription is yearly', () => {
      const response = mapper.fixStatusDates([
        {
          ...subscriptions[0],
          chargeFrequencyInDays: 365,
        },
      ] as any);

      expect(response).toMatchObject([
        {
          statusDate: new Date('2024-09-13'),
        },
      ]);
    });

    it('should not fix when the subscription is yearly', () => {
      const response = mapper.fixStatusDates([
        {
          ...subscriptions[0],
          status: 'Canceled',
        },
      ] as any);

      expect(response).toMatchObject([
        {
          statusDate: new Date('2024-09-13'),
        },
      ]);
    });
  });

  describe('fixMonthlyNextCycleDates', () => {
    let subscriptions = [];

    beforeEach(() => {
      subscriptions = [
        {
          index: 0,
          startDate: new Date('2023-02-15'),
          nextCycle: new Date('2024-09-13'),
          chargeFrequencyInDays: 30,
          status: 'Active',
          chargeAmount: 1,
        },
      ];
    });

    it('should fix the nextCycle dates when its after the fixed nextCycle date', () => {
      expect(
        mapper.fixMonthlyNextCycleDates(subscriptions as any),
      ).toMatchObject([
        {
          nextCycle: new Date('2023-03-15'),
        },
      ]);
    });

    it('should fix the nextCycle dates when its before the fixed nextCycle date', () => {
      const response = mapper.fixMonthlyNextCycleDates([
        {
          ...subscriptions[0],
          chargeAmount: 5,
          nextCycle: new Date('2023-01-13'),
        },
      ] as any);

      expect(response).toMatchObject([
        {
          nextCycle: new Date('2023-07-15'),
        },
      ]);
    });

    it('should not fix when the subscription is yearly', () => {
      const response = mapper.fixMonthlyNextCycleDates([
        {
          ...subscriptions[0],
          chargeFrequencyInDays: 365,
        },
      ] as any);

      expect(response).toMatchObject([
        {
          nextCycle: new Date('2024-09-13'),
        },
      ]);
    });
  });

  describe('fixYearlyNextCycleDates', () => {
    let subscriptions = [];

    beforeEach(() => {
      subscriptions = [
        {
          index: 0,
          startDate: new Date('2023-02-15'),
          nextCycle: new Date('2024-09-13'),
          chargeFrequencyInDays: 365,
          status: 'Active',
          chargeAmount: 1,
        },
      ];
    });

    it('should fix the nextCycle dates when its after the fixed nextCycle date', () => {
      expect(
        mapper.fixYearlyNextCycleDates(subscriptions as any),
      ).toMatchObject([
        {
          nextCycle: new Date('2024-09-13'),
        },
      ]);
    });

    it('should fix the nextCycle dates when its before the fixed nextCycle date', () => {
      const response = mapper.fixYearlyNextCycleDates([
        {
          ...subscriptions[0],
          chargeAmount: 5,
          nextCycle: new Date('2023-01-13'),
        },
      ] as any);

      expect(response).toMatchObject([
        {
          nextCycle: new Date('2028-02-15'),
        },
      ]);
    });

    it('should not fix when the subscription is monthly', () => {
      const response = mapper.fixYearlyNextCycleDates([
        {
          ...subscriptions[0],
          chargeFrequencyInDays: 30,
        },
      ] as any);

      expect(response).toMatchObject([
        {
          nextCycle: new Date('2024-09-13'),
        },
      ]);
    });
  });

  describe('treatData', () => {
    it('should call all the treatment methods', () => {
      jest
        .spyOn(mapper, 'fixInvalidNextCycleDates')
        .mockImplementation(() => []);
      jest.spyOn(mapper, 'fixStatusDates').mockImplementation(() => []);
      jest
        .spyOn(mapper, 'fixMonthlyNextCycleDates')
        .mockImplementation(() => []);
      jest
        .spyOn(mapper, 'fixYearlyNextCycleDates')
        .mockImplementation(() => []);

      mapper.treatData([], []);

      expect(mapper.fixInvalidNextCycleDates).toHaveBeenCalled();
      expect(mapper.fixStatusDates).toHaveBeenCalled();
      expect(mapper.fixMonthlyNextCycleDates).toHaveBeenCalled();
      expect(mapper.fixYearlyNextCycleDates).toHaveBeenCalled();
    });
  });

  describe('map', () => {
    it('should call all the treatment methods', () => {
      const jsonSheet = [
        {
          quantidade_cobranças: '1',
          cobrada_a_cada_X_dias: '1',
          data_início: '2023-06-30',
          status: 'Ativo',
          data_status: '2023-06-30',
          data_cancelamento: '',
          valor: '100,12',
          próximo_ciclo: '2023-06-30',
          ID_assinante: 'user_1',
        },
      ];

      const expectedResponse = [
        {
          index: 0,
          chargeAmount: 1,
          chargeFrequencyInDays: 1,
          startDate: new Date('2023-06-30'),
          status: 'Active',
          statusDate: new Date('2023-06-30'),
          cancellationDate: null,
          valueCharged: 100.12,
          nextCycle: new Date('2023-06-30'),
          userId: 1,
        },
      ];

      jest
        .spyOn(mapper, 'treatData')
        .mockImplementation(() => expectedResponse as any);

      const response = mapper.map(jsonSheet);

      expect(mapper.treatData).toHaveBeenCalledWith(
        jsonSheet,
        expectedResponse,
      );
      expect(response).toEqual(expectedResponse);
    });
  });
});
