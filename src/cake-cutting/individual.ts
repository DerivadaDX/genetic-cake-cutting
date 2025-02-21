import { IRandomGenerator } from '../random-generator';
import { CutSet } from './data-structures';

export class Individual {
  private readonly _chromosome: CutSet;
  private _fitness: number;

  constructor(chromosome: CutSet) {
    this._chromosome = chromosome;
    this._fitness = 0;
  }

  get chromosome(): number[] {
    return this._chromosome.cuts;
  }

  get fitness(): number {
    return this._fitness;
  }

  public setFitness(value: number): void {
    this._fitness = value;
  }

  public crossover(other: Individual, numberOfAtoms: number, random: IRandomGenerator): Individual {
    const crossoverPoint: number = Math.floor(random.next() * this._chromosome.numberOfCuts);
    const firstParentData: number[] = this.chromosome.slice(0, crossoverPoint);
    const secondParentData: number[] = other.chromosome.slice(crossoverPoint);

    const childChromosome: number[] = [...firstParentData, ...secondParentData].sort((a, b) => a - b);
    const childCutSet = new CutSet(childChromosome, numberOfAtoms);

    const child = new Individual(childCutSet);
    return child;
  }

  public mutate(mutationRate: number, numberOfAtoms: number, random: IRandomGenerator): Individual {
    const mutatedChromosome = this.chromosome
      .map(gene => {
        if (random.next() < mutationRate) {
          const newPosition = Math.floor(random.next() * (numberOfAtoms + 1));
          return newPosition;
        }
        return gene;
      })
      .sort((a, b) => a - b);

    const mutatedCutSet = new CutSet(mutatedChromosome, numberOfAtoms);
    const mutatedChild = new Individual(mutatedCutSet);
    return mutatedChild;
  }
}
