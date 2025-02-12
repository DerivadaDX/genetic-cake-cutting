import seedrandom from 'seedrandom';

export interface IRandomGenerator {
  next(): number;
}

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
