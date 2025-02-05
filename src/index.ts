// Example usage:
const numberOfPlayers = 3;
const numberOfAtoms = 7;

// Example players with their valuations for each atom
const players: Player[] = [
  { valuations: [0.2, 0, 0, 0.3, 0.5, 0, 0] },    // Player 1
  { valuations: [0, 0.4, 0.3, 0, 0, 0.3, 0] },    // Player 2
  { valuations: [0, 0, 0, 0, 0, 0.4, 0.6] }       // Player 3
];

const ga = new CakeCuttingGeneticAlgorithm(numberOfPlayers, numberOfAtoms, players);
const solution = ga.evolve(100);
console.log("Best solution found:", solution);
