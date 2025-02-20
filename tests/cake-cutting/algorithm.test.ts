import { AlgorithmConfig, CakeCuttingGeneticAlgorithm } from '../../src/cake-cutting/algorithm';
import { Atom, PlayerValuations, ProblemInstance } from '../../src/cake-cutting/data-structures';

describe('CakeCuttingGeneticAlgorithm', () => {
  const playerValuations = [
    new PlayerValuations([new Atom(1, 1), new Atom(2, 0)]),
    new PlayerValuations([new Atom(3, 0), new Atom(4, 1)]),
    new PlayerValuations([new Atom(5, 0.4), new Atom(6, 0.6)]),
  ];

  const problem = new ProblemInstance(playerValuations);
  const algorithmConfig: AlgorithmConfig = {
    populationSize: 100,
    mutationRate: 0.1,
  };

  let algorithm: CakeCuttingGeneticAlgorithm;
  beforeEach(() => {
    algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);
  });

  describe('Constructor', () => {
    test('should throw error if less than 2 players are provided', () => {
      const invalidProblem = new ProblemInstance([new PlayerValuations([new Atom(1, 1)])]);

      expect(() => {
        new CakeCuttingGeneticAlgorithm(invalidProblem, algorithmConfig);
      }).toThrow('Must have at least 2 players');
    });
  });
});
