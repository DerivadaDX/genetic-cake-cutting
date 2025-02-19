import { ProblemInstance } from '../../../src/cake-cutting/data-structures/problem-instance';
import { PlayerValuations } from '../../../src/cake-cutting/data-structures/player-valuations';
import { Atom } from '../../../src/cake-cutting/data-structures/atom';

describe('ProblemInstance', () => {
  it('should calculate the correct number of atoms', () => {
    const playerValuations: PlayerValuations[] = [
      new PlayerValuations([new Atom(1, 0.1), new Atom(2, 0.2), new Atom(3, 0.3), new Atom(4, 0.4)]),
      new PlayerValuations([new Atom(1, 0.2), new Atom(2, 0.8)]),
      new PlayerValuations([new Atom(1, 1.0)]),
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
