import { IRandomGenerator } from '../../random-generator';

export class CutSet {
  private readonly _cuts: number[];

  constructor(cuts: number[], numberOfAtoms: number) {
    if (cuts.some(cut => cut < 0 || cut > numberOfAtoms)) {
      throw new Error(`Cut positions must be between 0 and ${numberOfAtoms}`);
    }

    for (let i = 1; i < cuts.length; i++) {
      if (cuts[i] < cuts[i - 1]) {
        throw new Error('Cuts must be in ascending order');
      }
    }

    this._cuts = [...cuts];
  }

  public static createRandom(numberOfCuts: number, numberOfAtoms: number, random: IRandomGenerator): CutSet {
    const positions: number[] = Array.from({ length: numberOfAtoms + 1 }, (_, i) => i);

    for (let i = 0; i < numberOfCuts; i++) {
      const randomIndex: number = i + Math.floor(random.next() * (positions.length - i));
      [positions[i], positions[randomIndex]] = [positions[randomIndex], positions[i]];
    }

    const selectedCuts: number[] = positions.slice(0, numberOfCuts);
    const sortedCuts: number[] = selectedCuts.sort((a, b) => a - b);

    const cutSet = new CutSet(sortedCuts, numberOfAtoms);
    return cutSet;
  }

  get cuts(): number[] {
    return [...this._cuts];
  }

  get numberOfCuts(): number {
    return this._cuts.length;
  }
}
