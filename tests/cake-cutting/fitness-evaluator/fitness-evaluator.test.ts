import { FitnessEvaluator } from '../../../src/cake-cutting/fitness-evaluator';
import { Individual } from '../../../src/cake-cutting/individual';
import { ProblemInstance, PlayerValuations, Atom, CutSet } from '../../../src/cake-cutting/data-structures';

describe('FitnessEvaluator', () => {
  let fitnessEvaluator: FitnessEvaluator;

  beforeEach(() => {
    fitnessEvaluator = new FitnessEvaluator();
  });

  describe('evaluate', () => {
    it('should correctly evaluate a simple two-player case', () => {
      const individual = new Individual(new CutSet([5], 10));
      const playerValuations = [
        new PlayerValuations([
          new Atom(1, 0.2),
          new Atom(2, 0.2),
          new Atom(3, 0.2),
          new Atom(4, 0.2),
          new Atom(5, 0.2),
        ]),
        new PlayerValuations([
          new Atom(6, 0.2),
          new Atom(7, 0.2),
          new Atom(8, 0.2),
          new Atom(9, 0.2),
          new Atom(10, 0.2),
        ]),
      ];
      const problem = new ProblemInstance(playerValuations);

      const fitness = fitnessEvaluator.evaluate(problem, individual);

      expect(fitness).toBe(2); // Both players get their preferred half
    });

    it('should handle uneven valuations', () => {
      const individual = new Individual(new CutSet([3, 7], 10));
      const playerValuations = [
        new PlayerValuations([new Atom(1, 0.4), new Atom(2, 0.4), new Atom(3, 0.2)]),
        new PlayerValuations([new Atom(4, 0.25), new Atom(5, 0.25), new Atom(6, 0.25), new Atom(7, 0.25)]),
        new PlayerValuations([new Atom(8, 0.33), new Atom(9, 0.33), new Atom(10, 0.34)]),
      ];
      const problem = new ProblemInstance(playerValuations);

      const fitness = fitnessEvaluator.evaluate(problem, individual);

      expect(fitness).toBe(3); // Each player gets their most valued section
    });
  });
});
