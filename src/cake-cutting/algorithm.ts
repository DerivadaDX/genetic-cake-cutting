import { IRandomGenerator } from '../random-generator';
import { RandomGeneratorFactory } from '../random-generator-factory';
import { Allocation, CutSet, Piece, PlayerValuations, ProblemInstance } from './data-structures';
import { IFitnessEvaluator } from './fitness-evaluator';
import { FitnessEvaluatorFactory } from './fitness-evaluator-factory';
import { Individual } from './individual';

export type AlgorithmConfig = {
  populationSize: number;
  mutationRate: number;
};

export class CakeCuttingGeneticAlgorithm {
  private readonly numberOfAtoms: number;
  private readonly problem: ProblemInstance;
  private readonly config: AlgorithmConfig;
  private readonly random: IRandomGenerator;
  private readonly fitnessEvaluator: IFitnessEvaluator;

  private population: Individual[];

  constructor(problem: ProblemInstance, config: AlgorithmConfig) {
    const numberOfPlayers = problem.playerValuations.length;
    if (numberOfPlayers < 2) {
      throw new Error('Must have at least 2 players');
    }

    this.numberOfAtoms = problem.calculateNumberOfAtoms();
    if (this.numberOfAtoms < 1) {
      throw new Error('Must have at least 1 atom');
    }

    this.problem = problem;
    this.config = config;
    this.random = RandomGeneratorFactory.create();
    this.fitnessEvaluator = FitnessEvaluatorFactory.create();

    this.population = [];
    this.initializePopulation();
  }

  public evolve(generations: number): Individual {
    for (let gen = 0; gen < generations; gen++) {
      const newPopulation: Individual[] = [];

      const bestIndividual = [...this.population].sort((a, b) => b.fitness - a.fitness)[0];
      newPopulation.push(bestIndividual);

      while (newPopulation.length < this.config.populationSize) {
        const parent1 = this.selection();
        const parent2 = this.selection();

        const child = parent1.crossover(parent2, this.numberOfAtoms, this.random);
        const mutatedChild = child.mutate(this.config.mutationRate, this.numberOfAtoms, this.random);

        // Calculate and set fitness for the new child
        const fitness = this.fitnessEvaluator.evaluate(this.problem, mutatedChild);
        mutatedChild.setFitness(fitness);

        newPopulation.push(mutatedChild);
      }

      this.population = newPopulation;
    }

    const bestIndividual = [...this.population].sort((a, b) => b.fitness - a.fitness)[0];
    return bestIndividual;
  }

  public getAllocation(individual: Individual): Allocation {
    const pieces = this.getPiecesValues(individual.chromosome);
    const playerEvaluations = this.problem.playerValuations.map((_, playerIndex) =>
      pieces.map(piece => this.evaluatePieceForPlayer(piece, playerIndex)),
    );
    const assignments = this.assignPiecesToPlayers(playerEvaluations);

    const solution = new Allocation(pieces, assignments, playerEvaluations);
    return solution;
  }

  private initializePopulation(): void {
    const numberOfCuts = this.problem.playerValuations.length - 1;

    for (let i = 0; i < this.config.populationSize; i++) {
      const cutSet = CutSet.createRandom(numberOfCuts, this.numberOfAtoms, this.random);
      const newIndividual = new Individual(cutSet);
      const fitness = this.fitnessEvaluator.evaluate(this.problem, newIndividual);
      newIndividual.setFitness(fitness);
      this.population.push(newIndividual);
    }
  }

  private selection(): Individual {
    const tournamentSize = 3;
    let best: Individual = this.population[Math.floor(this.random.next() * this.config.populationSize)];

    for (let i = 0; i < tournamentSize - 1; i++) {
      const contestant = this.population[Math.floor(this.random.next() * this.config.populationSize)];
      if (contestant.fitness > best.fitness) {
        best = contestant;
      }
    }

    return best;
  }

  private getPiecesValues(chromosome: number[]): Piece[] {
    const pieces: Piece[] = [];

    // Create pieces from cuts
    let start = 0;
    for (const cut of chromosome) {
      pieces.push(new Piece(start, cut));
      start = cut;
    }
    // Add last piece
    pieces.push(new Piece(start, this.numberOfAtoms));

    return pieces;
  }

  private evaluatePieceForPlayer(piece: Piece, playerIndex: number): number {
    let value = 0;
    for (let atomIndex = piece.start; atomIndex < piece.end; atomIndex++) {
      value += this.problem.playerValuations[playerIndex].getValuationAt(atomIndex);
    }
    return value;
  }

  private assignPiecesToPlayers(playerEvaluations: number[][]): number[] {
    const numberOfPlayers = this.problem.playerValuations.length;
    // Initialize assignments with -1 (unassigned)
    const assignments = new Array(numberOfPlayers).fill(-1);
    const assignedPieces = new Set<number>();

    // For each player
    for (let player = 0; player < numberOfPlayers; player++) {
      let bestPiece = -1;
      let bestValue = -1;

      // Find the best unassigned piece for this player
      for (let piece = 0; piece < numberOfPlayers; piece++) {
        if (!assignedPieces.has(piece)) {
          const value = playerEvaluations[player][piece];
          if (value > bestValue) {
            bestValue = value;
            bestPiece = piece;
          }
        }
      }

      // Assign the best piece to this player
      assignments[player] = bestPiece;
      assignedPieces.add(bestPiece);
    }

    return assignments;
  }
}
