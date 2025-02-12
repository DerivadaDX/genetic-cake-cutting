import { Piece } from '../../../src/cake-cutting/data-structures';

describe('Piece', () => {
  describe('Constructor', () => {
    test('should create valid piece', () => {
      const piece = new Piece(2, 4);

      expect(piece.start).toBe(2);
      expect(piece.end).toBe(4);
    });

    test('should create piece with equal start and end', () => {
      const piece = new Piece(3, 3);

      expect(piece.start).toBe(3);
      expect(piece.end).toBe(3);
    });

    test('should throw error when end is less than start', () => {
      expect(() => {
        new Piece(4, 2);
      }).toThrow('End must be greater than or equal to start');
    });
  });
});
