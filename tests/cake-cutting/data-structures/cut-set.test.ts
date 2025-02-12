import { CutSet } from '../../../src/cake-cutting/data-structures';
import { RandomGeneratorFactory } from '../../../src/random-generator-factory';

describe('CutSet', () => {
  const numberOfAtoms = 7;

  describe('Constructor Validation', () => {
    test('should create valid cut set', () => {
      const cuts = [2, 4];
      const cutSet = new CutSet(cuts, numberOfAtoms);

      expect(cutSet.cuts).toEqual(cuts);
      expect(cutSet.numberOfCuts).toBe(2);
    });

    test('should make defensive copy of cuts', () => {
      const cuts = [2, 4];
      const cutSet = new CutSet(cuts, numberOfAtoms);

      cuts[0] = 3;
      expect(cutSet.cuts).toEqual([2, 4]);
    });

    test('cuts getter should return defensive copy', () => {
      const cutSet = new CutSet([2, 4], numberOfAtoms);
      const cuts = cutSet.cuts;

      cuts[0] = 3;
      expect(cutSet.cuts).toEqual([2, 4]);
    });

    test('should throw error for cuts beyond numberOfAtoms', () => {
      expect(() => {
        new CutSet([2, 8], numberOfAtoms);
      }).toThrow('Cut positions must be between 0 and 7');
    });

    test('should throw error for negative cuts', () => {
      expect(() => {
        new CutSet([-1, 4], numberOfAtoms);
      }).toThrow('Cut positions must be between 0 and 7');
    });

    test('should throw error for non-ascending cuts', () => {
      expect(() => {
        new CutSet([4, 2], numberOfAtoms);
      }).toThrow('Cuts must be in ascending order');
    });
  });

  describe('Static Creation', () => {
    test('should create random cut set with correct number of cuts', () => {
      const numberOfCuts = 3;
      const random = RandomGeneratorFactory.create();
      const cutSet = CutSet.createRandom(numberOfCuts, numberOfAtoms, random);

      expect(cutSet.numberOfCuts).toBe(numberOfCuts);
      expect(cutSet.cuts.length).toBe(numberOfCuts);
    });

    test('should create valid random cuts', () => {
      const numberOfCuts = 2;
      const random = RandomGeneratorFactory.create();
      const cutSet = CutSet.createRandom(numberOfCuts, numberOfAtoms, random);

      expect(cutSet.cuts.every(cut => cut >= 0 && cut <= numberOfAtoms)).toBe(true);
      expect(cutSet.cuts).toEqual(cutSet.cuts.sort((a, b) => a - b));
    });
  });
});
