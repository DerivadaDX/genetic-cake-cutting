import { HungarianAlgorithmSolver } from '../../src/cake-cutting/hungarian-algorithm-solver';

describe('HungarianAlgorithmSolver', () => {
  let solver: HungarianAlgorithmSolver;

  beforeEach(() => {
    solver = new HungarianAlgorithmSolver();
  });

  test('should solve 2x2 maximization problem', () => {
    const matrix = [
      [10, 5],
      [3, 8]
    ];
    const result = solver.solveMaximizationProblem(matrix);
    expect(result).toEqual([[0, 0], [1, 1]]); // [10, 8] assignment
  });

  test('should solve 3x3 maximization problem', () => {
    const matrix = [
      [80, 75, 100],
      [100, 80, 15],
      [25, 90, 10]
    ];
    const result = solver.solveMaximizationProblem(matrix);
    expect(result).toEqual([[0, 2], [1, 0], [2, 1]]); // [100, 90, 100] assignment
  });

  test('should handle matrix with negative values', () => {
    const matrix = [
      [-2, -5],
      [-3, -1]
    ];
    const result = solver.solveMaximizationProblem(matrix);
    expect(result).toEqual([[0, 0], [1, 1]]); // [-2, -1] assignment
  });

  test('should handle matrix with zeros', () => {
    const matrix = [
      [0, 0],
      [0, 0]
    ];
    const result = solver.solveMaximizationProblem(matrix);
    expect(result).toEqual([[0, 0], [1, 1]]); // Any assignment is optimal here
  });
});
