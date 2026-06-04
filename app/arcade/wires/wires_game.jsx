"use client"
import { useState, useEffect, useCallback } from 'react';
import { Mitm, generatePuzzle, formatPuzzle } from './generator/generator';
import styles from './wires_game.module.css';
import { CornerUpLeft } from 'react-feather';

const mitm = new Mitm(2, 1);
mitm.prepare(10);

const WiresGame = ({ difficulty, onRestart }) => {
  const DIFFICULTY_SETTINGS = {
    easy: { size: 5, colors: 3 },
    medium: { size: 6, colors: 4 },
    hard: { size: 7, colors: 4 }
  };

  const [grid, setGrid] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [solutionSegments, setSolutionSegments] = useState([]);
  const [isTouching, setIsTouching] = useState(false);
  const [colorPaths, setColorPaths] = useState({});

  const isValidCell = useCallback((x, y, size) => {
    return x >= 0 && y >= 0 && x < size && y < size;
  }, []);

  const initializeGame = useCallback(() => {
    const { size, colors: numColors } = DIFFICULTY_SETTINGS[difficulty];
    const grid = generatePuzzle(size, size, mitm, numColors, numColors);
    const formattedPuzzle = formatPuzzle(grid);

    // Reconstruct segments from the generated grid
    const segmentMap = new Map();
    formattedPuzzle.cells.forEach((row, r) => {
      row.forEach((id, c) => {
        if (id > 0) {
          if (!segmentMap.has(id)) {
            segmentMap.set(id, { start: [r, c] });
          } else {
            segmentMap.get(id).end = [r, c];
          }
        }
      });
    });

    const colorSegments = Array.from(segmentMap.values());
    const numPaths = colorSegments.length;
    const newColors = Array.from({ length: numPaths }, (_, i) =>
      `hsl(${(i * 360) / numPaths}, 70%, 60%)`
    );

    const newGrid = Array.from({ length: size }, () => Array(size).fill(null));

    colorSegments.forEach((seg, i) => {
      const [startRow, startCol] = seg.start;
      const [endRow, endCol] = seg.end;
      seg.color = newColors[i];

      // Set the start and end points in the grid
      newGrid[startRow][startCol] = newColors[i];
      newGrid[endRow][endCol] = newColors[i];
    });

    setColors(newColors);
    setGrid(newGrid);
    setSolutionSegments(colorSegments);
    setColorPaths({});
    setSelectedColor(null);
    setCurrentPath([]);
  }, [difficulty]);

  useEffect(() => {
    if (grid.length <= 0) return;

    const allConnected = solutionSegments.length > 0 && solutionSegments.every(seg => {
      const path = colorPaths[seg.color];
      if (!path) return false;
      const start = path[0];
      const end = path[path.length - 1];
      const matchStart = (start[0] === seg.start[0] && start[1] === seg.start[1]) || (start[0] === seg.end[0] && start[1] === seg.end[1]);
      const matchEnd = (end[0] === seg.start[0] && end[1] === seg.start[1]) || (end[0] === seg.end[0] && end[1] === seg.end[1]);
      return matchStart && matchEnd;
    });

    const allCellsFilled = grid.every(row => row.every(cell => cell !== null));

    if (allConnected && allCellsFilled) {
      setTimeout(() => {
        alert("You Won!");
        initializeGame();
      }, 300);
    }
  }, [grid, colorPaths, solutionSegments, initializeGame]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const getEndpointType = useCallback((row, col, color) => {
    const solution = solutionSegments.find((segment) => segment.color === color);
    if (!solution) return null;

    if (solution.start[0] === row && solution.start[1] === col) return 'start';
    if (solution.end[0] === row && solution.end[1] === col) return 'end';
    return null;
  }, [solutionSegments]);

  const isEndpointCell = useCallback((row, col, color) => {
    return getEndpointType(row, col, color) !== null;
  }, [getEndpointType]);

  const handleStartPath = (row, col) => {
    const color = grid[row][col];
    if (color) {
      setSelectedColor(color);
      setCurrentPath([[row, col]]);
    }
  };

  const handleExtendPath = (row, col) => {
    if (!selectedColor) return;

    setCurrentPath((prev) => {
      if (prev.length === 0) return prev;

      const last = prev[prev.length - 1];
      const isAdjacent = Math.abs(row - last[0]) + Math.abs(col - last[1]) === 1;
      if (!isAdjacent) return prev;

      const secondLast = prev[prev.length - 2];
      if (secondLast && secondLast[0] === row && secondLast[1] === col) {
        return prev.slice(0, -1);
      }

      const alreadyInPath = prev.some(([r, c]) => r === row && c === col);
      if (alreadyInPath) return prev;

      const cellColor = grid[row][col];
      const isEndpoint = isEndpointCell(row, col, selectedColor);

      if (cellColor !== null && !isEndpoint) {
        return prev;
      }

      if (cellColor !== null && cellColor !== selectedColor) {
        return prev;
      }

      return [...prev, [row, col]];
    });
  }

  const handleEndPath = () => {
    if (currentPath.length > 1) {
      const solution = solutionSegments.find((s) => s.color === selectedColor);
      const startsAtStart = solution &&
        currentPath[0][0] === solution.start[0] &&
        currentPath[0][1] === solution.start[1];
      const startsAtEnd = solution &&
        currentPath[0][0] === solution.end[0] &&
        currentPath[0][1] === solution.end[1];
      const endsAtStart = solution &&
        currentPath[currentPath.length - 1][0] === solution.start[0] &&
        currentPath[currentPath.length - 1][1] === solution.start[1];
      const endsAtEnd = solution &&
        currentPath[currentPath.length - 1][0] === solution.end[0] &&
        currentPath[currentPath.length - 1][1] === solution.end[1];

      if ((startsAtStart && endsAtEnd) || (startsAtEnd && endsAtStart)) {
        commitPath();
      }
    }

    setSelectedColor(null);
    setCurrentPath([]);
  };

  const commitPath = () => {
    if (!selectedColor) return;

    const solution = solutionSegments.find((segment) => segment.color === selectedColor);
    if (!solution) return;

    setColorPaths((prev) => ({
      ...prev,
      [selectedColor]: currentPath
    }));

    const newGrid = Array.from({ length: grid.length }, () => Array(grid.length).fill(null));

    solutionSegments.forEach((segment) => {
      newGrid[segment.start[0]][segment.start[1]] = segment.color;
      newGrid[segment.end[0]][segment.end[1]] = segment.color;
    });

    const nextPaths = {
      ...colorPaths,
      [selectedColor]: currentPath
    };

    Object.entries(nextPaths).forEach(([color, path]) => {
      (path || []).forEach(([row, col]) => {
        newGrid[row][col] = color;
      });
    });

    setGrid(newGrid);
  };

  const getCellFromEvent = (e) => {
    const grid = e.currentTarget;
    const rect = grid.getBoundingClientRect();
    const size = DIFFICULTY_SETTINGS[difficulty].size;

    const clientX = e.touches?.[0]?.clientX || e.clientX;
    const clientY = e.touches?.[0]?.clientY || e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const cellSize = rect.width / size;
    const row = Math.floor(y / cellSize);
    const col = Math.floor(x / cellSize);

    return isValidCell(row, col, size) ? { row, col } : null;
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsTouching(true);
    const cell = getCellFromEvent(e);
    if (cell) handleStartPath(cell.row, cell.col);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (!isTouching) return;
    const cell = getCellFromEvent(e);
    if (cell) handleExtendPath(cell.row, cell.col);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    setIsTouching(false);
    handleEndPath();
  };

  const size = DIFFICULTY_SETTINGS[difficulty].size;
  const boardSizeVmin = Math.min(78, size * 13);

  const pathToSvg = (path, color, opacity = 1, useGlow = true) => {
    if (!path || path.length < 2) return null;
    const toPoint = ([row, col]) => `${col + 0.5},${row + 0.5}`;
    const d = path.map((pt, i) => `${i === 0 ? 'M' : 'L'}${toPoint(pt)}`).join(' ');

    return (
      <path
        key={`${color}-${opacity}-${path.length}`}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={0.42}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity}
        filter={useGlow ? "url(#glow)" : undefined}
      />
    );
  };

  const committedLines = Object.entries(colorPaths).map(([color, path]) => pathToSvg(path, color, 0.95));
  const activeLine = selectedColor ? pathToSvg(currentPath, selectedColor, 0.8, true) : null;

  return (
    <>
      <div className={styles.container}>
        {/* Scanline effect */}
        <div className={styles.scanlineOverlay}></div>

        <div
          className={styles.board}
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            width: `${boardSizeVmin}vmin`,
            height: `${boardSizeVmin}vmin`,
            maxWidth: '92vw',
            maxHeight: '92vw',
            backgroundImage: 'radial-gradient(circle at center, #111827 0%, #0a0f1a 100%)',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handleTouchStart}
          onPointerMove={handleTouchMove}
          onPointerUp={handleTouchEnd}
        >
          {/* Subtle grid pattern */}
          <div className={styles.gridPattern}
            style={{
              backgroundImage: `linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)`,
              backgroundSize: `${100 / size}% ${100 / size}%`
            }}></div>

          {grid.map((row, i) =>
            row.map((cell, j) => {
              const inActive = currentPath.some(([r, c]) => r === i && c === j);
              const isEndpoint = cell && isEndpointCell(i, j, cell);
              return (
                <div key={`${i}-${j}`} className={styles.cell}>
                  <div
                    className={`${styles.cellFill} ${inActive ? styles.cellFillActive : styles.cellFillInactive}`}
                  />
                  {isEndpoint && (
                    <div
                      className={styles.endpointWrapper}
                    >
                      <div
                        className={styles.endpointCore}
                        style={{
                          backgroundColor: cell,
                          boxShadow: `0 0 20px ${cell}, 0 0 40px ${cell}66, inset 0 0 10px rgba(255,255,255,0.8)`,
                          filter: 'brightness(1.2) contrast(1.2)'
                        }}
                      />
                      <div className={styles.endpointPulse}
                        style={{ borderColor: cell }}></div>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <svg
            className={styles.pathsSvg}
            viewBox={`0 0 ${size} ${size}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="glow" filterUnits="userSpaceOnUse" x="-1" y="-1" width={size + 2} height={size + 2}>
                <feGaussianBlur stdDeviation="0.15" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="2" />
                </feComponentTransfer>
              </filter>
            </defs>
            {committedLines}
            {activeLine}
          </svg>
        </div>
      </div>
    </>
  );
}

export default WiresGame;
