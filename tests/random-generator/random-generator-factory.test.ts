import { RandomGenerator, RandomGeneratorFactory } from '../../src/random-generator';

describe('RandomGeneratorFactory', () => {
  afterEach(() => {
    RandomGeneratorFactory.setGenerator(undefined as any);
  });

  test('returns an instance of RandomGenerator', () => {
    const generator = RandomGeneratorFactory.create('test-seed');
    expect(generator).toBeInstanceOf(RandomGenerator);
  });

  test('allows generator injection in test mode', () => {
    const mockGenerator = new RandomGenerator('mock-seed');
    RandomGeneratorFactory.setGenerator(mockGenerator);

    const generator = RandomGeneratorFactory.create();
    expect(generator).toBe(mockGenerator);
  });

  test('does not allow generator injection outside test mode (development)', () => {
    process.env.NODE_ENV = 'development';
    const mockGenerator = new RandomGenerator('mock-seed');
    RandomGeneratorFactory.setGenerator(mockGenerator);

    const generator = RandomGeneratorFactory.create();
    expect(generator).not.toBe(mockGenerator);
    process.env.NODE_ENV = 'test';
  });

  test('does not allow generator injection outside test mode (production)', () => {
    process.env.NODE_ENV = 'production';
    const mockGenerator = new RandomGenerator('mock-seed');
    RandomGeneratorFactory.setGenerator(mockGenerator);

    const generator = RandomGeneratorFactory.create();
    expect(generator).not.toBe(mockGenerator);
    process.env.NODE_ENV = 'test';
  });
});
