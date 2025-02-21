# Project: Genetic Cake Cutting

## Description

This project implements an algorithm based on genetic techniques for the fair division of a discrete "cake" among
multiple players, aiming for an envy-free distribution. It is based on the theory presented in the paper _Envy-free
division of discrete cakes_ by Javier Marenco and Tomás Tetzlaff.

## Context

The cake-cutting problem is a fair allocation problem where a discrete resource must be distributed among several
players with different valuations for each part of the resource. The "cake" is composed of indivisible "atoms" that
are valued differently by each player.

Each player's valuations for the atoms must sum to 1 (100%), representing their total value for the complete cake.

The goal is to achieve an allocation that satisfies the **envy-freeness** property, meaning no player prefers another
player's portion over their own.

## Project Structure

- `src/cake-cutting/` - Core algorithm implementation
  - `algorithm.ts` - Main genetic algorithm
  - `data-structures/` - Problem domain models (Atom, Piece, etc.)
  - `allocation/` - Allocation solver
  - `fitness-evaluator/` - Fitness function implementation
- `src/random-generator/` - Seeded random number generation
- `tests/` - Test suites

## Installation

To run the project, ensure you have [Node.js](https://nodejs.org/) installed and follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/your_user/genetic-cake-cutting.git
   cd genetic-cake-cutting
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Build the project:
   ```sh
   npm run build
   ```

## Usage

To run the program:

```sh
npm start
```

This will execute the genetic algorithm with a sample problem instance and display:

- The pieces created by the cuts
- How each player values each piece
- The final piece assignments
- The envy-freeness evaluation

For development with auto-reload:

```sh
npm run dev
```

To run the test suite:

```sh
npm test
```

To format the code using Prettier:

```sh
npm run format
```

## Algorithm Functionality

The algorithm is implemented as a **genetic algorithm** that evolves a population of candidate solutions to find an
envy-free allocation. The key steps include:

1. **Initialization**: A population of possible cake divisions is generated randomly.
2. **Selection**: The best individuals are chosen based on a fitness function that evaluates fairness.
3. **Crossover**: New allocations are created by combining parts of selected individuals.
4. **Mutation**: Small changes are introduced in the allocations to maintain diversity and explore new solutions.
5. **Evaluation**: Each allocation is assessed based on envy-freeness and fairness criteria.
6. **Iteration**: Steps 2-5 are repeated until an optimal allocation is found or a stopping condition is met.

## References

- Marenco, J., & Tetzlaff, T. (2013). _Envy-free division of discrete cakes_. Discrete Applied Mathematics, 163(Part 2),
  233-244. [DOI: 10.1016/j.dam.2013.06.032](https://doi.org/10.1016/j.dam.2013.06.032)
