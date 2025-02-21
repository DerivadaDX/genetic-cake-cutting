import { RandomGenerator } from './random-generator';
import { IRandomGenerator } from './random-generator-interface';

export class RandomGeneratorFactory {
  private static _generator: IRandomGenerator;

  public static create(seed?: string | number): IRandomGenerator {
    const generator = this._generator ?? new RandomGenerator(seed);
    return generator;
  }

  // Only available for testing
  public static setGenerator(generator: IRandomGenerator): void {
    if (process.env.NODE_ENV === 'test') {
      this._generator = generator;
    }
  }
}
