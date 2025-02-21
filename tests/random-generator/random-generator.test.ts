import { RandomGenerator } from '../../src/random-generator';

describe('RandomGenerator', () => {
  test('generates same number for same seed', () => {
    const random1 = new RandomGenerator('test-seed');
    const random2 = new RandomGenerator('test-seed');

    expect(random1.next()).toBe(random2.next());
  });

  test('generates different numbers for different seeds', () => {
    const random1 = new RandomGenerator('seed1');
    const random2 = new RandomGenerator('seed2');

    expect(random1.next()).not.toBe(random2.next());
  });

  test('generates numbers between 0 and 1', () => {
    const random = new RandomGenerator('test-seed');
    const num = random.next();

    expect(num).toBeGreaterThanOrEqual(0);
    expect(num).toBeLessThan(1);
  });

  test('generates consistent sequence', () => {
    const random = new RandomGenerator('test-seed');
    const firstSequence = [random.next(), random.next(), random.next()];

    const sameRandom = new RandomGenerator('test-seed');
    const secondSequence = [sameRandom.next(), sameRandom.next(), sameRandom.next()];

    expect(firstSequence).toEqual(secondSequence);
  });

  test('can be instantiated without seed', () => {
    const random = new RandomGenerator();
    const num = random.next();

    expect(num).toBeGreaterThanOrEqual(0);
    expect(num).toBeLessThan(1);
  });

  test('different instances without seed generate different numbers', () => {
    const random1 = new RandomGenerator();
    const random2 = new RandomGenerator();

    expect(random1.next()).not.toBe(random2.next());
  });
});
