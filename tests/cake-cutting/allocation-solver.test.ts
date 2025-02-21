import { AllocationSolver } from '../../src/cake-cutting/allocation-solver';
import { Allocation, Atom, CutSet, PlayerValuations, ProblemInstance } from '../../src/cake-cutting/data-structures';
import { Individual } from '../../src/cake-cutting/individual';

describe('AllocationSolver', () => {
  test('should generate valid allocation from individual', () => {
    const playerValuations = [
      new PlayerValuations([new Atom(1, 0.3), new Atom(4, 0.7)]),
      new PlayerValuations([new Atom(2, 0.1), new Atom(3, 0.9)]),
    ];
    const problem = new ProblemInstance(playerValuations);
    const individual = new Individual(new CutSet([2], problem.numberOfAtoms));

    const solver = new AllocationSolver();
    const allocation = solver.solve(individual, problem);

    expect(allocation).toBeInstanceOf(Allocation);
    expect(allocation.pieces.length).toBe(playerValuations.length);
    expect(allocation.assignments.length).toBe(playerValuations.length);
    expect(new Set(allocation.assignments).size).toBe(playerValuations.length);
  });
});
