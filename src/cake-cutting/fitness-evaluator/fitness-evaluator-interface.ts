import { ProblemInstance } from '../data-structures';
import { Individual } from '../individual';

export interface IFitnessEvaluator {
  evaluate(problem: ProblemInstance, individual: Individual): number;
}
