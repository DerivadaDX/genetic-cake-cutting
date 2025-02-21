import seedrandom from 'seedrandom';
import { IRandomGenerator } from './random-generator-interface';

export class RandomGenerator implements IRandomGenerator {
  private rng: seedrandom.PRNG;

  constructor(seed?: string | number) {
    this.rng = seedrandom(seed?.toString());
  }

  public next(): number {
    const random = this.rng();
    return random;
  }
}
