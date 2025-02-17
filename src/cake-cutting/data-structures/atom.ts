export class Atom {
  private _position: number;
  private _value: number;

  constructor(position: number, value: number) {
    if (!Number.isInteger(position) || position < 1) {
      throw new Error('Position must be a positive integer');
    }

    if (value < 0 || value > 1) {
      throw new Error('Value must be between 0 and 1');
    }

    this._position = position;
    this._value = value;
  }

  get position(): number {
    return this._position;
  }

  get value(): number {
    return this._value;
  }
}
