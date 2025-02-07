import { AlgorithmConfig, CakeCuttingGeneticAlgorithm } from './cake-cutting/algorithm';
import { PlayerValuations } from './cake-cutting/player-valuations';
import { ProblemInstance } from './cake-cutting/types';

// Create players with their valuations
const playerValuations = [
  new PlayerValuations([0.2, 0.0, 0.0, 0.3, 0.5, 0.0, 0.0]),      // Player 1 values atoms 0, 3 and 4
  new PlayerValuations([0.0, 0.4, 0.3, 0.0, 0.0, 0.3, 0.0]),      // Player 2 values atoms 1, 2 and 5
  new PlayerValuations([0.0, 0.0, 0.0, 0.0, 0.0, 0.4, 0.6])       // Player 3 values atoms 5 and 6
];

// Define the problem
const cuttingProblemInstance: ProblemInstance = { playerValuations };

// Define genetic algorithm configuration
const algorithmConfig: AlgorithmConfig = {
  populationSize: 100,
  mutationRate: 0.1
};

// Create genetic algorithm instance
const geneticAlgorithm = new CakeCuttingGeneticAlgorithm(cuttingProblemInstance, algorithmConfig);

// Run evolution
const generations = 1000;
const solution = geneticAlgorithm.evolve(generations);
console.log('Best solution found:', solution);

// Evaluate the solution to see detailed piece values
const evaluation = geneticAlgorithm.evaluateSolution(solution.chromosome);

console.log('\nPieces created by the cuts:');
evaluation.pieces.forEach((piece, index) => {
  console.log(`Piece ${index + 1}: atoms ${piece[0]} to ${piece[1]}`);
});

console.log('\nHow each player values each piece:');
evaluation.playerEvaluations.forEach((playerEvals, playerIndex) => {
  console.log(`\nPlayer ${playerIndex + 1}:`);
  playerEvals.forEach((value, pieceIndex) => {
    const isAssigned = evaluation.assignments[playerIndex] === pieceIndex;
    console.log(`  Piece ${pieceIndex + 1}: ${(value * 100).toFixed(1)}% of total value ${isAssigned ? '(ASSIGNED)' : ''}`);
  });
});

console.log('\nFinal assignments:');
evaluation.assignments.forEach((pieceIndex, playerIndex) => {
  console.log(`Player ${playerIndex + 1} gets piece ${pieceIndex + 1} (atoms ${evaluation.pieces[pieceIndex][0]} to ${evaluation.pieces[pieceIndex][1]})`);
});
