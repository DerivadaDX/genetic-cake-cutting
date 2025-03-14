import { AllocationSolver, AllocationSolverFactory, IAllocationSolver } from '../../../src/cake-cutting/allocation';

describe('AllocationSolverFactory', () => {
  let mockAllocationSolver: IAllocationSolver;

  beforeEach(() => {
    mockAllocationSolver = {
      solve: jest.fn().mockReturnValue({}),
    };
  });

  afterEach(() => {
    AllocationSolverFactory.setSolver(undefined as any);
  });

  test('returns an instance of AllocationSolver', () => {
    const allocationSolver = AllocationSolverFactory.create();
    expect(allocationSolver).toBeInstanceOf(AllocationSolver);
  });

  test('allows allocationSolver injection in test mode', () => {
    AllocationSolverFactory.setSolver(mockAllocationSolver);

    const allocationSolver = AllocationSolverFactory.create();
    expect(allocationSolver).toBe(mockAllocationSolver);
  });

  test('does not allow allocationSolver injection outside test mode (development)', () => {
    process.env.NODE_ENV = 'development';
    AllocationSolverFactory.setSolver(mockAllocationSolver);

    const allocationSolver = AllocationSolverFactory.create();
    expect(allocationSolver).not.toBe(mockAllocationSolver);
    process.env.NODE_ENV = 'test';
  });

  test('does not allow allocationSolver injection outside test mode (production)', () => {
    process.env.NODE_ENV = 'production';
    AllocationSolverFactory.setSolver(mockAllocationSolver);

    const allocationSolver = AllocationSolverFactory.create();
    expect(allocationSolver).not.toBe(mockAllocationSolver);
    process.env.NODE_ENV = 'test';
  });
});
