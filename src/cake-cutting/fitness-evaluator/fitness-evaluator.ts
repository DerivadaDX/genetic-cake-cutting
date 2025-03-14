import { Piece, ProblemInstance } from '../data-structures';
import { Assignment, HungarianAlgorithmSolverFactory, IHungarianAlgorithmSolver } from '../hungarian-algorithm';
import { Individual } from '../individual';
import { IFitnessEvaluator } from './fitness-evaluator-interface';

export class FitnessEvaluator implements IFitnessEvaluator {
  private readonly hungarianSolver: IHungarianAlgorithmSolver;

  constructor() {
    this.hungarianSolver = HungarianAlgorithmSolverFactory.create();
  }

  public evaluate(problem: ProblemInstance, individual: Individual): number {
    const pieces: Piece[] = this.getPiecesFromCutPositions(individual.chromosome, problem.numberOfAtoms);
    const valuationMatrix: number[][] = this.createValuationMatrix(pieces, problem);
    const assignments: Assignment[] = this.hungarianSolver.solveMaximizationProblem(valuationMatrix);

    // Calculate total satisfaction based on optimal assignments
    const fitness = assignments.reduce(
      (sum, assignment) => sum + valuationMatrix[assignment.player][assignment.portion],
      0,
    );
    return fitness;
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
}
