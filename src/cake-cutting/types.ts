import { PlayerValuations } from './player-valuations';

export type GeneticAlgorithmConfig = {
  populationSize: number;
  mutationRate: number;
}

export type CakeCuttingProblem = {
  playerValuations: PlayerValuations[];
}
