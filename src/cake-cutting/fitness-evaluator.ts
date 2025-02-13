import { Individual } from './individual';
import { ProblemInstance } from './data-structures';

export interface IFitnessEvaluator {
  evaluate(problem: ProblemInstance, individual: Individual): number;
}

export class FitnessEvaluator implements IFitnessEvaluator {
  public evaluate(problem: ProblemInstance, individual: Individual): number {
    return 0;
  }
}
