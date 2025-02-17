import { Piece } from './piece';
import { Atom } from './atom';

export class PlayerValuations {
  private readonly _valuations: Atom[];

  constructor(valuations: Atom[]) {
    // Validate that values sum to 1 (with small epsilon for floating point arithmetic)
    const sum = valuations.reduce((acc, atom) => acc + atom.value, 0);
    const epsilon = 1e-10;
    if (Math.abs(sum - 1) > epsilon) {
      throw new Error('Valuations must sum exactly to 1');
    }

    const positions = valuations.map(atom => atom.position);
    if (new Set(positions).size !== positions.length) {
      throw new Error('Atom positions must be unique');
    }

    // Store valuations sorted by position
    this._valuations = [...valuations].sort((a, b) => a.position - b.position);
  }

  get valuations(): Atom[] {
    return [...this._valuations];
  }

  get numberOfValuations(): number {
    return this._valuations.length;
  }

  public getValuationAt(position: number): number {
    const atom = this._valuations.find(a => a.position === position);
    if (!atom) {
      throw new Error('No valuation found at position');
    }
    return atom.value;
  }

  public getValuationForPiece(piece: Piece): number {
    const start = this._valuations.findIndex(a => a.position === piece.start);
    const end = this._valuations.findIndex(a => a.position === piece.end);

    if (start === -1 || end === -1) {
      throw new Error('Piece bounds not found in valuations');
    }

    if (start > end) {
      throw new Error('Invalid piece: start must be less than or equal to end');
    }

    const valuationForPiece = this._valuations.slice(start, end).reduce((sum, atom) => sum + atom.value, 0);
    return valuationForPiece;
  }
}
