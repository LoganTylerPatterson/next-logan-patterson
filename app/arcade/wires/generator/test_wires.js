import { Mitm, generatePuzzle, formatPuzzle } from './generator.js';
import { solve } from '../solver/solver.js';

/**
 * Integrated Test using the Python-based Generator (No Length 2 paths)
 */

console.log('Preprocessing MITM (this may take a second)...');
const mitm = new Mitm(2, 1);
mitm.prepare(10);

function runTest(width = 10, height = 10) {
  console.log(`\n--- Wires Test (${width}x${height}) - Python Algorithm ---`);

  // 1. Generate a puzzle (generator.js strictly forbids adjacent endpoints)
  console.log('[1] Generating Puzzle...');
  const grid = generatePuzzle(width, height, mitm, 3, 6);
  const puzzle = formatPuzzle(grid);

  console.log('Generated Puzzle Grid:');
  puzzle.cells.forEach(row => {
    console.log(row.map(c => (c === 0 ? '.' : c)).join(' '));
  });

  // 2. Prepare for solver
  const flatTable = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const val = puzzle.cells[y][x];
      flatTable.push(val === 0 ? '.' : String.fromCharCode(64 + val));
    }
  }

  // 3. Solve the puzzle
  console.log('\n[2] Solving Puzzle...');
  const startTime = Date.now();
  const solution = solve(width, height, flatTable);
  const duration = Date.now() - startTime;

  if (solution) {
    console.log(`Solved in ${duration}ms!`);
    console.log('\nTube Representation:');
    solution.tubes.forEach(row => console.log(row));
  } else {
    console.log('No solution found.');
  }
}

runTest(5, 5);
runTest(6, 6);
