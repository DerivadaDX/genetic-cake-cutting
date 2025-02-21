import { DefaultAllocationService, IAllocationService } from '../../src/cake-cutting/allocation-service';
import { AllocationServiceFactory } from '../../src/cake-cutting/allocation-service-factory';

describe('AllocationServiceFactory', () => {
  let mockAllocationService: IAllocationService;

  beforeEach(() => {
    mockAllocationService = {
      getAllocation: jest.fn().mockReturnValue({}),
    };
  });

  afterEach(() => {
    AllocationServiceFactory.setService(undefined as any);
  });

  test('returns an instance of DefaultAllocationService', () => {
    const allocationService = AllocationServiceFactory.create();
    expect(allocationService).toBeInstanceOf(DefaultAllocationService);
  });

  test('allows allocationService injection in test mode', () => {
    AllocationServiceFactory.setService(mockAllocationService);

    const allocationService = AllocationServiceFactory.create();
    expect(allocationService).toBe(mockAllocationService);
  });

  test('does not allow allocationService injection outside test mode (development)', () => {
    process.env.NODE_ENV = 'development';
    AllocationServiceFactory.setService(mockAllocationService);

    const allocationService = AllocationServiceFactory.create();
    expect(allocationService).not.toBe(mockAllocationService);
  });

  test('does not allow allocationService injection outside test mode (production)', () => {
    process.env.NODE_ENV = 'production';
    AllocationServiceFactory.setService(mockAllocationService);

    const allocationService = AllocationServiceFactory.create();
    expect(allocationService).not.toBe(mockAllocationService);
    process.env.NODE_ENV = 'test';
  });
});
