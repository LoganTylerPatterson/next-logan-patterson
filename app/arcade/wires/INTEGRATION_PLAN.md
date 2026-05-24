# Integration Plan: Wires Generator V1

This plan outlines the steps to replace the current primitive Hamiltonian path generator in `wires_game.jsx` with the improved "Backward Construction" generator (`generator_v1`).

## 1. Library Initialization
The new generator relies on a pre-computed "Meet-in-the-Middle" (MITM) library to find valid path segments quickly.
- **Action:** Import `Mitm`, `generatePuzzle`, and `formatPuzzle` from `./generator/generator`.
- **Strategy:** Initialize the `Mitm` instance and call `prepare(10)` at the module level. This ensures the library is built once when the module is first loaded, preventing expensive re-calculation on every game reset.

## 2. Refactor `initializeGame`
The logic for creating a new puzzle will be simplified by using the V1 generator's high-level functions.
- **Generation:** Replace `createRandomHamiltonianPath` and `splitPathIntoSegments` with a call to `generatePuzzle(size, size, mitm, numColors, numColors)`.
- **Formatting:** Use `formatPuzzle(grid)` to transform the internal grid into a consumable `cells` matrix.
- **Color Mapping:** 
    - The `formatPuzzle(grid).cells` matrix contains integer IDs (`1, 2, 3...`) at endpoint locations and `0` for empty cells.
    - Generate an HSL color array based on the number of paths: `hsl((i * 360) / numPaths, 70%, 60%)`.
    - Map each integer ID from the generator to its corresponding HSL color (e.g., ID `1` maps to `colors[0]`).
- **Segment Reconstruction:** 
    - Scan the `cells` matrix to find all coordinates for each ID. Each ID will appear exactly twice (representing the two endpoints of a path).
    - Construct `solutionSegments` as an array of objects: `{ start: [r1, c1], end: [r2, c2], color: colors[id-1] }`.
    - Initialize the `newGrid` by placing the assigned HSL color at these `start` and `end` coordinates.

## 3. State & Validation Compatibility
- **Grid Setup:** The `newGrid` state will be initialized with HSL colors at the specific coordinates identified as endpoints by the generator.
- **Interactive State:** `colorPaths` and `currentPath` will be reset to empty objects/arrays to ensure a clean slate for the new puzzle.
- **UI Logic:** The existing `handleEndPath` and SVG rendering logic are compatible with the new generator's output as long as `solutionSegments` are correctly reconstructed.

## 4. Code Cleanup
- **Remove Obsolete Logic:** Delete the `createRandomHamiltonianPath` and `splitPathIntoSegments` helper functions.
- **Refine Dependencies:** Update `useCallback` and `useEffect` dependency arrays to reflect the removal of the old generation logic.
- **Maintain Helpers:** Keep `isValidCell` as it is still required for boundary detection during touch/mouse interactions.
