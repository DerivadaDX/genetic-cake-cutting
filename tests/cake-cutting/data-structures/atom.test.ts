import { Atom } from '../../../src/cake-cutting/data-structures/atom';

describe('Atom', () => {
  it('should create an atom with valid position and value', () => {
    const atom = new Atom(1, 0.5);
    expect(atom.position).toBe(1);
    expect(atom.value).toBe(0.5);
  });

  it('should throw error when position is zero', () => {
    expect(() => new Atom(0, 0.5)).toThrow('Position must be a positive integer');
  });

  it('should throw error when position is negative', () => {
    expect(() => new Atom(-1, 0.5)).toThrow('Position must be a positive integer');
  });

  it('should throw error when position is not an integer', () => {
    expect(() => new Atom(1.5, 0.5)).toThrow('Position must be a positive integer');
  });

  it('should throw error when value is less than 0', () => {
    expect(() => new Atom(1, -0.1)).toThrow('Value must be between 0 and 1');
  });

  it('should throw error when value is greater than 1', () => {
    expect(() => new Atom(1, 1.1)).toThrow('Value must be between 0 and 1');
  });
});
