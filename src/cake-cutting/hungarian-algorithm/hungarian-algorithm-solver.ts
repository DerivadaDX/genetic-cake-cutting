import { Assignment } from './assignment';
import { IHungarianAlgorithmSolver } from './hungarian-algorithm-solver-interface';

const munkres = require('munkres-js') as any;

export class HungarianAlgorithmSolver implements IHungarianAlgorithmSolver {
  solveMaximizationProblem(matrix: number[][]): Assignment[] {
    // Find the maximum value in the matrix
    const maxValue = Math.max(...matrix.map(row => Math.max(...row)));

    // Create a new matrix where each element is the maximum minus the original value
    // This transforms the maximization problem into a minimization one
    const minimizationMatrix = matrix.map(row => row.map(value => maxValue - value));

    // Solve the minimization problem
    const result = munkres(minimizationMatrix);

    // Transform the result into Assignment objects
    const assignments = result.map(([player, portion]: number[]) => ({ player, portion }));
    return assignments;
  }
}
