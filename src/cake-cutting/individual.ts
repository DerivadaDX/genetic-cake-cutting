import { IRandomGenerator } from '../random-generator';
import { CutSet } from './cut-set';

export class Individual {
  private readonly _chromosome: CutSet;
  private readonly _fitness: number;

  constructor(chromosome: CutSet, fitness: number) {
    this._chromosome = chromosome;
    this._fitness = fitness;
  }

  get chromosome(): number[] {
    return this._chromosome.cuts;
  }

  get fitness(): number {
    return this._fitness;
  }

  public crossover(
    other: Individual,
    numberOfAtoms: number,
    evaluateFitness: (cuts: number[]) => number,
    random: IRandomGenerator,
  ): Individual {
    const crossoverPoint = Math.floor(random.next() * this._chromosome.numberOfCuts);
    const firstParentData = this.chromosome.slice(0, crossoverPoint);
    const secondParentData = other.chromosome.slice(crossoverPoint);

    const childChromosome = [...firstParentData, ...secondParentData].sort((a, b) => a - b);
    const childFitness = evaluateFitness(childChromosome);
    const childCutSet = new CutSet(childChromosome, numberOfAtoms);

    const child = new Individual(childCutSet, childFitness);
    return child;
  }

  public mutate(
    mutationRate: number,
    numberOfAtoms: number,
    evaluateFitness: (cuts: number[]) => number,
    random: IRandomGenerator,
  ): Individual {
    const mutatedChromosome = this.chromosome
      .map(gene => {
        if (random.next() < mutationRate) {
          const newPosition = Math.floor(random.next() * (numberOfAtoms + 1));
          return newPosition;
        }
        return gene;
      })
      .sort((a, b) => a - b);

    const mutatedFitness = evaluateFitness(mutatedChromosome);
    const mutatedCutSet = new CutSet(mutatedChromosome, numberOfAtoms);

    const mutated = new Individual(mutatedCutSet, mutatedFitness);
    return mutated;
  }
}
