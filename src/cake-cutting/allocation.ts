export class Allocation {
  public readonly pieces: [number, number][];
  public readonly assignments: number[];
  public readonly playerEvaluations: number[][];

  constructor(pieces: [number, number][], assignments: number[], playerEvaluations: number[][]) {
    this.pieces = pieces;
    this.assignments = assignments;
    this.playerEvaluations = playerEvaluations;
  }
}
