import { AlgorithmConfig, CakeCuttingGeneticAlgorithm } from '../../src/cake-cutting/algorithm';
import { Atom, PlayerValuations, ProblemInstance } from '../../src/cake-cutting/data-structures';

describe('CakeCuttingGeneticAlgorithm', () => {
  const algorithmConfig: AlgorithmConfig = {
    populationSize: 100,
    mutationRate: 0.1,
  };

  describe('Constructor', () => {
    test('should create instance with exactly 1 player', () => {
      const validPlayerValuations = [new PlayerValuations([new Atom(1, 1)])];
      const validProblem = new ProblemInstance(validPlayerValuations);

      expect(() => {
        new CakeCuttingGeneticAlgorithm(validProblem, algorithmConfig);
      }).not.toThrow();
    });

    test('should create instance with more than 1 player', () => {
      const validPlayerValuations = [new PlayerValuations([new Atom(1, 1)]), new PlayerValuations([new Atom(2, 1)])];
      const validProblem = new ProblemInstance(validPlayerValuations);

      expect(() => {
        new CakeCuttingGeneticAlgorithm(validProblem, algorithmConfig);
      }).not.toThrow();
    });
  });
});
