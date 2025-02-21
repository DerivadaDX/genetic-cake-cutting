import { ProblemInstance } from '../data-structures';
import { Individual } from '../individual';
import { Allocation } from './allocation';

export interface IAllocationSolver {
  solve(individual: Individual, problem: ProblemInstance): Allocation;
}
