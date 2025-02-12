export class CakeCuttingSolution {
  public readonly pieces: [number, number][];
  public readonly playerEvaluations: number[][];
  public readonly assignments: number[];

  constructor(pieces: [number, number][], playerEvaluations: number[][], assignments: number[]) {
    this.pieces = pieces;
    this.playerEvaluations = playerEvaluations;
    this.assignments = assignments;
  }
}
