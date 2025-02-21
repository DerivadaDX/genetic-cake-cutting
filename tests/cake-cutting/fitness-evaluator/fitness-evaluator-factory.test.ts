import { FitnessEvaluator, FitnessEvaluatorFactory, IFitnessEvaluator } from '../../../src/cake-cutting/fitness-evaluator';

describe('FitnessEvaluatorFactory', () => {
  let mockEvaluator: IFitnessEvaluator;

  beforeEach(() => {
    mockEvaluator = {
      evaluate: jest.fn().mockReturnValue(0),
    };
  });

  afterEach(() => {
    FitnessEvaluatorFactory.setEvaluator(undefined as any);
  });

  test('returns an instance of FitnessEvaluator', () => {
    const evaluator = FitnessEvaluatorFactory.create();
    expect(evaluator).toBeInstanceOf(FitnessEvaluator);
  });

  test('allows evaluator injection in test mode', () => {
    FitnessEvaluatorFactory.setEvaluator(mockEvaluator);

    const evaluator = FitnessEvaluatorFactory.create();
    expect(evaluator).toBe(mockEvaluator);
  });

  test('does not allow evaluator injection outside test mode (development)', () => {
    process.env.NODE_ENV = 'development';
    FitnessEvaluatorFactory.setEvaluator(mockEvaluator);

    const evaluator = FitnessEvaluatorFactory.create();
    expect(evaluator).not.toBe(mockEvaluator);
    process.env.NODE_ENV = 'test';
  });

  test('does not allow evaluator injection outside test mode (production)', () => {
    process.env.NODE_ENV = 'production';
    FitnessEvaluatorFactory.setEvaluator(mockEvaluator);

    const evaluator = FitnessEvaluatorFactory.create();
    expect(evaluator).not.toBe(mockEvaluator);
    process.env.NODE_ENV = 'test';
  });
});
