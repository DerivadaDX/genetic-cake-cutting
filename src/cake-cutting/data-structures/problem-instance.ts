import { PlayerValuations } from './player-valuations';

export class ProblemInstance {
  private readonly _playerValuations: PlayerValuations[];
  private readonly _numberOfAtoms: number;

  constructor(playerValuations: PlayerValuations[]) {
    const allPositions = playerValuations.flatMap(player => player.valuations.map(atom => atom.position));
    if (new Set(allPositions).size !== allPositions.length) {
      throw new Error('Atom positions must be unique across all players');
    }

    this._playerValuations = playerValuations;
    this._numberOfAtoms = this.calculateNumberOfAtoms();
  }

  get playerValuations(): PlayerValuations[] {
    return [...this._playerValuations];
  }

  get numberOfAtoms(): number {
    return this._numberOfAtoms;
  }

  private calculateNumberOfAtoms(): number {
    if (this._playerValuations.length === 0) return 0;

    const atomPositions = this._playerValuations.flatMap(player => player.valuations.map(atom => atom.position));
    const numberOfAtoms = Math.max(...atomPositions);
    return numberOfAtoms;
  }
}
