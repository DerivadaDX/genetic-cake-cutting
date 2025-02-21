import { AlgorithmConfig, CakeCuttingGeneticAlgorithm } from './cake-cutting/algorithm';
import { Atom, PlayerValuations, ProblemInstance } from './cake-cutting/data-structures';

// Create players with their valuations
const playerValuations = [
  new PlayerValuations([new Atom(1, 0.3), new Atom(6, 0.7)]),
  new PlayerValuations([new Atom(2, 0.1), new Atom(3, 0.9)]),
  new PlayerValuations([new Atom(7, 0.1), new Atom(4, 0.3), new Atom(8, 0.6)]),
  new PlayerValuations([new Atom(5, 1)]),
];

// Define the problem
const problemInstance = new ProblemInstance(playerValuations);

// Define genetic algorithm configuration
const algorithmConfig: AlgorithmConfig = {
  populationSize: 100,
  mutationRate: 0.1,
};

// Create genetic algorithm instance
const geneticAlgorithm = new CakeCuttingGeneticAlgorithm(problemInstance, algorithmConfig);

// Run evolution
const generations = 1000;
const allocation = geneticAlgorithm.evolve(generations);

console.log('\nPieces created by the cuts:');
allocation.pieces.forEach((piece, index) => {
  const message = `- Piece ${index + 1}: atoms ${piece.start} to ${piece.end}`;
  console.log(message);
});

// Calculate and display how each player values each piece
const playerEvaluations = playerValuations.map(player =>
  allocation.pieces.map(piece => player.getValuationForPiece(piece)),
);

console.log('\nHow each player values each piece:');
playerEvaluations.forEach((playerEvals, playerIndex) => {
  console.log(`- Player ${playerIndex + 1}:`);
  playerEvals.forEach((value, pieceIndex) => {
    const isAssigned = allocation.assignments[playerIndex] === pieceIndex;
    const message = `  - Piece ${pieceIndex + 1}: ${(value * 100).toFixed(1)}% of total value${isAssigned ? ' (ASSIGNED)' : ''}`;
    console.log(message);
  });
});

console.log('\nFinal assignments:');
allocation.assignments.forEach((pieceIndex, playerIndex) => {
  const message = `- Player ${playerIndex + 1} gets piece ${pieceIndex + 1} (atoms ${allocation.pieces[pieceIndex].start} to ${allocation.pieces[pieceIndex].end})`;
  console.log(message);
});
