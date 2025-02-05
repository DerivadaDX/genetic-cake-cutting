import CakeCuttingGeneticAlgorithm from '../src/cake-cutting-genetic-algorithm';
import Player from '../src/player';

describe('CakeCuttingGeneticAlgorithm', () => {
  // Test fixture setup
  const numberOfPlayers = 3;
  const numberOfAtoms = 7;
  const players = [
    new Player([0.2, 0, 0, 0.3, 0.5, 0, 0]),    // Player 1
    new Player([0, 0.4, 0.3, 0, 0, 0.3, 0]),    // Player 2
    new Player([0, 0, 0, 0, 0, 0.4, 0.6])       // Player 3
  ];

  let algorithm: CakeCuttingGeneticAlgorithm;

  beforeEach(() => {
    algorithm = new CakeCuttingGeneticAlgorithm(
      numberOfPlayers,
      numberOfAtoms,
      players,
      100, // populationSize
      0.1  // mutationRate
    );
  });

  describe('Constructor', () => {
    test('should create instance with correct parameters', () => {
      expect(algorithm).toBeInstanceOf(CakeCuttingGeneticAlgorithm);
    });

    test('should throw error if number of players does not match players array', () => {
      expect(() => {
        new CakeCuttingGeneticAlgorithm(
          4, // different number of players
          numberOfAtoms,
          players,
          100,
          0.1
        );
      }).toThrow();
    });

    test('should throw error if valuations length does not match numberOfAtoms', () => {
      const invalidPlayers = [
        new Player([0.5, 0.5]), // wrong length
        new Player([0.25, 0.25, 0.25, 0.25]),
        new Player([0.3, 0.3, 0.4])
      ];

      expect(() => {
        new CakeCuttingGeneticAlgorithm(
          3,
          numberOfAtoms,
          invalidPlayers,
          100,
          0.1
        );
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

      // Check if cuts are in ascending order
      for (let i = 1; i < solution.chromosome.length; i++) {
        expect(solution.chromosome[i]).toBeGreaterThanOrEqual(solution.chromosome[i - 1]);
      }

      // Check if cuts are within bounds
      solution.chromosome.forEach(cut => {
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
    test('should correctly evaluate a given cut solution', () => {
      const cuts = [2, 4]; // Creates three pieces: [0,2], [2,4], [4,7]
      const evaluation = algorithm.evaluateSolution(cuts);

      // Verify pieces are correct
      expect(evaluation.pieces).toEqual([[0, 2], [2, 4], [4, 7]]);

      // Verify player 1's evaluations (0.2, 0.3, 0.5)
      expect(evaluation.playerEvaluations[0][0]).toBe(0.2); // First piece
      expect(evaluation.playerEvaluations[0][1]).toBe(0.3); // Second piece
      expect(evaluation.playerEvaluations[0][2]).toBe(0.5); // Third piece

      // Verify player 2's evaluations (0.4, 0.3, 0.3)
      expect(evaluation.playerEvaluations[1][0]).toBe(0.4); // First piece
      expect(evaluation.playerEvaluations[1][1]).toBe(0.3); // Second piece
      expect(evaluation.playerEvaluations[1][2]).toBe(0.3); // Third piece

      // Verify player 3's evaluations (0, 0, 1.0)
      expect(evaluation.playerEvaluations[2][0]).toBe(0);   // First piece
      expect(evaluation.playerEvaluations[2][1]).toBe(0);   // Second piece
      expect(evaluation.playerEvaluations[2][2]).toBe(1.0); // Third piece
    });

    test('should evaluate edge case solutions', () => {
      // Test with all cuts at beginning
      const evaluation1 = algorithm.evaluateSolution([0, 0]);
      expect(evaluation1.pieces).toEqual([[0, 0], [0, 0], [0, 7]]);

      // Test with all cuts at end
      const evaluation2 = algorithm.evaluateSolution([7, 7]);
      expect(evaluation2.pieces).toEqual([[0, 7], [7, 7], [7, 7]]);
    });
  });

  describe('Solution Quality', () => {
    test('should produce reasonable solutions', () => {
      const solution = algorithm.evolve(100);

      // A reasonable solution should have a fitness better than random allocation
      // Since fitness is negative (penalties), it should be closer to 0
      expect(solution.fitness).toBeGreaterThan(-numberOfPlayers * (numberOfPlayers - 1));
    });

    test('should handle simple case with perfect division', () => {
      // Create a simple case where perfect division is possible
      const simplePlayers = [
        new Player([1, 0, 0]),
        new Player([0, 1, 0]),
        new Player([0, 0, 1])
      ];

      const simpleAlgorithm = new CakeCuttingGeneticAlgorithm(
        3,
        3,
        simplePlayers,
        100,
        0.1
      );

      const solution = simpleAlgorithm.evolve(100);
      // In this case, a perfect solution should have fitness 0 (no envy)
      expect(solution.fitness).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum number of players (2)', () => {
      const twoPlayers = [
        new Player([1, 0]),
        new Player([0, 1])
      ];

      const smallAlgorithm = new CakeCuttingGeneticAlgorithm(
        2,
        2,
        twoPlayers,
        100,
        0.1
      );

      const solution = smallAlgorithm.evolve(10);
      expect(solution.chromosome.length).toBe(1); // Should only have one cut
    });

    test('should handle single atom valuations', () => {
      const singleAtomPlayers = [
        new Player([1]),
        new Player([1])
      ];

      const singleAtomAlgorithm = new CakeCuttingGeneticAlgorithm(
        2,
        1,
        singleAtomPlayers,
        100,
        0.1
      );

      const solution = singleAtomAlgorithm.evolve(10);
      expect(solution.chromosome.length).toBe(1);
      expect(solution.chromosome[0]).toBeLessThanOrEqual(1);
    });
  });
});
