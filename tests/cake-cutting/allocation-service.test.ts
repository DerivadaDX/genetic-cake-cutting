import { DefaultAllocationService, IAllocationService } from '../../src/cake-cutting/allocation-service';
import { Individual } from '../../src/cake-cutting/individual';
import { Atom, PlayerValuations, ProblemInstance, Allocation, CutSet } from '../../src/cake-cutting/data-structures';

describe('DefaultAllocationService', () => {
  let service: IAllocationService;

  beforeEach(() => {
    service = new DefaultAllocationService();
  });

  test('should generate valid allocation from individual', () => {
    const playerValuations = [
      new PlayerValuations([new Atom(1, 0.3), new Atom(4, 0.7)]),
      new PlayerValuations([new Atom(2, 0.1), new Atom(3, 0.9)]),
    ];
    const problem = new ProblemInstance(playerValuations);
    const individual = new Individual(new CutSet([2], problem.numberOfAtoms));

    const allocation = service.getAllocation(individual, problem);

    expect(allocation).toBeInstanceOf(Allocation);
    expect(allocation.pieces.length).toBe(playerValuations.length);
    expect(allocation.assignments.length).toBe(playerValuations.length);
    expect(new Set(allocation.assignments).size).toBe(playerValuations.length);
  });

  // ... add more tests from algorithm.test.ts getAllocation section
});
