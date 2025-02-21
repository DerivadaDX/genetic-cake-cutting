export class AlgorithmConfig {
  public readonly populationSize: number;
  public readonly mutationRate: number;

  constructor(populationSize: number, mutationRate: number) {
    if (populationSize <= 0 || !Number.isInteger(populationSize)) {
      throw new Error('Invalid population size: ' + populationSize);
    }

    if (mutationRate < 0 || mutationRate > 1) {
      throw new Error('Invalid mutation rate: ' + mutationRate);
    }

    this.populationSize = populationSize;
    this.mutationRate = mutationRate;
  }
};
