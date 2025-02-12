import { Individual } from './individual';
import { Piece, PlayerValuations } from './data-structures';

export interface IFitnessEvaluator {
  evaluate(individual: Individual): number;
}

export class FitnessEvaluator implements IFitnessEvaluator {
  constructor(private readonly players: PlayerValuations[]) {}

  public evaluate(individual: Individual): number {
    const pieces = this.getPiecesFromChromosome(individual.chromosome);
    let fitness = 0;

    // Calculate envy-freeness measure
    for (let i = 0; i < this.players.length; i++) {
      const playerPiece = pieces[i];
      // Check if player i envies any other player
      for (let j = 0; j < this.players.length; j++) {
        if (i !== j) {
          const otherPiece = pieces[j];
          // Add penalty if player i values player j's piece more than their own
          if (this.evaluatePieceForPlayer(otherPiece, i) > this.evaluatePieceForPlayer(playerPiece, i)) {
            fitness -= 1;
          }
        }
      }
    }

    return fitness;
  }

  private getPiecesFromChromosome(chromosome: number[]): Piece[] {
    const pieces: Piece[] = [];
    let start = 0;

    for (const cut of chromosome) {
      pieces.push(new Piece(start, cut));
      start = cut;
    }

    // Add last piece until end of cake
    const lastAtom = this.players[0].numberOfValuations;
    pieces.push(new Piece(start, lastAtom));

    return pieces;
  }

  private evaluatePieceForPlayer(piece: Piece, playerIndex: number): number {
    let value = 0;
    for (let atomIndex = piece.start; atomIndex < piece.end; atomIndex++) {
      value += this.players[playerIndex].getValuationAt(atomIndex);
    }
    return value;
  }
}
