import { IRandomGenerator, RandomGenerator } from './random-generator';

export class RandomGeneratorFactory {
  private static _generator: IRandomGenerator;

  public static create(seed?: string | number): IRandomGenerator {
    const generator = this._generator ?? new RandomGenerator(seed);
    return generator;
  }

  // Solo disponible para testing
  public static setGenerator(generator: IRandomGenerator): void {
    if (process.env.NODE_ENV === 'test') {
      this._generator = generator;
    }
  }
}
