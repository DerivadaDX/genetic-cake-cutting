import { Atom } from '../../../src/cake-cutting/data-structures/atom';
import { PlayerValuations } from '../../../src/cake-cutting/data-structures/player-valuations';
import { ProblemInstance } from '../../../src/cake-cutting/data-structures/problem-instance';

describe('ProblemInstance', () => {
  describe('constructor', () => {
    it('should throw error when there are no player valuations', () => {
      const playerValuations: PlayerValuations[] = [];
      expect(() => new ProblemInstance(playerValuations)).toThrow('Player valuations array cannot be empty');
    });

    it('should throw error when there are duplicate atom positions across players', () => {
      const playerValuations = [
        new PlayerValuations([new Atom(1, 0.3), new Atom(2, 0.7)]),
        new PlayerValuations([new Atom(2, 0.4), new Atom(3, 0.6)]),
      ];

      expect(() => new ProblemInstance(playerValuations)).toThrow('Atom positions must be unique across all players');
    });

    it('should calculate number of atoms based on highest position', () => {
      const playerValuations = [
        new PlayerValuations([new Atom(1, 0.3), new Atom(2, 0.7)]),
        new PlayerValuations([new Atom(3, 0.4), new Atom(4, 0.6)]),
      ];

      const problemInstance = new ProblemInstance(playerValuations);
      expect(problemInstance.numberOfAtoms).toBe(4);
    });
  });
});
