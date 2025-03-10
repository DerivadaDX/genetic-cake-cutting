import { CakeCuttingGeneticAlgorithm } from '../../src/cake-cutting/algorithm';
import { AlgorithmConfig } from '../../src/cake-cutting/algorithm-config';
import { Allocation } from '../../src/cake-cutting/allocation';
import { Atom, PlayerValuations, ProblemInstance } from '../../src/cake-cutting/data-structures';

describe('CakeCuttingGeneticAlgorithm', () => {
  const algorithmConfig = new AlgorithmConfig(100, 0.1);

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
  });

  describe('evolve', () => {
    const playerValuations = [
      new PlayerValuations([new Atom(1, 0.3), new Atom(4, 0.7)]),
      new PlayerValuations([new Atom(2, 0.1), new Atom(3, 0.9)]),
    ];
    const problem = new ProblemInstance(playerValuations);

    test('should evolve for specified number of generations and return valid allocation', () => {
      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const allocation: Allocation = algorithm.evolve(10);

      expect(allocation).toBeInstanceOf(Allocation);
      expect(allocation.pieces.length).toBe(playerValuations.length);
      expect(allocation.assignments.length).toBe(playerValuations.length);
    });

    test('should maintain piece continuity in allocation', () => {
      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const allocation: Allocation = algorithm.evolve(5);

      expect(allocation.pieces[0].start).toBe(0);
      expect(allocation.pieces[1].start).toBe(allocation.pieces[0].end);
      expect(allocation.pieces[1].end).toBe(problem.numberOfAtoms);
    });

    test('should handle single atom case', () => {
      const playerValuations = [new PlayerValuations([new Atom(1, 1)])];
      const problem = new ProblemInstance(playerValuations);
      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const allocation: Allocation = algorithm.evolve(5);

      expect(allocation.assignments[0]).toBe(0); // First player gets the only piece
      expect(allocation.pieces.length).toBe(1);
      expect(allocation.assignments.length).toBe(1);
    });

    test('should handle equal valuations case', () => {
      const playerValuations = [new PlayerValuations([new Atom(1, 1)]), new PlayerValuations([new Atom(2, 1)])];
      const problem = new ProblemInstance(playerValuations);
      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const allocation: Allocation = algorithm.evolve(5);

      expect(allocation.pieces.length).toBe(2);
      expect(allocation.assignments.length).toBe(2);
      expect(new Set(allocation.assignments).size).toBe(2);
    });
  });
});
