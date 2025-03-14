import { Atom } from '../../../src/cake-cutting/data-structures/atom';
import { Piece } from '../../../src/cake-cutting/data-structures/piece';
import { PlayerValuations } from '../../../src/cake-cutting/data-structures/player-valuations';

describe('PlayerValuations', () => {
  describe('constructor', () => {
    it('should throw error when valuations do not sum to 1', () => {
      const atoms = [new Atom(1, 0.3), new Atom(2, 0.3), new Atom(3, 0.3)];
      expect(() => new PlayerValuations(atoms)).toThrow('Valuations must sum exactly to 1');
    });

    it('should throw error when atom positions are not unique', () => {
      const atoms = [new Atom(1, 0.5), new Atom(1, 0.2), new Atom(3, 0.3)];
      expect(() => new PlayerValuations(atoms)).toThrow('Atom positions must be unique');
    });

    it('should create valid player valuations', () => {
      const atoms = [new Atom(1, 0.5), new Atom(2, 0.3), new Atom(4, 0.2)];
      const playerValuations = new PlayerValuations(atoms);
      expect(playerValuations.numberOfValuations).toBe(3);
      expect(playerValuations.valuations).toEqual(atoms);
    });
  });

  describe('getValuationAt', () => {
    const atoms = [new Atom(1, 0.2), new Atom(3, 0.5), new Atom(5, 0.3)];
    const valuations = new PlayerValuations(atoms);

    it('should throw error when position does not exist', () => {
      expect(() => valuations.getValuationAt(2)).toThrow('No valuation found at position');
    });

    it('should return correct valuation at existing position', () => {
      expect(valuations.getValuationAt(3)).toBe(0.5);
    });
  });

  describe('getValuationForPiece', () => {
    const atoms = [new Atom(1, 0.2), new Atom(3, 0.5), new Atom(5, 0.3)];
    const valuations = new PlayerValuations(atoms);

    it('should calculate valuation for piece containing some atoms', () => {
      const piece = new Piece(2, 4);
      expect(valuations.getValuationForPiece(piece)).toBe(0.5);
    });

    it('should return 0 for piece with no atoms in range', () => {
      const piece = new Piece(7, 9);
      expect(valuations.getValuationForPiece(piece)).toBe(0);
    });

    it('should return 0 for empty piece', () => {
      const piece = new Piece(2, 2);
      expect(valuations.getValuationForPiece(piece)).toBe(0);
    });

    it('should exclude start and include end position atoms', () => {
      const piece = new Piece(3, 5);
      // atom at position 3 (0.5) should be excluded
      // atom at position 5 (0.3) should be included
      expect(valuations.getValuationForPiece(piece)).toBe(0.3);
    });
  });
});
