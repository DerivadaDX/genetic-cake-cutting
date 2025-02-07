import { RandomGenerator } from './random-generator';

export class RandomGeneratorFactory {
  private static _generator: RandomGenerator;

  public static create(seed?: string | number): RandomGenerator {
    const generator = this._generator ?? new RandomGenerator(seed);
    return generator;
  }

  // Solo disponible para testing
  public static setGenerator(generator: RandomGenerator): void {
    if (process.env.NODE_ENV === 'test') {
      this._generator = generator;
    }
  }
}
