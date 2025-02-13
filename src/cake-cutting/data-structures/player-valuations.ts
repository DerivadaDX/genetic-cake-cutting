import { Piece } from './piece';

export class PlayerValuations {
  private readonly _valuations: number[];

  constructor(valuations: number[]) {
    if (!valuations.every(v => v >= 0 && v <= 1)) {
      throw new Error('All valuations must be between 0 and 1');
    }

    // Validate that values sum to 1 (with small epsilon for floating point arithmetic)
    const sum = valuations.reduce((a, b) => a + b, 0);
    const epsilon = 1e-10;
    if (Math.abs(sum - 1) > epsilon) {
      throw new Error('Valuations must sum exactly to 1');
    }

    this._valuations = [...valuations];
  }

  get valuations(): number[] {
    return [...this._valuations];
  }

  get numberOfValuations(): number {
    return this._valuations.length;
  }

  public getValuationAt(index: number): number {
    if (index < 0 || index >= this._valuations.length) {
      throw new Error('Valuation index out of bounds');
    }

    const valuation = this._valuations[index];
    return valuation;
  }

  public getValuationForPiece(piece: Piece): number {
    if (piece.start < 0 || piece.end > this._valuations.length) {
      throw new Error('Piece indices out of bounds');
    }

    if (piece.start > piece.end) {
      throw new Error('Invalid piece: start must be less than or equal to end');
    }

    const valuationForPiece = this._valuations
      .slice(piece.start, piece.end)
      .reduce((sum, value) => sum + value, 0);
    return valuationForPiece;
  }
}
