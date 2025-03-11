import { Atom } from './atom';
import { Piece } from './piece';

export class PlayerValuations {
  private readonly _valuations: Atom[];

  constructor(valuations: Atom[]) {
    // Validate that values sum to 1 (with small epsilon for floating point arithmetic)
    const sum: number = valuations.reduce((acc, atom) => acc + atom.value, 0);
    const epsilon = 1e-10;
    if (Math.abs(sum - 1) > epsilon) {
      throw new Error('Valuations must sum exactly to 1');
    }

    const positions: number[] = valuations.map(atom => atom.position);
    if (new Set(positions).size !== positions.length) {
      throw new Error('Atom positions must be unique');
    }

    this._valuations = [...valuations].sort((a, b) => a.position - b.position);
  }

  get valuations(): Atom[] {
    return [...this._valuations];
  }

  get numberOfValuations(): number {
    return this._valuations.length;
  }

  public getValuationAt(position: number): number {
    const atom: Atom | undefined = this._valuations.find(a => a.position === position);
    if (!atom) {
      throw new Error('No valuation found at position');
    }
    return atom.value;
  }

  public getValuationForPiece(piece: Piece): number {
    const atomsInPiece: Atom[] = this._valuations.filter(
      atom => atom.position > piece.start && atom.position <= piece.end,
    );
    const valuationForPiece: number = atomsInPiece.reduce((sum, atom) => sum + atom.value, 0);
    return valuationForPiece;
  }
}
