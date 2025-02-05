import CakeCuttingGeneticAlgorithm from '../src/cake-cutting-genetic-algorithm';

describe('CakeCuttingGeneticAlgorithm', () => {
  // Test fixture setup
  const numberOfPlayers = 3;
  const numberOfAtoms = 7;
  const players = [
    { valuations: [0.2, 0, 0, 0.3, 0.5, 0, 0] },    // Player 1
    { valuations: [0, 0.4, 0.3, 0, 0, 0.3, 0] },    // Player 2
    { valuations: [0, 0, 0, 0, 0, 0.4, 0.6] }       // Player 3
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
        { valuations: [0.2, 0] }, // wrong length
        { valuations: [0, 0.4, 0.3, 0] },
        { valuations: [0, 0, 0] }
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

  describe('Piece Evaluation', () => {
    test('should correctly evaluate piece values for players', () => {
      // Create a known cut position and verify the piece values
      const testPiece: [number, number] = [0, 2]; // First two atoms
      const value = algorithm['evaluatePieceForPlayer'](testPiece, 0);

      // Player 1's valuation for first two atoms should be 0.2
      expect(value).toBe(0.2);
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
        { valuations: [1, 0, 0] },
        { valuations: [0, 1, 0] },
        { valuations: [0, 0, 1] }
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
        { valuations: [1, 0] },
        { valuations: [0, 1] }
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
        { valuations: [1] },
        { valuations: [0] }
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
