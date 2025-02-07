# Project: Genetic Cake Cutting

## Description

This project implements an algorithm based on genetic techniques for the fair division of a discrete "cake" among
multiple players, ensuring an envy-free distribution. It is based on the theory presented in the paper _Envy-free
division of discrete cakes_ by Javier Marenco and Tomás Tetzlaff.

## Context

The cake-cutting problem is a fair allocation problem where a divisible resource must be distributed among several
players with different valuations for each part of the resource. In this case, the "cake" is discrete, composed of
"atoms" representing indivisible units valued differently by each player.

The goal is to achieve an allocation that satisfies the **envy-freeness** property, meaning no player prefers another
player's portion over their own.

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

## Usage

Run the following command to start the program:

```sh
npm start
```

This will execute the allocation algorithm and display the results in the console.

To run tests:

```sh
npm test
```

## Algorithm Functionality

The algorithm is implemented as a **genetic algorithm** that evolves a population of candidate solutions to find an
envy-free allocation. The key steps include:

1. **Initialization**: A population of possible cake divisions is generated randomly.
2. **Selection**: The best individuals (allocations) are chosen based on a fitness function that evaluates fairness.
3. **Crossover**: New allocations are created by combining parts of selected individuals.
4. **Mutation**: Small changes are introduced in the allocations to maintain diversity and explore new solutions.
5. **Evaluation**: Each allocation is assessed based on envy-freeness and fairness criteria.
6. **Iteration**: Steps 2-5 are repeated until an optimal allocation is found or a stopping condition is met.

## References

- Marenco, J., & Tetzlaff, T. (2013). *Envy-free division of discrete cakes*. Discrete Applied Mathematics, 163(Part 2),
  233-244. [DOI: 10.1016/j.dam.2013.06.032](https://doi.org/10.1016/j.dam.2013.06.032)
