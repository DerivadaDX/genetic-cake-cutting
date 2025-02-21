import { CutSet } from '../../src/cake-cutting/data-structures';
import { Individual } from '../../src/cake-cutting/individual';
import { IRandomGenerator } from '../../src/random-generator';

describe('Individual', () => {
  const numberOfAtoms = 7;

  describe('constructor', () => {
    test('should create valid individual', () => {
      const chromosome = new CutSet([2, 4], numberOfAtoms);
      const individual = new Individual(chromosome);

      expect(individual.chromosome).toEqual([2, 4]);
      expect(individual.fitness).toBe(0); // Initial fitness is always 0
    });

    test('chromosome getter should return defensive copy', () => {
      const chromosome = new CutSet([2, 4], numberOfAtoms);
      const individual = new Individual(chromosome);
      const cuts: number[] = individual.chromosome;

      cuts[0] = 3;
      expect(individual.chromosome).toEqual([2, 4]);
    });
  });

  describe('crossover', () => {
    let mockRandom: jest.Mocked<IRandomGenerator>;

    beforeEach(() => {
      mockRandom = { next: jest.fn() };
    });

    test('should perform crossover at a random point', () => {
      const parent1 = new Individual(new CutSet([1, 3, 5], numberOfAtoms));
      const parent2 = new Individual(new CutSet([2, 4, 6], numberOfAtoms));
      mockRandom.next.mockReturnValue(0.5);

      const child: Individual = parent1.crossover(parent2, numberOfAtoms, mockRandom);

      expect(child.chromosome).toEqual([1, 4, 6]);
      expect(child.fitness).toBe(0);
    });

    test('should keep cuts sorted after crossover', () => {
      const parent1 = new Individual(new CutSet([1, 4, 6], numberOfAtoms));
      const parent2 = new Individual(new CutSet([2, 3, 5], numberOfAtoms));
      mockRandom.next.mockReturnValue(0.5);

      const child: Individual = parent1.crossover(parent2, numberOfAtoms, mockRandom);

      expect(child.chromosome).toEqual([...child.chromosome].sort((a, b) => a - b));
    });
  });

  describe('mutate', () => {
    let mockRandom: jest.Mocked<IRandomGenerator>;

    beforeEach(() => {
      mockRandom = { next: jest.fn() };
    });

    test('should not mutate when random value is above mutation rate', () => {
      const individual = new Individual(new CutSet([2, 4], numberOfAtoms));
      mockRandom.next.mockReturnValue(0.6); // Above mutation rate

      const mutated: Individual = individual.mutate(0.5, numberOfAtoms, mockRandom);

      expect(mutated.chromosome).toEqual([2, 4]);
      expect(mutated.fitness).toBe(0);
    });

    test('should mutate when random value is below mutation rate', () => {
      const individual = new Individual(new CutSet([2, 4], numberOfAtoms));
      mockRandom.next
        .mockReturnValueOnce(0.1) // Below mutation rate
        .mockReturnValueOnce(0.5); // New position calculation

      const mutated: Individual = individual.mutate(0.5, numberOfAtoms, mockRandom);

      expect(mutated.chromosome).not.toEqual([2, 4]);
      expect(mutated.fitness).toBe(0);
    });

    test('should keep cuts sorted after mutation', () => {
      const individual = new Individual(new CutSet([2, 4, 6], numberOfAtoms));
      mockRandom.next
        .mockReturnValueOnce(0.1) // Below mutation rate
        .mockReturnValueOnce(0.8); // Will give a high value

      const mutated: Individual = individual.mutate(0.5, numberOfAtoms, mockRandom);

      expect(mutated.chromosome).toEqual(mutated.chromosome.sort((a, b) => a - b));
    });
  });

  describe('setFitness', () => {
    test('should update fitness value', () => {
      const individual = new Individual(new CutSet([2, 4], numberOfAtoms));
      individual.setFitness(-2);
      expect(individual.fitness).toBe(-2);
    });
  });
});
