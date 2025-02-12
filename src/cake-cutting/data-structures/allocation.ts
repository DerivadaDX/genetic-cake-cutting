import { Piece } from './piece';

export class Allocation {
  public readonly pieces: Piece[];
  public readonly assignments: number[];
  public readonly playerEvaluations: number[][];

  constructor(pieces: Piece[], assignments: number[], playerEvaluations: number[][]) {
    this.pieces = pieces;
    this.assignments = assignments;
    this.playerEvaluations = playerEvaluations;
  }
}
