import { Player } from '../../src/cake-cutting/player';


describe('Player', () => {
  describe('Constructor Validation', () => {
    test('should create player with valid valuations', () => {
      const validValuations = [0.2, 0.3, 0.5];
      const player = new Player(validValuations);
      expect(player.valuations).toEqual(validValuations);
    });

    test('should throw error if valuations do not sum to 1', () => {
      const invalidValuations = [0.2, 0.3, 0.3]; // sums to 0.8
      expect(() => new Player(invalidValuations)).toThrow('Valuations must sum exactly to 1');
    });

    test('should throw error if any valuation is negative', () => {
      const invalidValuations = [0.5, -0.1, 0.6];
      expect(() => new Player(invalidValuations)).toThrow('All valuations must be between 0 and 1');
    });

    test('should throw error if any valuation is greater than 1', () => {
      const invalidValuations = [0.5, 1.1, 0.5];
      expect(() => new Player(invalidValuations)).toThrow('All valuations must be between 0 and 1');
    });

    test('should handle edge case of single valuation of 1', () => {
      const validValuations = [1];
      const player = new Player(validValuations);
      expect(player.valuations).toEqual(validValuations);
    });

    test('should handle floating point precision correctly', () => {
      // 0.1 + 0.2 + 0.7 should equal 1 despite floating point arithmetic
      const validValuations = [0.1, 0.2, 0.7];
      const player = new Player(validValuations);
      expect(player.valuations).toEqual(validValuations);
    });
  });

  describe('Getters and Methods', () => {
    const validValuations = [0.2, 0.3, 0.5];
    let player: Player;

    beforeEach(() => {
      player = new Player(validValuations);
    });

    test('valuations getter should return a copy of valuations', () => {
      const returnedValuations = player.valuations;
      returnedValuations[0] = 1; // try to modify
      expect(player.valuations).toEqual(validValuations); // should remain unchanged
    });

    test('numberOfValuations should return correct length', () => {
      expect(player.numberOfValuations).toBe(3);
    });

    test('getValuationAt should return correct value', () => {
      expect(player.getValuationAt(0)).toBe(0.2);
      expect(player.getValuationAt(1)).toBe(0.3);
      expect(player.getValuationAt(2)).toBe(0.5);
    });

    test('getValuationAt should throw error for invalid index', () => {
      expect(() => player.getValuationAt(-1)).toThrow('Valuation index out of bounds');
      expect(() => player.getValuationAt(3)).toThrow('Valuation index out of bounds');
    });
  });
});
