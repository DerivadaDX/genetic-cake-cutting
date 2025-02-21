import { IRandomGenerator, RandomGeneratorFactory } from '../random-generator';
import { AlgorithmConfig } from './algorithm-config';
import { Allocation, AllocationSolverFactory, IAllocationSolver } from './allocation';
import { CutSet, ProblemInstance } from './data-structures';
import { FitnessEvaluatorFactory, IFitnessEvaluator } from './fitness-evaluator';
import { Individual } from './individual';

export class CakeCuttingGeneticAlgorithm {
  private readonly config: AlgorithmConfig;
  private readonly problem: ProblemInstance;
  private readonly random: IRandomGenerator;
  private readonly fitnessEvaluator: IFitnessEvaluator;
  private readonly allocationSolver: IAllocationSolver;

  private population: Individual[];

  constructor(problem: ProblemInstance, config: AlgorithmConfig) {
    if (config.populationSize <= 0 || config.mutationRate < 0 || config.mutationRate > 1) {
      throw new Error('Invalid algorithm configuration values');
    }

    this.config = config;
    this.problem = problem;
    this.random = RandomGeneratorFactory.create();
    this.fitnessEvaluator = FitnessEvaluatorFactory.create();
    this.allocationSolver = AllocationSolverFactory.create();

    this.population = [];
    this.initializePopulation();
  }

  public evolve(generations: number): Allocation {
    for (let gen = 0; gen < generations; gen++) {
      const newPopulation: Individual[] = [];

      const bestIndividual = [...this.population].sort((a, b) => b.fitness - a.fitness)[0];
      newPopulation.push(bestIndividual);

      while (newPopulation.length < this.config.populationSize) {
        const parent1 = this.selection();
        const parent2 = this.selection();

        const child = parent1.crossover(parent2, this.problem.numberOfAtoms, this.random);
        const mutatedChild = child.mutate(this.config.mutationRate, this.problem.numberOfAtoms, this.random);

        const fitness = this.fitnessEvaluator.evaluate(this.problem, mutatedChild);
        mutatedChild.setFitness(fitness);

        newPopulation.push(mutatedChild);
      }

      this.population = newPopulation;
    }

    const bestIndividual = [...this.population].sort((a, b) => b.fitness - a.fitness)[0];
    const allocation = this.allocationSolver.solve(bestIndividual, this.problem);
    return allocation;
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
}
