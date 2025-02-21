import { AllocationSolver } from './allocation-solver';
import { IAllocationSolver } from './allocation-solver-interface';

export class AllocationSolverFactory {
  private static _solver: IAllocationSolver;

  public static create(): IAllocationSolver {
    const solver = this._solver ?? new AllocationSolver();
    return solver;
  }

  // Only available for testing
  public static setSolver(solver: IAllocationSolver): void {
    if (process.env.NODE_ENV === 'test') {
      this._solver = solver;
    }
  }
}
