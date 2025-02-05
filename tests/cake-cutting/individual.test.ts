import { Individual } from '../../src/cake-cutting/individual';

describe('Individual', () => {
  const numberOfAtoms = 7;

  describe('Constructor Validation', () => {
    test('should create valid individual', () => {
      const chromosome = [2, 4];
      const fitness = -1;
      const individual = new Individual(chromosome, fitness, numberOfAtoms);

      expect(individual.chromosome).toEqual(chromosome);
      expect(individual.fitness).toBe(fitness);
    });

    test('should make defensive copy of chromosome', () => {
      const chromosome = [2, 4];
      const individual = new Individual(chromosome, 0, numberOfAtoms);

      chromosome[0] = 3;
      expect(individual.chromosome).toEqual([2, 4]);
    });

    test('chromosome getter should return defensive copy', () => {
      const individual = new Individual([2, 4], 0, numberOfAtoms);
      const chromosome = individual.chromosome;

      chromosome[0] = 3;
      expect(individual.chromosome).toEqual([2, 4]);
    });

    test('should throw error for non-array chromosome', () => {
      expect(() => {
        new Individual('not an array' as any, 0, numberOfAtoms);
      }).toThrow('Chromosome must be an array');
    });

    test('should throw error for non-integer cuts', () => {
      expect(() => {
        new Individual([1.5, 4], 0, numberOfAtoms);
      }).toThrow('Chromosome must contain only integer values');
    });

    test('should throw error for negative cuts', () => {
      expect(() => {
        new Individual([-1, 4], 0, numberOfAtoms);
      }).toThrow('Chromosome values must be between 0 and 7');
    });

    test('should throw error for cuts beyond numberOfAtoms', () => {
      expect(() => {
        new Individual([2, 8], 0, numberOfAtoms);
      }).toThrow('Chromosome values must be between 0 and 7');
    });

    test('should throw error for non-ascending cuts', () => {
      expect(() => {
        new Individual([4, 2], 0, numberOfAtoms);
      }).toThrow('Chromosome cuts must be in ascending order');
    });
  });

  describe('Getters', () => {
    test('should return correct number of cuts', () => {
      const individual = new Individual([2, 4, 6], 0, numberOfAtoms);
      expect(individual.numberOfCuts).toBe(3);
    });

    test('should handle empty chromosome', () => {
      const individual = new Individual([], 0, numberOfAtoms);
      expect(individual.numberOfCuts).toBe(0);
    });

    test('should handle single cut', () => {
      const individual = new Individual([3], 0, numberOfAtoms);
      expect(individual.numberOfCuts).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle all cuts at zero', () => {
      const individual = new Individual([0, 0], 0, numberOfAtoms);
      expect(individual.chromosome).toEqual([0, 0]);
    });

    test('should handle all cuts at numberOfAtoms', () => {
      const individual = new Individual([7, 7], 0, numberOfAtoms);
      expect(individual.chromosome).toEqual([7, 7]);
    });

    test('should handle consecutive cuts', () => {
      const individual = new Individual([2, 3, 4], 0, numberOfAtoms);
      expect(individual.chromosome).toEqual([2, 3, 4]);
    });
  });
});
