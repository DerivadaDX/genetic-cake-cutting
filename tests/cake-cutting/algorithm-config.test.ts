import { AlgorithmConfig } from '../../src/cake-cutting/algorithm-config';

describe('AlgorithmConfig', () => {
  describe('constructor', () => {
    test('should throw error with invalid population size', () => {
      expect(() => { new AlgorithmConfig(0, 0.1); }).toThrow('Invalid population size: 0');
      expect(() => { new AlgorithmConfig(-1, 0.1); }).toThrow('Invalid population size: -1');
      expect(() => { new AlgorithmConfig(0.1, 0.1); }).toThrow('Invalid population size: 0.1');
    });

    test('should throw error with invalid mutation rate', () => {
      expect(() => { new AlgorithmConfig(100, -0.1); }).toThrow('Invalid mutation rate: -0.1');
      expect(() => { new AlgorithmConfig(100, 1.1); }).toThrow('Invalid mutation rate: 1.1');
    });

    test('should create instance with valid values', () => {
      const config = new AlgorithmConfig(100, 1);
      expect(config.populationSize).toBe(100);
      expect(config.mutationRate).toBe(1);
    });
  });
});
