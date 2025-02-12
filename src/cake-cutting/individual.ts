import { IRandomGenerator } from '../random-generator';

export class Individual {
  private readonly _chromosome: number[];
  private readonly _fitness: number;
  private readonly _numberOfAtoms: number;

  constructor(chromosome: number[], fitness: number, numberOfAtoms: number) {
    if (!Array.isArray(chromosome)) {
      throw new Error('Chromosome must be an array');
    }

    if (chromosome.some(cut => !Number.isInteger(cut))) {
      throw new Error('Chromosome must contain only integer values');
    }

    if (chromosome.some(cut => cut < 0 || cut > numberOfAtoms))
      throw new Error(`Chromosome values must be between 0 and ${numberOfAtoms}`);

    for (let i = 1; i < chromosome.length; i++) {
      if (chromosome[i] < chromosome[i - 1]) {
        throw new Error('Chromosome cuts must be in ascending order');
      }
    }

    this._chromosome = [...chromosome];
    this._fitness = fitness;
    this._numberOfAtoms = numberOfAtoms;
  }

  public crossover(
    other: Individual,
    evaluateFitness: (chromosome: number[]) => number,
    random: IRandomGenerator,
  ): Individual {
    const crossoverPoint = Math.floor(random.next() * this.numberOfCuts);
    const firstParentData = this.chromosome.slice(0, crossoverPoint);
    const secondParentData = other.chromosome.slice(crossoverPoint);

    const childChromosome = [...firstParentData, ...secondParentData].sort((a, b) => a - b);
    const childFitness = evaluateFitness(childChromosome);
    const child = new Individual(childChromosome, childFitness, this._numberOfAtoms);
    return child;
  }

  public mutate(
    mutationRate: number,
    evaluateFitness: (chromosome: number[]) => number,
    random: IRandomGenerator,
  ): Individual {
    const mutatedChromosome = this.chromosome
      .map(gene => {
        if (random.next() < mutationRate) {
          const newPosition = Math.floor(random.next() * (this._numberOfAtoms + 1));
          return newPosition;
        }
        return gene;
      })
      .sort((a, b) => a - b);

    const mutatedFitness = evaluateFitness(mutatedChromosome);
    const mutated = new Individual(mutatedChromosome, mutatedFitness, this._numberOfAtoms);
    return mutated;
  }

  get chromosome(): number[] {
    return [...this._chromosome];
  }

  get fitness(): number {
    return this._fitness;
  }

  get numberOfCuts(): number {
    return this._chromosome.length;
  }
}
