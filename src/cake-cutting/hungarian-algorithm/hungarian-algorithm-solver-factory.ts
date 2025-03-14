import { HungarianAlgorithmSolver } from './hungarian-algorithm-solver';
import { IHungarianAlgorithmSolver } from './hungarian-algorithm-solver-interface';

export class HungarianAlgorithmSolverFactory {
  private static _solver: IHungarianAlgorithmSolver;

  public static create(): IHungarianAlgorithmSolver {
    const solver = this._solver ?? new HungarianAlgorithmSolver();
    return solver;
  }

  // Only available for testing
  public static setSolver(solver: IHungarianAlgorithmSolver): void {
    if (process.env.NODE_ENV === 'test') {
      this._solver = solver;
    }
  }
}
