import { ProblemInstance } from '../data-structures';
import { Individual } from '../individual';
import { IFitnessEvaluator } from './fitness-evaluator-interface';

export class FitnessEvaluator implements IFitnessEvaluator {
  public evaluate(problem: ProblemInstance, individual: Individual): number {
    return 0;
  }
}
