import {
  HungarianAlgorithmSolver,
  HungarianAlgorithmSolverFactory,
} from '../../../src/cake-cutting/hungarian-algorithm';

describe('HungarianAlgorithmSolverFactory', () => {
  afterEach(() => {
    HungarianAlgorithmSolverFactory.setSolver(undefined as any);
  });

  test('returns an instance of HungarianAlgorithmSolver', () => {
    const hungarianSolver = HungarianAlgorithmSolverFactory.create();
    expect(hungarianSolver).toBeInstanceOf(HungarianAlgorithmSolver);
  });

  test('allows solver injection in test mode', () => {
    const mockHungarianSolver = new HungarianAlgorithmSolver();
    HungarianAlgorithmSolverFactory.setSolver(mockHungarianSolver);

    const hungarianSolver = HungarianAlgorithmSolverFactory.create();
    expect(hungarianSolver).toBe(mockHungarianSolver);
  });

  test('does not allow solver injection outside test mode (development)', () => {
    process.env.NODE_ENV = 'development';
    const mockHungarianSolver = new HungarianAlgorithmSolver();
    HungarianAlgorithmSolverFactory.setSolver(mockHungarianSolver);

    const hungarianSolver = HungarianAlgorithmSolverFactory.create();
    expect(hungarianSolver).not.toBe(mockHungarianSolver);
    process.env.NODE_ENV = 'test';
  });

  test('does not allow solver injection outside test mode (production)', () => {
    process.env.NODE_ENV = 'production';
    const mockHungarianSolver = new HungarianAlgorithmSolver();
    HungarianAlgorithmSolverFactory.setSolver(mockHungarianSolver);

    const hungarianSolver = HungarianAlgorithmSolverFactory.create();
    expect(hungarianSolver).not.toBe(mockHungarianSolver);
    process.env.NODE_ENV = 'test';
  });
});
