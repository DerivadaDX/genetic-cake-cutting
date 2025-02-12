import { IRandomGenerator } from '../random-generator';
import { RandomGeneratorFactory } from '../random-generator-factory';
import { Individual } from './individual';
import { PlayerValuations } from './player-valuations';
import { ProblemInstance } from './problem-instance';

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

        const evaluateFitness = this.evaluateFitness.bind(this);
        const child = parent1.crossover(parent2, evaluateFitness, this.random);
        const mutatedChild = child.mutate(this.mutationRate, evaluateFitness, this.random);
        newPopulation.push(mutatedChild);
      }

      this.population = newPopulation;
    }

    const bestIndividual = [...this.population].sort((a, b) => b.fitness - a.fitness)[0];
    return bestIndividual;
  }

  public evaluateSolution(cuts: number[]): {
    pieces: [number, number][];
    playerEvaluations: number[][];
    assignments: number[];
  } {
    const pieces = this.getPiecesValues(cuts);
    const playerEvaluations = this.players.map((_, playerIndex) =>
      pieces.map(piece => this.evaluatePieceForPlayer(piece, playerIndex)),
    );

    const assignments = this.assignPiecesToPlayers(playerEvaluations);

    return {
      pieces,
      playerEvaluations,
      assignments,
    };
  }

  private initializePopulation(): void {
    for (let i = 0; i < this.populationSize; i++) {
      const chromosome = this.generateRandomChromosome();
      const fitness = this.evaluateFitness(chromosome);
      const newIndividual = new Individual(chromosome, fitness, this.numberOfAtoms);
      this.population.push(newIndividual);
    }
  }

  private generateRandomChromosome(): number[] {
    // Create an array of all possible positions
    const positions = Array.from({ length: this.numberOfAtoms + 1 }, (_, i) => i);

    // Fisher-Yates shuffle, but only for the needed number of elements
    for (let i = 0; i < this.numberOfCuts; i++) {
      const randomIndex = i + Math.floor(this.random.next() * (positions.length - i));
      [positions[i], positions[randomIndex]] = [positions[randomIndex], positions[i]];
    }

    // Return the needed number of cuts, already sorted
    const selectedCuts = positions.slice(0, this.numberOfCuts);
    const sortedCuts = selectedCuts.sort((a, b) => a - b);
    return sortedCuts;
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

  private evaluateFitness(chromosome: number[]): number {
    let fitness = 0;
    const pieces = this.getPiecesValues(chromosome);

    // Calculate envy-freeness measure
    for (let i = 0; i < this.players.length; i++) {
      const playerPiece = pieces[i];
      // Check if player i envies any other player
      for (let j = 0; j < this.players.length; j++) {
        if (i !== j) {
          const otherPiece = pieces[j];
          // Add penalty if player i values player j's piece more than their own
          if (this.evaluatePieceForPlayer(otherPiece, i) > this.evaluatePieceForPlayer(playerPiece, i)) {
            fitness -= 1;
          }
        }
      }
    }

    return fitness;
  }

  private getPiecesValues(chromosome: number[]): [number, number][] {
    const pieces: [number, number][] = [];

    // Create pieces from cuts
    let start = 0;
    for (const cut of chromosome) {
      pieces.push([start, cut]);
      start = cut;
    }
    // Add last piece
    pieces.push([start, this.numberOfAtoms]);

    return pieces;
  }

  private evaluatePieceForPlayer(piece: [number, number], playerIndex: number): number {
    let value = 0;
    for (let atomIndex = piece[0]; atomIndex < piece[1]; atomIndex++) {
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
