import { PlayerValuations } from './player-valuations';

export class ProblemInstance {
  playerValuations: PlayerValuations[];

  constructor(playerValuations: PlayerValuations[]) {
    this.playerValuations = playerValuations;
  }

  public calculateNumberOfAtoms(): number {
    const numberOfAtoms = this.playerValuations.reduce((sum, player) => sum + player.numberOfValuations, 0);
    return numberOfAtoms;
  }
}
