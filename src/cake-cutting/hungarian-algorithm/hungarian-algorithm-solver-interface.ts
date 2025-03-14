import { Assignment } from './assignment';

export interface IHungarianAlgorithmSolver {
  solveMaximizationProblem(costs: number[][]): Assignment[];
}
