import seedrandom from 'seedrandom';

export class RandomGenerator {
  private rng: seedrandom.PRNG;

  constructor(seed?: string | number) {
    this.rng = seedrandom(seed?.toString());
  }

  next(): number {
    const random = this.rng();
    return random;
  }
}
