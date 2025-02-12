import { AlgorithmConfig, CakeCuttingGeneticAlgorithm } from '../../src/cake-cutting/algorithm';
import { PlayerValuations } from '../../src/cake-cutting/player-valuations';
import { ProblemInstance } from '../../src/cake-cutting/problem-instance';
import { IRandomGenerator } from '../../src/random-generator';
import { RandomGeneratorFactory } from '../../src/random-generator-factory';

describe('CakeCuttingGeneticAlgorithm', () => {
  // Test fixture setup
  const playerValuations = [
    new PlayerValuations([0.2, 0, 0, 0.3, 0.5, 0, 0]), // Player 1
    new PlayerValuations([0, 0.4, 0.3, 0, 0, 0.3, 0]), // Player 2
    new PlayerValuations([0, 0, 0, 0, 0, 0.4, 0.6]), // Player 3
  ];
  const numberOfAtoms = playerValuations[0].valuations.length;
  const numberOfPlayers = playerValuations.length;

  const problem: ProblemInstance = { playerValuations };
  const algorithmConfig: AlgorithmConfig = {
    populationSize: 100,
    mutationRate: 0.1,
  };

  let algorithm: CakeCuttingGeneticAlgorithm;
  let mockRandom: jest.Mocked<IRandomGenerator>;

  beforeEach(() => {
    mockRandom = { next: jest.fn() };
    RandomGeneratorFactory.setGenerator(mockRandom);
    algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);
  });

  afterEach(() => {
    RandomGeneratorFactory.setGenerator(undefined as any);
  });

  describe('Constructor', () => {
    test('should create instance with correct parameters', () => {
      expect(algorithm).toBeInstanceOf(CakeCuttingGeneticAlgorithm);
    });

    test('should throw error if less than 2 players are provided', () => {
      const invalidProblem: ProblemInstance = {
        playerValuations: [new PlayerValuations([0.5, 0, 0, 0, 0, 0.5, 0])], // only one player
      };

      expect(() => {
        new CakeCuttingGeneticAlgorithm(invalidProblem, algorithmConfig);
      }).toThrow('Must have at least 2 players');
    });

    test('should throw error if valuations length does not match numberOfAtoms', () => {
      const invalidProblem: ProblemInstance = {
        playerValuations: [
          new PlayerValuations([0.5, 0.5]), // wrong length
          new PlayerValuations([0.25, 0.25, 0.25, 0.25]),
          new PlayerValuations([0.3, 0.3, 0.4]),
        ],
      };

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
      expect(evaluation.pieces).toEqual([
        [0, 2],
        [2, 4],
        [4, 7],
      ]);

      // Verify player 1's evaluations (0.2, 0.3, 0.5)
      expect(evaluation.playerEvaluations[0][0]).toBe(0.2); // First piece
      expect(evaluation.playerEvaluations[0][1]).toBe(0.3); // Second piece
      expect(evaluation.playerEvaluations[0][2]).toBe(0.5); // Third piece

      // Verify player 2's evaluations (0.4, 0.3, 0.3)
      expect(evaluation.playerEvaluations[1][0]).toBe(0.4); // First piece (0 + 0.4)
      expect(evaluation.playerEvaluations[1][1]).toBe(0.3); // Second piece (0.3 + 0)
      expect(evaluation.playerEvaluations[1][2]).toBe(0.3); // Third piece (0 + 0.3 + 0)

      // Verify player 3's evaluations (0, 0, 1.0)
      expect(evaluation.playerEvaluations[2][0]).toBe(0); // First piece
      expect(evaluation.playerEvaluations[2][1]).toBe(0); // Second piece
      expect(evaluation.playerEvaluations[2][2]).toBe(1.0); // Third piece
    });

    test('should evaluate edge case solutions', () => {
      // Test with all cuts at beginning
      const evaluation1 = algorithm.evaluateSolution([0, 0]);
      expect(evaluation1.pieces).toEqual([
        [0, 0],
        [0, 0],
        [0, 7],
      ]);

      // Test with all cuts at end
      const evaluation2 = algorithm.evaluateSolution([7, 7]);
      expect(evaluation2.pieces).toEqual([
        [0, 7],
        [7, 7],
        [7, 7],
      ]);
    });

    // Agregar dentro del bloque 'describe('Solution Evaluation', () => { ... })'

    test('should correctly assign pieces in the example case', () => {
      const cuts = [2, 4];
      const evaluation = algorithm.evaluateSolution(cuts);

      // Verificar asignaciones esperadas: [2, 0, 1]
      expect(evaluation.assignments).toEqual([2, 0, 1]);
    });

    test('assignments should be unique and valid indices', () => {
      const cuts = [2, 4];
      const evaluation = algorithm.evaluateSolution(cuts);

      const assignments = evaluation.assignments;
      const uniqueAssignments = new Set(assignments);

      // Todas las asignaciones deben ser únicas
      expect(uniqueAssignments.size).toBe(assignments.length);

      // Cada asignación debe ser un índice válido de pieza
      assignments.forEach(pieceIndex => {
        expect(pieceIndex).toBeGreaterThanOrEqual(0);
        expect(pieceIndex).toBeLessThan(numberOfPlayers);
      });
    });

    test('should handle tied preferences correctly', () => {
      // Configurar un caso donde dos jugadores prefieren la misma pieza
      const problem: ProblemInstance = {
        playerValuations: [
          new PlayerValuations([0.5, 0.5, 0, 0]), // Prefiere pieza 0
          new PlayerValuations([0.6, 0.4, 0, 0]), // Prefiere pieza 0
          new PlayerValuations([0, 0, 0.3, 0.7]), // Prefiere pieza 3
        ],
      };
      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const cuts = [2, 3];
      const evaluation = algorithm.evaluateSolution(cuts);

      // Jugador 0 obtiene pieza 0, Jugador 1 obtiene siguiente disponible
      expect(evaluation.assignments[0]).toBe(0);
      expect(evaluation.assignments[1]).toBe(1); // Asignación por orden
      expect(evaluation.assignments[2]).toBe(2); // Única pieza restante
    });

    // Agregar dentro del bloque 'describe('Solution Quality', () => { ... })'

    test('perfect division should assign optimal pieces', () => {
      const problem: ProblemInstance = {
        playerValuations: [
          new PlayerValuations([1, 0, 0]),
          new PlayerValuations([0, 1, 0]),
          new PlayerValuations([0, 0, 1]),
        ],
      };

      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);
      const solution = algorithm.evolve(100);
      const evaluation = algorithm.evaluateSolution(solution.chromosome);

      // Cada jugador debe obtener su pieza preferida
      expect(evaluation.assignments).toEqual([0, 1, 2]);
    });

    test('should assign all pieces even with zero-value sections', () => {
      const problem: ProblemInstance = {
        playerValuations: [
          new PlayerValuations([1, 0, 0]),
          new PlayerValuations([1, 0, 0]),
          new PlayerValuations([1, 0, 0]),
        ],
      };

      const algorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);
      const cuts = [1, 2];
      const evaluation = algorithm.evaluateSolution(cuts);

      // Verificar que todas las piezas están asignadas
      expect(new Set(evaluation.assignments).size).toBe(3);
      expect(evaluation.assignments).toEqual([0, 1, 2]); // Asignación por orden
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
      const problem: ProblemInstance = {
        playerValuations: [
          new PlayerValuations([1, 0, 0]),
          new PlayerValuations([0, 1, 0]),
          new PlayerValuations([0, 0, 1]),
        ],
      };

      const simpleAlgorithm = new CakeCuttingGeneticAlgorithm(problem, algorithmConfig);

      const solution = simpleAlgorithm.evolve(100);
      // In this case, a perfect solution should have fitness 0 (no envy)
      expect(solution.fitness).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    test('should handle minimum number of players (2)', () => {
      const smallProblem: ProblemInstance = {
        playerValuations: [new PlayerValuations([1, 0]), new PlayerValuations([0, 1])],
      };

      const smallAlgorithm = new CakeCuttingGeneticAlgorithm(smallProblem, algorithmConfig);

      const solution = smallAlgorithm.evolve(10);
      expect(solution.chromosome.length).toBe(1); // Should only have one cut
    });

    test('should handle single atom valuations', () => {
      const singleAtomProblem: ProblemInstance = {
        playerValuations: [new PlayerValuations([1]), new PlayerValuations([1])],
      };

      const singleAtomAlgorithm = new CakeCuttingGeneticAlgorithm(singleAtomProblem, algorithmConfig);

      const solution = singleAtomAlgorithm.evolve(10);
      expect(solution.chromosome.length).toBe(1);
      expect(solution.chromosome[0]).toBeLessThanOrEqual(1);
    });
  });
});
