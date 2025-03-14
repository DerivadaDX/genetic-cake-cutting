import { Assignment, HungarianAlgorithmSolver } from '../../../src/cake-cutting/hungarian-algorithm';

describe('HungarianAlgorithmSolver', () => {
  let solver: HungarianAlgorithmSolver;

  beforeEach(() => {
    solver = new HungarianAlgorithmSolver();
  });

  describe('solveMaximizationProblem', () => {
    test('should solve 2x2 maximization problem', () => {
      const matrix = [
        [0.7, 0.3],
        [0.4, 0.6],
      ];
      const result: Assignment[] = solver.solveMaximizationProblem(matrix);
      expect(result).toEqual([
        { player: 0, portion: 0 },
        { player: 1, portion: 1 },
      ]);
    });

    test('should solve 3x3 maximization problem', () => {
      const matrix = [
        [0.3, 0.2, 0.5],
        [0.5, 0.3, 0.2],
        [0.2, 0.5, 0.3],
      ];
      const result: Assignment[] = solver.solveMaximizationProblem(matrix);
      expect(result).toEqual([
        { player: 0, portion: 2 },
        { player: 1, portion: 0 },
        { player: 2, portion: 1 },
      ]);
    });

    test('should solve 4x4 maximization problem', () => {
      const matrix = [
        [0.4, 0.2, 0.1, 0.3],
        [0.1, 0.3, 0.3, 0.3],
        [0.3, 0.3, 0.2, 0.2],
        [0.2, 0.2, 0.4, 0.2],
      ];
      const result: Assignment[] = solver.solveMaximizationProblem(matrix);
      expect(result).toEqual([
        { player: 0, portion: 0 },
        { player: 1, portion: 3 },
        { player: 2, portion: 1 },
        { player: 3, portion: 2 },
      ]);
    });
  });
});
