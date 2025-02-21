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
  private readonly config: AlgorithmConfig;
  private readonly problem: ProblemInstance;
  private readonly random: IRandomGenerator;
  private readonly fitnessEvaluator: IFitnessEvaluator;

  private population: Individual[];

  constructor(problem: ProblemInstance, config: AlgorithmConfig) {
    if (config.populationSize <= 0 || config.mutationRate < 0 || config.mutationRate > 1) {
      throw new Error('Invalid algorithm configuration values');
    }

    this.config = config;
    this.problem = problem;
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

        const child = parent1.crossover(parent2, this.problem.numberOfAtoms, this.random);
        const mutatedChild = child.mutate(this.config.mutationRate, this.problem.numberOfAtoms, this.random);

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

    // Get player valuation for each piece
    const playerEvaluations = this.problem.playerValuations.map(player =>
      pieces.map(piece => player.getValuationForPiece(piece)));

    // Simple sequential assignment: player i gets piece i
    const assignments = new Array(pieces.length).fill(0).map((_, index) => index);

    const solution = new Allocation(pieces, assignments, playerEvaluations);
    return solution;
  }

  private initializePopulation(): void {
    const numberOfCuts = this.problem.playerValuations.length - 1;

    for (let i = 0; i < this.config.populationSize; i++) {
      const cutSet = CutSet.createRandom(numberOfCuts, this.problem.numberOfAtoms, this.random);
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
    pieces.push(new Piece(start, this.problem.numberOfAtoms));

    return pieces;
  }
}
