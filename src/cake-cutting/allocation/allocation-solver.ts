import { Piece, ProblemInstance } from '../data-structures';
import { Individual } from '../individual';
import { Allocation } from './allocation';

export interface IAllocationSolver {
  solve(individual: Individual, problem: ProblemInstance): Allocation;
}

export class AllocationSolver implements IAllocationSolver {
  public solve(individual: Individual, problem: ProblemInstance): Allocation {
    const pieces = this.getPiecesFromCutPositions(individual.chromosome, problem.numberOfAtoms);

    // Get player valuation for each piece
    const playerEvaluations = problem.playerValuations.map(player =>
      pieces.map(piece => player.getValuationForPiece(piece)),
    );

    // Simple sequential assignment: player i gets piece i
    const assignments = new Array(pieces.length).fill(0).map((_, index) => index);

    const allocation = new Allocation(pieces, assignments, playerEvaluations);
    return allocation;
  }

  private getPiecesFromCutPositions(cutPositions: number[], numberOfAtoms: number): Piece[] {
    const pieces: Piece[] = [];

    // Create pieces from cuts
    let start = 0;
    for (const cut of cutPositions) {
      pieces.push(new Piece(start, cut));
      start = cut;
    }

    // Add last piece
    pieces.push(new Piece(start, numberOfAtoms));

    return pieces;
  }
}
