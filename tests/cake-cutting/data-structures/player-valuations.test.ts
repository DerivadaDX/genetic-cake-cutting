import { PlayerValuations } from '../../../src/cake-cutting/data-structures/player-valuations';
import { Piece } from '../../../src/cake-cutting/data-structures/piece';

describe('PlayerValuations', () => {
  describe('constructor', () => {
    it('should throw error when valuations do not sum to 1', () => {
      expect(() => new PlayerValuations([0.3, 0.3, 0.3])).toThrow('Valuations must sum exactly to 1');
    });

    it('should throw error when any valuation is negative', () => {
      expect(() => new PlayerValuations([0.5, -0.2, 0.7])).toThrow('All valuations must be between 0 and 1');
    });

    it('should throw error when any valuation is greater than 1', () => {
      expect(() => new PlayerValuations([0.5, 1.2, -0.7])).toThrow('All valuations must be between 0 and 1');
    });
  });

  describe('getValuationAt', () => {
    it('should return correct valuation at valid index', () => {
      const valuations = new PlayerValuations([0.2, 0.3, 0.1, 0.4]);
      expect(valuations.getValuationAt(2)).toBe(0.1);
    });

    it('should throw error for negative index', () => {
      const valuations = new PlayerValuations([0.2, 0.3, 0.1, 0.4]);
      expect(() => valuations.getValuationAt(-1)).toThrow('Valuation index out of bounds');
    });
  });

  describe('numberOfValuations', () => {
    it('should return correct number of valuations', () => {
      const valuations = new PlayerValuations([0.2, 0.3, 0.1, 0.4]);
      expect(valuations.numberOfValuations).toBe(4);
    });
  });

  describe('getValuationForPiece', () => {
    it('should calculate correct valuation for a valid piece', () => {
      const valuations = new PlayerValuations([0.2, 0.3, 0.1, 0.4]);
      const piece = new Piece(1, 3);
      expect(valuations.getValuationForPiece(piece)).toBe(0.4);
    });

    it('should return 0 for empty piece (start equals end)', () => {
      const valuations = new PlayerValuations([0.2, 0.3, 0.1, 0.4]);
      const piece = new Piece(2, 2);
      expect(valuations.getValuationForPiece(piece)).toBe(0);
    });

    it('should throw error for out of bounds piece', () => {
      const valuations = new PlayerValuations([0.2, 0.3, 0.1, 0.4]);
      const piece = new Piece(3, 7);
      expect(() => valuations.getValuationForPiece(piece)).toThrow('Piece indices out of bounds');
    });
  });
});
