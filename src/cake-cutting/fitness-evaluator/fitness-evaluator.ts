import { ProblemInstance } from '../data-structures';
import { Individual } from '../individual';
import { IFitnessEvaluator } from './fitness-evaluator-interface';
import { Piece } from '../data-structures';

export class FitnessEvaluator implements IFitnessEvaluator {
  public evaluate(problem: ProblemInstance, individual: Individual): number {
    const pieces = this.getPiecesFromCutPositions(individual.chromosome, problem.numberOfAtoms);
    const valuationMatrix = this.createValuationMatrix(pieces, problem);
    const assignments = this.hungarianAlgorithm(valuationMatrix);

    // Calculate total satisfaction based on optimal assignments
    const fitness = assignments.reduce(
      (sum, assignment, playerIndex) => sum + valuationMatrix[playerIndex][assignment],
      0,
    );
    return fitness;
  }

  private getPiecesFromCutPositions(cutPositions: number[], numberOfAtoms: number): Piece[] {
    const pieces: Piece[] = [];
    let start = 0;

    for (const cut of cutPositions) {
      pieces.push(new Piece(start, cut));
      start = cut;
    }
    pieces.push(new Piece(start, numberOfAtoms));

    return pieces;
  }

  private createValuationMatrix(pieces: Piece[], problem: ProblemInstance): number[][] {
    const valuationMatrix = problem.playerValuations.map(player =>
      pieces.map(piece => player.getValuationForPiece(piece)),
    );
    return valuationMatrix;
  }

  private hungarianAlgorithm(matrix: number[][]): number[] {
    const n = matrix.length;
    const cost = matrix.map(row => row.map(x => -x)); // Convert to cost minimization

    // Step 1: Subtract row minima
    for (let i = 0; i < n; i++) {
      const min = Math.min(...cost[i]);
      for (let j = 0; j < n; j++) {
        cost[i][j] -= min;
      }
    }

    // Step 2: Subtract column minima
    for (let j = 0; j < n; j++) {
      const min = Math.min(...cost.map(row => row[j]));
      for (let i = 0; i < n; i++) {
        cost[i][j] -= min;
      }
    }

    const assignments = new Array(n).fill(-1);

    // Find matches using augmenting paths
    const visitedPieces = new Array(n).fill(false);
    for (let player = 0; player < n; player++) {
      this.findAugmentingPath(cost, player, visitedPieces, assignments);
      visitedPieces.fill(false);
    }

    return assignments;
  }

  private findAugmentingPath(
    cost: number[][],
    currentPlayer: number,
    visitedPieces: boolean[],
    assignments: number[],
  ): boolean {
    for (let pieceId = 0; pieceId < cost.length; pieceId++) {
      if (cost[currentPlayer][pieceId] === 0 && !visitedPieces[pieceId]) {
        visitedPieces[pieceId] = true;

        if (
          assignments[pieceId] === -1 ||
          this.findAugmentingPath(cost, assignments[pieceId], visitedPieces, assignments)
        ) {
          assignments[pieceId] = currentPlayer;
          return true;
        }
      }
    }
    return false;
  }
}
