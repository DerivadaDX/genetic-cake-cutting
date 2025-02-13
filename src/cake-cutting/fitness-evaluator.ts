import { Individual } from './individual';
import { Piece, PlayerValuations, ProblemInstance } from './data-structures';

export interface IFitnessEvaluator {
  evaluate(problem: ProblemInstance, individual: Individual): number;
}

export class FitnessEvaluator implements IFitnessEvaluator {
  public evaluate(problem: ProblemInstance, individual: Individual): number {
    const pieces = this.getPiecesFromChromosome(individual.chromosome, problem);
    let fitness = 0;

    // Calculate envy-freeness measure
    const players = problem.playerValuations;
    for (let i = 0; i < players.length; i++) {
      const playerPiece = pieces[i];
      // Check if player i envies any other player
      for (let j = 0; j < players.length; j++) {
        if (i !== j) {
          const otherPiece = pieces[j];
          // Add penalty if player i values player j's piece more than their own
          if (this.evaluatePieceForPlayer(otherPiece, i, players) > this.evaluatePieceForPlayer(playerPiece, i, players)) {
            fitness -= 1;
          }
        }
      }
    }

    return fitness;
  }

  private getPiecesFromChromosome(chromosome: number[], problem: ProblemInstance): Piece[] {
    const pieces: Piece[] = [];
    let start = 0;

    for (const cut of chromosome) {
      pieces.push(new Piece(start, cut));
      start = cut;
    }

    // Add last piece until end of cake
    const numberOfAtoms = problem.calculateNumberOfAtoms();
    pieces.push(new Piece(start, numberOfAtoms));

    return pieces;
  }

  private evaluatePieceForPlayer(piece: Piece, playerIndex: number, players: PlayerValuations[]): number {
    let value = 0;
    for (let atomIndex = piece.start; atomIndex < piece.end; atomIndex++) {
      value += players[playerIndex].getValuationAt(atomIndex);
    }
    return value;
  }
}
