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
  private readonly populationSize: number;
  private readonly numberOfCuts: number;
  private readonly mutationRate: number;
  private readonly numberOfAtoms: number;
  private readonly players: PlayerValuations[];
  private readonly random: IRandomGenerator;
  private readonly fitnessEvaluator: IFitnessEvaluator;
  private population: Individual[];

  constructor(problem: ProblemInstance, config: AlgorithmConfig) {
    const numberOfPlayers = problem.playerValuations.length;
    if (numberOfPlayers < 2) {
      throw new Error('Must have at least 2 players');
    }

    const numberOfAtoms = problem.playerValuations[0].valuations.length;
    if (numberOfAtoms < 1) {
      throw new Error('Must have at least 1 atom');
    }

    if (problem.playerValuations.some(player => player.numberOfValuations !== numberOfAtoms)) {
      throw new Error('All players must have valuations matching the number of atoms');
    }

    this.numberOfAtoms = numberOfAtoms;
    this.numberOfCuts = numberOfPlayers - 1;

    this.players = problem.playerValuations;
    this.mutationRate = config.mutationRate;
    this.populationSize = config.populationSize;
    this.random = RandomGeneratorFactory.create();
    this.fitnessEvaluator = FitnessEvaluatorFactory.create(this.players);

    this.population = [];
    this.initializePopulation();
  }

  public evolve(generations: number): Individual {
    for (let gen = 0; gen < generations; gen++) {
      const newPopulation: Individual[] = [];

      const bestIndividual = [...this.population].sort((a, b) => b.fitness - a.fitness)[0];
      newPopulation.push(bestIndividual);

      while (newPopulation.length < this.populationSize) {
        const parent1 = this.selection();
        const parent2 = this.selection();

        const child = parent1.crossover(parent2, this.numberOfAtoms, this.random);
        const mutatedChild = child.mutate(this.mutationRate, this.numberOfAtoms, this.random);

        // Calculate and set fitness for the new child
        const fitness = this.fitnessEvaluator.evaluate(mutatedChild);
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
    const playerEvaluations = this.players.map((_, playerIndex) =>
      pieces.map(piece => this.evaluatePieceForPlayer(piece, playerIndex)),
    );
    const assignments = this.assignPiecesToPlayers(playerEvaluations);

    const solution = new Allocation(pieces, assignments, playerEvaluations);
    return solution;
  }

  private initializePopulation(): void {
    for (let i = 0; i < this.populationSize; i++) {
      const cutSet = CutSet.createRandom(this.numberOfCuts, this.numberOfAtoms, this.random);
      const newIndividual = new Individual(cutSet);
      const fitness = this.fitnessEvaluator.evaluate(newIndividual);
      newIndividual.setFitness(fitness);
      this.population.push(newIndividual);
    }
  }

  private selection(): Individual {
    const tournamentSize = 3;
    let best: Individual = this.population[Math.floor(this.random.next() * this.populationSize)];

    for (let i = 0; i < tournamentSize - 1; i++) {
      const contestant = this.population[Math.floor(this.random.next() * this.populationSize)];
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
      value += this.players[playerIndex].getValuationAt(atomIndex);
    }
    return value;
  }

  private assignPiecesToPlayers(playerEvaluations: number[][]): number[] {
    // Initialize assignments with -1 (unassigned)
    const assignments = new Array(this.players.length).fill(-1);
    const assignedPieces = new Set<number>();

    // For each player
    for (let player = 0; player < this.players.length; player++) {
      let bestPiece = -1;
      let bestValue = -1;

      // Find the best unassigned piece for this player
      for (let piece = 0; piece < this.players.length; piece++) {
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
