export class Individual {
  private readonly _chromosome: number[];
  private readonly _fitness: number;

  constructor(chromosome: number[], fitness: number, numberOfAtoms: number) {
    this.validateChromosome(chromosome, numberOfAtoms);
    this._chromosome = [...chromosome];
    this._fitness = fitness;
  }

  private validateChromosome(chromosome: number[], numberOfAtoms: number): void {
    if (!Array.isArray(chromosome)) {
      throw new Error('Chromosome must be an array');
    }

    if (chromosome.some(cut => !Number.isInteger(cut))) {
      throw new Error('Chromosome must contain only integer values');
    }

    if (chromosome.some(cut => cut < 0 || cut > numberOfAtoms)) {
      throw new Error(`Chromosome values must be between 0 and ${numberOfAtoms}`);
    }

    // Verify cuts are in ascending order
    for (let i = 1; i < chromosome.length; i++) {
      if (chromosome[i] < chromosome[i - 1]) {
        throw new Error('Chromosome cuts must be in ascending order');
      }
    }
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
