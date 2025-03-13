const munkres = require('munkres-js') as any;

export class HungarianAlgorithmSolver {
  solveMaximizationProblem(matrix: number[][]): number[][] {
    // Find the maximum value in the matrix
    const maxValue = Math.max(...matrix.map(row => Math.max(...row)));

    // Create a new matrix where each element is the maximum minus the original value
    // This transforms the maximization problem into a minimization one
    const minimizationMatrix = matrix.map(row => row.map(value => maxValue - value));

    // Solve the minimization problem
    const result = munkres(minimizationMatrix);
    return result;
  }
}
