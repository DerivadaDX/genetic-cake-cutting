import { PlayerValuations } from '../../../src/cake-cutting/data-structures/player-valuations';
import { Piece } from '../../../src/cake-cutting/data-structures/piece';

describe('PlayerValuations', () => {
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
