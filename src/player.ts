export default class Player {
  private readonly _valuations: number[];

  constructor(valuations: number[]) {
    this.validateValuations(valuations);
    this._valuations = [...valuations];
  }

  private validateValuations(valuations: number[]): void {
    // Validate that all values are between 0 and 1
    if (!valuations.every(v => v >= 0 && v <= 1)) {
      throw new Error('All valuations must be between 0 and 1');
    }

    // Validate that values sum to 1 (with small epsilon for floating point arithmetic)
    const sum = valuations.reduce((a, b) => a + b, 0);
    const epsilon = 1e-10;
    if (Math.abs(sum - 1) > epsilon) {
      throw new Error('Valuations must sum exactly to 1');
    }
  }

  get valuations(): number[] {
    return [...this._valuations];
  }

  get numberOfValuations(): number {
    return this._valuations.length;
  }

  getValuationAt(index: number): number {
    if (index < 0 || index >= this._valuations.length) {
      throw new Error('Valuation index out of bounds');
    }
    return this._valuations[index];
  }
}
