import { Individual } from '../../src/cake-cutting/individual';
import { IRandomGenerator } from '../../src/random-generator';

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

  describe('Crossover', () => {
    let mockRandom: jest.Mocked<IRandomGenerator>;
    let mockEvaluateFitness: jest.Mock;

    beforeEach(() => {
      mockRandom = { next: jest.fn() };
      mockEvaluateFitness = jest.fn();
    });

    test('should perform crossover at a random point', () => {
      const parent1 = new Individual([1, 3, 5], 0, numberOfAtoms);
      const parent2 = new Individual([2, 4, 6], 0, numberOfAtoms);
      mockRandom.next.mockReturnValue(0.5); // Will select middle point
      mockEvaluateFitness.mockReturnValue(-2);

      const child = parent1.crossover(parent2, mockEvaluateFitness, mockRandom);

      expect(child.chromosome).toEqual([1, 4, 6]);
      expect(child.fitness).toBe(-2);
      expect(mockEvaluateFitness).toHaveBeenCalledWith([1, 4, 6]);
    });

    test('should keep cuts sorted after crossover', () => {
      const parent1 = new Individual([1, 4, 6], 0, numberOfAtoms);
      const parent2 = new Individual([2, 3, 5], 0, numberOfAtoms);
      mockRandom.next.mockReturnValue(0.5); // Will select middle point
      mockEvaluateFitness.mockReturnValue(-1);

      const child = parent1.crossover(parent2, mockEvaluateFitness, mockRandom);

      expect(child.chromosome).toEqual([1, 3, 5]);
      expect(child.chromosome).toEqual(child.chromosome.sort((a, b) => a - b));
    });
  });

  describe('Mutation', () => {
    let mockRandom: jest.Mocked<IRandomGenerator>;
    let mockEvaluateFitness: jest.Mock;

    beforeEach(() => {
      mockRandom = { next: jest.fn() };
      mockEvaluateFitness = jest.fn();
    });

    test('should not mutate when random value is above mutation rate', () => {
      const individual = new Individual([2, 4], 0, numberOfAtoms);
      mockRandom.next.mockReturnValue(0.6); // Above mutation rate
      mockEvaluateFitness.mockReturnValue(-1);

      const mutated = individual.mutate(0.5, mockEvaluateFitness, mockRandom);

      expect(mutated.chromosome).toEqual([2, 4]);
      expect(mutated.fitness).toBe(-1);
    });

    test('should mutate when random value is below mutation rate', () => {
      const individual = new Individual([2, 4], 0, numberOfAtoms);
      mockRandom.next
        .mockReturnValueOnce(0.1) // Below mutation rate
        .mockReturnValueOnce(0.5) // New position calculation
        .mockReturnValueOnce(0.8); // Above mutation rate for second gene
      mockEvaluateFitness.mockReturnValue(-3);

      const mutated = individual.mutate(0.5, mockEvaluateFitness, mockRandom);

      expect(mutated.chromosome).not.toEqual([2, 4]);
      expect(mutated.fitness).toBe(-3);
      expect(mockEvaluateFitness).toHaveBeenCalled();
    });

    test('should keep cuts sorted after mutation', () => {
      const individual = new Individual([2, 4, 6], 0, numberOfAtoms);
      mockRandom.next
        .mockReturnValueOnce(0.1) // Below mutation rate
        .mockReturnValueOnce(0.8) // Will give a high value
        .mockReturnValueOnce(0.8) // Above mutation rate
        .mockReturnValueOnce(0.8); // Above mutation rate
      mockEvaluateFitness.mockReturnValue(-1);

      const mutated = individual.mutate(0.5, mockEvaluateFitness, mockRandom);

      expect(mutated.chromosome).toEqual(mutated.chromosome.sort((a, b) => a - b));
    });

    test('should validate mutated chromosome', () => {
      const individual = new Individual([2, 4], 0, numberOfAtoms);
      mockRandom.next
        .mockReturnValueOnce(0.1) // Below mutation rate
        .mockReturnValueOnce(0.99); // Will try to give an invalid value
      mockEvaluateFitness.mockReturnValue(-1);

      const mutated = individual.mutate(0.5, mockEvaluateFitness, mockRandom);

      expect(mutated.chromosome.every(cut => cut >= 0 && cut <= numberOfAtoms)).toBe(true);
    });
  });
});
