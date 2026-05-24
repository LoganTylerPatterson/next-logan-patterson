# Deep Dive: The Wires Generator (V1)

If you've ever tried to write a puzzle generator, you probably started by placing dots on a grid and trying to connect them. **That is the hardest way to do it.** You'll almost always end up with a board where one path blocks another, making the puzzle impossible.

This generator (V1) uses a **"Backward Construction"** strategy. Instead of trying to solve a puzzle, it starts with a solved board and makes it messy.

---

## 1. The Core Concept: "The Lego Library" (MITM)

The most complex part of this code is the `Mitm` class. MITM stands for **Meet-in-the-Middle**. 

Imagine you are trying to find a path from Point A to Point B. Instead of searching the whole world, you:
1.  Start at Point A and draw every possible "squiggle" that is 5 steps long.
2.  Start at Point B and draw every possible "squiggle" that is 5 steps long.
3.  Check if any squiggle from A meets a squiggle from B in the middle.

Our generator does this **before the game even starts**. It builds a "Library" of thousands of valid, non-overlapping path segments (we call them "wiggles"). When the generator needs a path, it doesn't "calculate" one; it just looks in its library for a wiggle that fits the gap.

---

## 2. Step 1: The Invisible 2x Grid

This is where most people get stuck. If you have a 5x5 game board, the generator actually works on an **11x11 internal grid**.

**Why?** 
In Numberlink, paths don't just sit in cells; they exist *between* cells too. 
*   In the game, you see: `(Cell A) -- (Cell B)`
*   The generator sees: `(Node) -- (Path) -- (Node)`

By doubling the grid size (2n + 1), the generator can treat "paths" and "cells" as the same kind of object. It ensures that two paths never accidentally "touch" or cross because there is always a "gap" row/column between them in the internal math.

---

## 3. Advanced: The MITM Engine (How it actually works)

If you look at the `Mitm` class, it looks like a mess of recursion and math. Let's break down the "Magic" of the path lookup.

### A. The Language of Paths
The generator doesn't use X/Y coordinates to describe a path. It uses **Directions**:
*   `T`: Straight (Take two steps)
*   `L`: Left turn
*   `R`: Right turn

A path is just a string of these letters, like `TRTL`. This makes the paths **position-independent**. A `TRTL` wiggle is the same shape whether it starts at (0,0) or (10,10).

### B. The Recursive Explorer (`_goodPaths`)
When the app starts, it calls `prepare(budget)`. This is a recursive function that crawls every possible path until it runs out of "money" (the budget).
*   Turning costs more than going straight.
*   The `seen` Set prevents the path from ever crossing itself (illegal).
*   Every time it reaches a new spot, it saves that path into a "Dictionary" (`inv`).

### C. The Normalization Magic (`unrotate`)
This is the hardest part to grasp. Imagine you are at `(2, 2)` facing **South**, and you want to reach `(4, 0)` facing **West**.
How do you find a path in your library for that?

The library only stores paths that start at `(0, 0)` facing **North**.
The `unrotate` function mathematically "spins" your requested destination so it looks like it's relative to a North-facing start. 

> **Analogy:** It's like having a map of a house. Instead of having 4 maps (one for each way you might be facing when you enter the front door), you just have one map, and you physically rotate your body to match it.

### D. The "Lookup" (`_lookup`)
When the generator is stuck in a corner and needs to reach a specific cell, it asks:
*"Hey library, if I were at (0,0) facing North, what path would end at [Relative X, Relative Y] facing [Relative Direction]?"*

Because we pre-computed everything, the library answers **instantly**. This is why the generator is so fast despite creating incredibly complex puzzles.

---

## 4. Step 2: The Skeleton (Side Paths)

The generator starts by building a "frame." 
1.  It picks a random wiggle from the library and attaches it to the **left side** of the board.
2.  It picks another wiggle and attaches it to the **right side**.

Now we have two long, wiggly lines. This is a valid puzzle, but it's too simple. It's just two lines!

---

## 5. Step 3: Loop Injection (The "Spaghetti" Phase)

To make the puzzle hard, we need to fill the empty space with more paths. We do this by **injecting loops**.

1.  The generator picks a random spot on an existing path.
2.  It looks for a "Loop" (a wiggle that starts and ends in the same place) from its library.
3.  It tries to "staple" this loop onto the existing path.

Imagine you have a straight string. You cut it, tie a circular loop of string into the gap, and now you have a string with a big "bulge" in it. If you do this hundreds of times, your simple line turns into a tangled mess of spaghetti that fills the whole board.

---

## 6. Step 4: The Quality Judge (The "No-Nos")

Not every messy board is a *good* puzzle. The generator runs three strict tests before it lets you play:

### 1. No Isolated Loops
If a loop didn't get "stapled" to a path properly, it's just a circle floating in space. A player can't connect to a circle! We use **Union-Find** (a math tool that tracks which dots are connected) to make sure every single segment is attached to exactly two endpoints.

### 2. The "No Length 2" Rule (The Neighbor Rule)
If two endpoints of the same color are sitting right next to each other, the path is only 1 block long. That's a boring puzzle! The generator rejects any board where a path's "Start" is touching its "End."

### 3. No Self-Touching (The "Triple Neighbor" Rule)
In a good Wires puzzle, a path shouldn't "hug" itself. If a path makes a U-turn so tight that one cell is touching three other cells of the same color, it's rejected. This keeps the paths "clean" and ensures there aren't weird, ambiguous ways to solve it.
