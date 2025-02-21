import { AlgorithmConfig, CakeCuttingGeneticAlgorithm } from '../../src/cake-cutting/algorithm';
import { Atom, PlayerValuations, ProblemInstance, Allocation } from '../../src/cake-cutting/data-structures';

describe('CakeCuttingGeneticAlgorithm', () => {
  const algorithmConfig: AlgorithmConfig = {
    populationSize: 100,
    mutationRate: 0.1,
  };

  describe('constructor', () => {
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

    test('should throw error with invalid config values', () => {
      const validPlayerValuations = [new PlayerValuations([new Atom(1, 1)])];
      const validProblem = new ProblemInstance(validPlayerValuations);

      const invalidConfig: AlgorithmConfig = {
        populationSize: -1,
        mutationRate: 1.5,
      };

      expect(() => {
        new CakeCuttingGeneticAlgorithm(validProblem, invalidConfig);
      }).toThrow('Invalid algorithm configuration values');
    });
  });

  describe('evolve', () => {
    const playerValuations = [
      new PlayerValuations([new Atom(1, 0.3), new Atom(4, 0.7)]),
      new PlayerValuations([new Atom(2, 0.1), new Atom(3, 0.9)]),
    ];
    const problem = new ProblemInstance(playerValuations);

    test('should evolve for specified number of generations', () => {
      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const result = algorithm.evolve(10);
      expect(result).toBeDefined();
      expect(result.fitness).toBeGreaterThanOrEqual(0);
    });

    test('fitness should not decrease over generations', () => {
      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const resultGen1 = algorithm.evolve(1);
      const resultGen10 = algorithm.evolve(10);

      expect(resultGen10.fitness).toBeGreaterThanOrEqual(resultGen1.fitness);
    });
  });

  describe('getAllocation', () => {
    const playerValuations = [
      new PlayerValuations([new Atom(1, 0.3), new Atom(4, 0.7)]),
      new PlayerValuations([new Atom(2, 0.1), new Atom(3, 0.9)]),
    ];
    const problem = new ProblemInstance(playerValuations);

    test('should generate valid allocation from individual', () => {
      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const individual = algorithm.evolve(5);
      const allocation = algorithm.getAllocation(individual);

      expect(allocation).toBeInstanceOf(Allocation);
      expect(allocation.pieces.length).toBe(playerValuations.length);
      expect(allocation.assignments.length).toBe(playerValuations.length);

      // Check that all pieces are assigned
      const assignedPieces = new Set(allocation.assignments);
      expect(assignedPieces.size).toBe(playerValuations.length);
    });

    test('should maintain piece continuity in allocation', () => {
      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const individual = algorithm.evolve(5);
      const allocation = algorithm.getAllocation(individual);

      // Check that pieces are continuous
      for (let i = 0; i < allocation.pieces.length - 1; i++) {
        expect(allocation.pieces[i].end).toBe(allocation.pieces[i + 1].start);
      }

      // Check that first piece starts at 0 and last piece ends at numberOfAtoms
      expect(allocation.pieces[0].start).toBe(0);
      expect(allocation.pieces[allocation.pieces.length - 1].end).toBe(problem.numberOfAtoms);
    });

    test('should handle single atom case', () => {
      const playerValuations = [new PlayerValuations([new Atom(1, 1)])];
      const problem = new ProblemInstance(playerValuations);
      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const individual = algorithm.evolve(5);
      const allocation = algorithm.getAllocation(individual);

      expect(allocation.pieces.length).toBe(1);
      expect(allocation.assignments.length).toBe(1);
    });

    test('should handle equal valuations case', () => {
      const playerValuations = [new PlayerValuations([new Atom(1, 1)]), new PlayerValuations([new Atom(2, 1)])];
      const problem = new ProblemInstance(playerValuations);
      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const individual = algorithm.evolve(5);
      const allocation = algorithm.getAllocation(individual);

      // Even with equal valuations, we should still get a valid allocation
      expect(allocation.pieces.length).toBe(2);
      expect(allocation.assignments.length).toBe(2);
      expect(new Set(allocation.assignments).size).toBe(2);
    });
  });
});
