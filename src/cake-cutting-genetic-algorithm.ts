export default class CakeCuttingGeneticAlgorithm {
  private readonly populationSize: number;
  private readonly numberOfCuts: number;
  private readonly mutationRate: number;
  private readonly numberOfAtoms: number;
  private readonly players: Player[];
  private population: Individual[];

  constructor(
    numberOfPlayers: number,
    numberOfAtoms: number,
    players: Player[],
    populationSize: number = 100,
    mutationRate: number = 0.1
  ) {
    // Validate inputs
    if (numberOfPlayers !== players.length) {
      throw new Error('Number of players must match length of players array');
    }

    if (players.some(player => player.valuations.length !== numberOfAtoms)) {
      throw new Error('All players must have valuations matching the number of atoms');
    }

    if (numberOfPlayers < 2) {
      throw new Error('Must have at least 2 players');
    }

    if (numberOfAtoms < 1) {
      throw new Error('Must have at least 1 atom');
    }

    this.populationSize = populationSize;
    this.numberOfCuts = numberOfPlayers - 1; // N players need N-1 cuts
    this.mutationRate = mutationRate;
    this.numberOfAtoms = numberOfAtoms;
    this.players = players;
    this.population = [];
    this.initializePopulation();
  }

  private initializePopulation(): void {
    for (let i = 0; i < this.populationSize; i++) {
      const chromosome = this.generateRandomChromosome();
      this.population.push({
        chromosome,
        fitness: this.evaluateFitness(chromosome)
      });
    }
  }

  private generateRandomChromosome(): number[] {
    // Generate N-1 cuts positions in ascending order
    const cuts: number[] = [];
    for (let i = 0; i < this.numberOfCuts; i++) {
      // Generate positions between 0 and numberOfAtoms
      let position;
      do {
        position = Math.floor(Math.random() * (this.numberOfAtoms + 1));
      } while (cuts.includes(position));
      cuts.push(position);
    }
    return cuts.sort((a, b) => a - b);
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
          if (this.evaluatePieceForPlayer(otherPiece, i) >
            this.evaluatePieceForPlayer(playerPiece, i)) {
            fitness -= 1;
          }
        }
      }
    }

    return fitness;
  }

  private getPiecesValues(chromosome: number[]): [number, number][] {
    const pieces: [number, number][] = [];
    let start = 0;

    // Create pieces from cuts
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
    for (let i = piece[0]; i < piece[1]; i++) {
      value += this.players[playerIndex].valuations[i];
    }
    return value;
  }

  private crossover(parent1: number[], parent2: number[]): number[] {
    const crossoverPoint = Math.floor(Math.random() * this.numberOfCuts);
    const child = [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)];
    return child.sort((a, b) => a - b);
  }

  private mutate(chromosome: number[]): number[] {
    return chromosome.map(gene => {
      if (Math.random() < this.mutationRate) {
        const newPosition = Math.floor(Math.random() * (this.numberOfAtoms + 1));
        return newPosition;
      }
      return gene;
    }).sort((a, b) => a - b);
  }

  private selection(): Individual {
    // Tournament selection
    const tournamentSize = 3;
    let best: Individual = this.population[Math.floor(Math.random() * this.populationSize)];

    for (let i = 0; i < tournamentSize - 1; i++) {
      const contestant = this.population[Math.floor(Math.random() * this.populationSize)];
      if (contestant.fitness > best.fitness) {
        best = contestant;
      }
    }

    return best;
  }

  public evolve(generations: number): Individual {
    for (let gen = 0; gen < generations; gen++) {
      const newPopulation: Individual[] = [];

      // Elitism: keep the best individual
      const bestIndividual = [...this.population].sort((a, b) => b.fitness - a.fitness)[0];
      newPopulation.push(bestIndividual);

      // Generate new population
      while (newPopulation.length < this.populationSize) {
        const parent1 = this.selection();
        const parent2 = this.selection();

        let childChromosome = this.crossover(parent1.chromosome, parent2.chromosome);
        childChromosome = this.mutate(childChromosome);

        newPopulation.push({
          chromosome: childChromosome,
          fitness: this.evaluateFitness(childChromosome)
        });
      }

      this.population = newPopulation;
    }

    // Return best solution found
    return [...this.population].sort((a, b) => b.fitness - a.fitness)[0];
  }
}
