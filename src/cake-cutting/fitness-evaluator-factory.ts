import { IFitnessEvaluator, FitnessEvaluator } from './fitness-evaluator';

export class FitnessEvaluatorFactory {
  private static _evaluator: IFitnessEvaluator;

  public static create(): IFitnessEvaluator {
    const evaluator = this._evaluator ?? new FitnessEvaluator();
    return evaluator;
  }

  // Only available for testing
  public static setEvaluator(evaluator: IFitnessEvaluator): void {
    if (process.env.NODE_ENV === 'test') {
      this._evaluator = evaluator;
    }
  }
}
