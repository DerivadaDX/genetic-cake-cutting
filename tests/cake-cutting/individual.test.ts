import { CutSet } from '../../src/cake-cutting/cut-set';
import { Individual } from '../../src/cake-cutting/individual';
import { IRandomGenerator } from '../../src/random-generator';

describe('Individual', () => {
  const numberOfAtoms = 7;

  describe('Constructor Validation', () => {
    test('should create valid individual', () => {
      const chromosome = new CutSet([2, 4], numberOfAtoms);
      const fitness = -1;
      const individual = new Individual(chromosome, fitness);

      expect(individual.chromosome).toEqual([2, 4]);
      expect(individual.fitness).toBe(fitness);
    });

    test('chromosome getter should return defensive copy', () => {
      const chromosome = new CutSet([2, 4], numberOfAtoms);
      const individual = new Individual(chromosome, 0);
      const cuts = individual.chromosome;

      cuts[0] = 3;
      expect(individual.chromosome).toEqual([2, 4]);
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
      const parent1 = new Individual(new CutSet([1, 3, 5], numberOfAtoms), 0);
      const parent2 = new Individual(new CutSet([2, 4, 6], numberOfAtoms), 0);
      mockRandom.next.mockReturnValue(0.5); // Will select middle point
      mockEvaluateFitness.mockReturnValue(-2);

      const child = parent1.crossover(parent2, numberOfAtoms, mockEvaluateFitness, mockRandom);

      expect(child.chromosome).toEqual([1, 4, 6]);
      expect(child.fitness).toBe(-2);
      expect(mockEvaluateFitness).toHaveBeenCalledWith([1, 4, 6]);
    });

    test('should keep cuts sorted after crossover', () => {
      const parent1 = new Individual(new CutSet([1, 4, 6], numberOfAtoms), 0);
      const parent2 = new Individual(new CutSet([2, 3, 5], numberOfAtoms), 0);
      mockRandom.next.mockReturnValue(0.5); // Will select middle point
      mockEvaluateFitness.mockReturnValue(-1);

      const child = parent1.crossover(parent2, numberOfAtoms, mockEvaluateFitness, mockRandom);

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
      const individual = new Individual(new CutSet([2, 4], numberOfAtoms), 0);
      mockRandom.next.mockReturnValue(0.6); // Above mutation rate
      mockEvaluateFitness.mockReturnValue(-1);

      const mutated = individual.mutate(0.5, numberOfAtoms, mockEvaluateFitness, mockRandom);

      expect(mutated.chromosome).toEqual([2, 4]);
      expect(mutated.fitness).toBe(-1);
    });

    test('should mutate when random value is below mutation rate', () => {
      const individual = new Individual(new CutSet([2, 4], numberOfAtoms), 0);
      mockRandom.next
        .mockReturnValueOnce(0.1) // Below mutation rate
        .mockReturnValueOnce(0.5) // New position calculation
        .mockReturnValueOnce(0.8); // Above mutation rate for second gene
      mockEvaluateFitness.mockReturnValue(-3);

      const mutated = individual.mutate(0.5, numberOfAtoms, mockEvaluateFitness, mockRandom);

      expect(mutated.chromosome).not.toEqual([2, 4]);
      expect(mutated.fitness).toBe(-3);
      expect(mockEvaluateFitness).toHaveBeenCalled();
    });

    test('should keep cuts sorted after mutation', () => {
      const individual = new Individual(new CutSet([2, 4, 6], numberOfAtoms), 0);
      mockRandom.next
        .mockReturnValueOnce(0.1) // Below mutation rate
        .mockReturnValueOnce(0.8) // Will give a high value
        .mockReturnValueOnce(0.8) // Above mutation rate
        .mockReturnValueOnce(0.8); // Above mutation rate
      mockEvaluateFitness.mockReturnValue(-1);

      const mutated = individual.mutate(0.5, numberOfAtoms, mockEvaluateFitness, mockRandom);

      expect(mutated.chromosome).toEqual(mutated.chromosome.sort((a, b) => a - b));
    });
  });
});
