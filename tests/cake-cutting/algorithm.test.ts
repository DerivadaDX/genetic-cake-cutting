import { AlgorithmConfig, CakeCuttingGeneticAlgorithm } from '../../src/cake-cutting/algorithm';
import { CutSet, Piece, PlayerValuations, ProblemInstance } from '../../src/cake-cutting/data-structures';
import { Individual } from '../../src/cake-cutting/individual';

describe('CakeCuttingGeneticAlgorithm', () => {
  // Test fixture setup
  const playerValuations = [
    new PlayerValuations([0.2, 0, 0, 0.3, 0.5, 0, 0]), // Player 1
    new PlayerValuations([0, 0.4, 0.3, 0, 0, 0.3, 0]), // Player 2
    new PlayerValuations([0, 0, 0, 0, 0, 0.4, 0.6]), // Player 3
  ];
  const problem = new ProblemInstance(playerValuations);
  const numberOfAtoms = problem.calculateNumberOfAtoms();
  const numberOfPlayers = playerValuations.length;

  const algorithmConfig: AlgorithmConfig = {
    populationSize: 100,
    mutationRate: 0.1,
  };

  let algorithm: CakeCuttingGeneticAlgorithm;
  beforeEach(() => {
    algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);
  });

  describe('Constructor', () => {
    test('should create instance with correct parameters', () => {
      expect(algorithm).toBeInstanceOf(CakeCuttingGeneticAlgorithm);
    });

    test('should throw error if less than 2 players are provided', () => {
      const invalidProblem = new ProblemInstance([
        new PlayerValuations([0.5, 0, 0, 0, 0, 0.5, 0]), // only one player
      ]);

      expect(() => {
        new CakeCuttingGeneticAlgorithm(invalidProblem, algorithmConfig);
      }).toThrow('Must have at least 2 players');
    });

    test('should throw error if valuations length does not match numberOfAtoms', () => {
      const invalidProblem = new ProblemInstance([
        new PlayerValuations([0.5, 0.5]), // wrong length
        new PlayerValuations([0.25, 0.25, 0.25, 0.25]),
        new PlayerValuations([0.3, 0.3, 0.4]),
      ]);

      expect(() => {
        new CakeCuttingGeneticAlgorithm(invalidProblem, algorithmConfig);
      }).toThrow();
    });
  });

  describe('Evolution Process', () => {
    test('should improve fitness over generations', () => {
      const initialSolution = algorithm.evolve(1);
      const improvedSolution = algorithm.evolve(50);

      expect(improvedSolution.fitness).toBeGreaterThanOrEqual(initialSolution.fitness);
    });

    test('should maintain valid cut positions', () => {
      const solution = algorithm.evolve(10);
      const cuts = solution.chromosome;

      // Check if cuts are in ascending order
      for (let i = 1; i < cuts.length; i++) {
        expect(cuts[i]).toBeGreaterThanOrEqual(cuts[i - 1]);
      }

      // Check if cuts are within bounds
      cuts.forEach(cut => {
        expect(cut).toBeGreaterThanOrEqual(0);
        expect(cut).toBeLessThanOrEqual(numberOfAtoms);
      });
    });

    test('should generate correct number of cuts', () => {
      const solution = algorithm.evolve(10);
      expect(solution.chromosome.length).toBe(numberOfPlayers - 1);
    });
  });

  describe('Solution Evaluation', () => {
    test('should correctly evaluate cut allocation', () => {
      const cutSet = new CutSet([2, 4], numberOfAtoms);
      const individual = new Individual(cutSet);
      const allocation = algorithm.getAllocation(individual);

      // Verify pieces are correct
      expect(allocation.pieces).toEqual([
        new Piece(0, 2),
        new Piece(2, 4),
        new Piece(4, 7),
      ]);

      // Verify player 1's evaluations (0.2, 0.3, 0.5)
      expect(allocation.playerEvaluations[0][0]).toBe(0.2); // First piece
      expect(allocation.playerEvaluations[0][1]).toBe(0.3); // Second piece
      expect(allocation.playerEvaluations[0][2]).toBe(0.5); // Third piece

      // Verify player 2's evaluations (0.4, 0.3, 0.3)
      expect(allocation.playerEvaluations[1][0]).toBe(0.4); // First piece
      expect(allocation.playerEvaluations[1][1]).toBe(0.3); // Second piece
      expect(allocation.playerEvaluations[1][2]).toBe(0.3); // Third piece

      // Verify player 3's evaluations (0, 0, 1.0)
      expect(allocation.playerEvaluations[2][0]).toBe(0); // First piece
      expect(allocation.playerEvaluations[2][1]).toBe(0); // Second piece
      expect(allocation.playerEvaluations[2][2]).toBe(1.0); // Third piece
    });

    test('should handle edge case allocations', () => {
      const cutSet0 = new CutSet([0, 0], numberOfAtoms);
      const individual0 = new Individual(cutSet0);
      const allocation1 = algorithm.getAllocation(individual0);
      expect(allocation1.pieces).toEqual([
        new Piece(0, 0),
        new Piece(0, 0),
        new Piece(0, 7),
      ]);

      const cutSet7 = new CutSet([7, 7], numberOfAtoms);
      const individual7 = new Individual(cutSet7);
      const allocation2 = algorithm.getAllocation(individual7);
      expect(allocation2.pieces).toEqual([
        new Piece(0, 7),
        new Piece(7, 7),
        new Piece(7, 7),
      ]);
    });

    test('should correctly assign pieces in the example case', () => {
      const cutSet = new CutSet([2, 4], numberOfAtoms);
      const individual = new Individual(cutSet);
      const allocation = algorithm.getAllocation(individual);
      expect(allocation.assignments).toEqual([2, 0, 1]);
    });

    test('assignments should be unique and valid indices', () => {
      const cutSet = new CutSet([2, 4], numberOfAtoms);
      const individual = new Individual(cutSet);
      const allocation = algorithm.getAllocation(individual);

      const assignments = allocation.assignments;
      const uniqueAssignments = new Set(assignments);

      expect(uniqueAssignments.size).toBe(assignments.length);
      assignments.forEach(pieceIndex => {
        expect(pieceIndex).toBeGreaterThanOrEqual(0);
        expect(pieceIndex).toBeLessThan(numberOfPlayers);
      });
    });

    test('should handle tied preferences correctly', () => {
      // Set up a case where two players prefer the same piece
      const problem = new ProblemInstance([
        new PlayerValuations([0.5, 0.5, 0, 0]), // Prefers piece 0
        new PlayerValuations([0.6, 0.4, 0, 0]), // Prefers piece 0
        new PlayerValuations([0, 0, 0.3, 0.7]), // Prefers piece 3
      ]);
      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const cutSet = new CutSet([2, 3], 4);
      const individual = new Individual(cutSet);
      const allocation = algorithm.getAllocation(individual);

      // Player 0 gets piece 0, Player 1 gets next available
      expect(allocation.assignments[0]).toBe(0);
      expect(allocation.assignments[1]).toBe(1); // Order-based assignment
      expect(allocation.assignments[2]).toBe(2); // Only remaining piece
    });

    test('perfect division should assign optimal pieces', () => {
      const problem = new ProblemInstance([
        new PlayerValuations([1, 0, 0]),
        new PlayerValuations([0, 1, 0]),
        new PlayerValuations([0, 0, 1]),
      ]);

      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);
      const solution = algorithm.evolve(100);
      const allocation = algorithm.getAllocation(solution);

      // Each player should get their preferred piece
      expect(allocation.assignments).toEqual([0, 1, 2]);
    });

    test('should assign all pieces even with zero-value sections', () => {
      const problem = new ProblemInstance([
        new PlayerValuations([1, 0, 0]),
        new PlayerValuations([1, 0, 0]),
        new PlayerValuations([1, 0, 0]),
      ]);

      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);
      const cutSet = new CutSet([1, 2], 3);
      const individual = new Individual(cutSet);
      const allocation = algorithm.getAllocation(individual);

      // Verify that all pieces are assigned
      expect(new Set(allocation.assignments).size).toBe(3);
      expect(allocation.assignments).toEqual([0, 1, 2]); // Order-based assignment
    });
  });

  describe('Allocation Quality', () => {
    test('should produce reasonable allocations', () => {
      const solution = algorithm.evolve(100);
      expect(solution.fitness).toBeGreaterThan(-numberOfPlayers * (numberOfPlayers - 1));
    });

    test('should handle simple case with perfect division', () => {
      // Create a simple case where perfect division is possible
      const problem = new ProblemInstance([
        new PlayerValuations([1, 0, 0]),
        new PlayerValuations([0, 1, 0]),
        new PlayerValuations([0, 0, 1]),
      ]);

      const simpleAlgorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const solution = simpleAlgorithm.evolve(100);
      // In this case, a perfect solution should have fitness 0 (no envy)
      expect(solution.fitness).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum number of players (2)', () => {
      const smallProblem = new ProblemInstance([
        new PlayerValuations([1, 0]),
        new PlayerValuations([0, 1]),
      ]);

      const smallAlgorithm = new CakeCuttingGeneticAlgorithm(smallProblem, algorithmConfig);

      const solution = smallAlgorithm.evolve(10);
      expect(solution.chromosome.length).toBe(1); // Should only have one cut
    });

    test('should handle single atom valuations', () => {
      const singleAtomProblem = new ProblemInstance([
        new PlayerValuations([1]),
        new PlayerValuations([1]),
      ]);

      const singleAtomAlgorithm = new CakeCuttingGeneticAlgorithm(singleAtomProblem, algorithmConfig);

      const solution = singleAtomAlgorithm.evolve(10);
      expect(solution.chromosome.length).toBe(1);
      expect(solution.chromosome[0]).toBeLessThanOrEqual(1);
    });
  });
});
