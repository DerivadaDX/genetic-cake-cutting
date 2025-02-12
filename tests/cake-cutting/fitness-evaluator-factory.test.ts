import { FitnessEvaluatorFactory } from '../../src/cake-cutting/fitness-evaluator-factory';
import { FitnessEvaluator, IFitnessEvaluator } from '../../src/cake-cutting/fitness-evaluator';
import { PlayerValuations } from '../../src/cake-cutting/data-structures';

describe('FitnessEvaluatorFactory', () => {
  const players: PlayerValuations[] = [new PlayerValuations([0.3, 0.7]), new PlayerValuations([0.6, 0.4])];

  test('returns an instance of FitnessEvaluator', () => {
    const evaluator = FitnessEvaluatorFactory.create(players);
    expect(evaluator).toBeInstanceOf(FitnessEvaluator);
  });

  test('allows evaluator injection in test mode', () => {
    const mockEvaluator = new FitnessEvaluator(players);
    FitnessEvaluatorFactory.setEvaluator(mockEvaluator);

    const evaluator = FitnessEvaluatorFactory.create(players);
    expect(evaluator).toBe(mockEvaluator);
  });

  test('does not allow evaluator injection outside test mode (development)', () => {
    process.env.NODE_ENV = 'development';
    const mockEvaluator = new FitnessEvaluator(players);
    FitnessEvaluatorFactory.setEvaluator(mockEvaluator);

    const evaluator = FitnessEvaluatorFactory.create(players);
    expect(evaluator).not.toBe(mockEvaluator);
  });

  test('does not allow evaluator injection outside test mode (production)', () => {
    process.env.NODE_ENV = 'production';
    const mockEvaluator = new FitnessEvaluator(players);
    FitnessEvaluatorFactory.setEvaluator(mockEvaluator);

    const evaluator = FitnessEvaluatorFactory.create(players);
    expect(evaluator).not.toBe(mockEvaluator);
  });
});
