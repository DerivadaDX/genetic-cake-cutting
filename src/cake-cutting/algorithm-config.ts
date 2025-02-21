export class AlgorithmConfig {
  public readonly populationSize: number;
  public readonly mutationRate: number;

  constructor(populationSize: number, mutationRate: number) {
    this.populationSize = populationSize;
    this.mutationRate = mutationRate;
  }
};
