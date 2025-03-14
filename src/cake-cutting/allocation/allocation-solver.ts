import { Piece, ProblemInstance } from '../data-structures';
import { Assignment, HungarianAlgorithmSolverFactory, IHungarianAlgorithmSolver } from '../hungarian-algorithm';
import { Individual } from '../individual';
import { Allocation } from './allocation';
import { IAllocationSolver } from './allocation-solver-interface';

export class AllocationSolver implements IAllocationSolver {
  private readonly hungarianSolver: IHungarianAlgorithmSolver;

  constructor() {
    this.hungarianSolver = HungarianAlgorithmSolverFactory.create();
  }

  public solve(individual: Individual, problem: ProblemInstance): Allocation {
    const pieces: Piece[] = this.getPiecesFromCutPositions(individual.chromosome, problem.numberOfAtoms);
    const valuationMatrix: number[][] = this.createValuationMatrix(pieces, problem);
    const assignments: Assignment[] = this.hungarianSolver.solveMaximizationProblem(valuationMatrix);
    const playerArray: number[] = this.convertAssignmentsToPlayerArray(assignments);

    // Get player valuation for each piece
    const playerEvaluations: number[][] = problem.playerValuations.map(player =>
      pieces.map(piece => player.getValuationForPiece(piece)),
    );

    const allocation = new Allocation(pieces, playerArray, playerEvaluations);
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

  private createValuationMatrix(pieces: Piece[], problem: ProblemInstance): number[][] {
    const valuationMatrix = problem.playerValuations.map(player =>
      pieces.map(piece => player.getValuationForPiece(piece)),
    );
    return valuationMatrix;
  }

  private convertAssignmentsToPlayerArray(assignments: Assignment[]): number[] {
    const playerArray = new Array(assignments.length).fill(0);
    assignments.forEach(assignment => {
      playerArray[assignment.player] = assignment.portion;
    });
    return playerArray;
  }
}
