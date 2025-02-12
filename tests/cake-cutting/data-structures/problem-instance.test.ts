import { ProblemInstance } from '../../../src/cake-cutting/data-structures/problem-instance';
import { PlayerValuations } from '../../../src/cake-cutting/data-structures/player-valuations';

describe('ProblemInstance', () => {
  it('should calculate the correct number of atoms', () => {
    const playerValuations: PlayerValuations[] = [
      new PlayerValuations([0.1, 0.2, 0.3, 0.4]), // 4 atoms
      new PlayerValuations([0.2, 0.8]), // 2 atoms
      new PlayerValuations([1]), // 1 atom
    ];

    const problemInstance = new ProblemInstance(playerValuations);
    const numberOfAtoms = problemInstance.calculateNumberOfAtoms();

    expect(numberOfAtoms).toBe(7);
  });

  it('should return 0 if there are no player valuations', () => {
    const playerValuations: PlayerValuations[] = [];

    const problemInstance = new ProblemInstance(playerValuations);
    const numberOfAtoms = problemInstance.calculateNumberOfAtoms();

    expect(numberOfAtoms).toBe(0);
  });
});
