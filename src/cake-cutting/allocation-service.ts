import { Individual } from './individual';
import { ProblemInstance, Allocation, Piece } from './data-structures';

export interface IAllocationService {
  getAllocation(individual: Individual, problem: ProblemInstance): Allocation;
}

export class DefaultAllocationService implements IAllocationService {
  public getAllocation(individual: Individual, problem: ProblemInstance): Allocation {
    const pieces = this.getPiecesValues(individual.chromosome, problem.numberOfAtoms);

    // Get player valuation for each piece
    const playerEvaluations = problem.playerValuations.map(player =>
      pieces.map(piece => player.getValuationForPiece(piece)));

    // Simple sequential assignment: player i gets piece i
    const assignments = new Array(pieces.length).fill(0).map((_, index) => index);

    return new Allocation(pieces, assignments, playerEvaluations);
  }

  private getPiecesValues(chromosome: number[], numberOfAtoms: number): Piece[] {
    const pieces: Piece[] = [];

    // Create pieces from cuts
    let start = 0;
    for (const cut of chromosome) {
      pieces.push(new Piece(start, cut));
      start = cut;
    }
    // Add last piece
    pieces.push(new Piece(start, numberOfAtoms));

    return pieces;
  }
}
