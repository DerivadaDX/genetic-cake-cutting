export class Piece {
  private readonly _start: number;
  private readonly _end: number;

  constructor(start: number, end: number) {
    if (end < start) {
      throw new Error('End must be greater than or equal to start');
    }

    this._start = start;
    this._end = end;
  }

  get start(): number {
    return this._start;
  }

  get end(): number {
    return this._end;
  }
}
