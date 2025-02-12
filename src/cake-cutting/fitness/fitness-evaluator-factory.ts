import { FitnessEvaluator, IFitnessEvaluator } from './fitness-evaluator';
import { PlayerValuations } from '../player-valuations';

export class FitnessEvaluatorFactory {
    private static _evaluator: IFitnessEvaluator;

    public static create(players: PlayerValuations[]): IFitnessEvaluator {
        const evaluator = this._evaluator ?? new FitnessEvaluator(players);
        return evaluator;
    }

    // Solo disponible para testing
    public static setEvaluator(evaluator: IFitnessEvaluator): void {
        if (process.env.NODE_ENV === 'test') {
            this._evaluator = evaluator;
        }
    }
}
