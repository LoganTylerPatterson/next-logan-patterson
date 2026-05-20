"use client"
import { useState, useEffect, useCallback } from 'react';

const FlowGame = ({ difficulty, onRestart }) => {
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

	const createRandomHamiltonianPath = useCallback((size) => {
		let path = [];
		const visited = new Set();

		const shuffleDirections = () => {
			const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
			for (let i = dirs.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[dirs[i], dirs[j]] = [dirs[j], dirs[i]];
			}
			return dirs;
		};

		const buildPath = (x, y) => {
			path.push([x, y]);
			visited.add(`${x}, ${y}`);

			if (path.length === size * size) return true;

			const directions = shuffleDirections();

			for (const [dx, dy] of directions) {
				const nx = x + dx;
				const ny = y + dy;
				if (isValidCell(nx, ny, size) && !visited.has(`${nx}, ${ny}`)) {
					if (buildPath(nx, ny)) return true;
				}
			}

			path.pop();
			visited.delete(`${x}, ${y}`);
			return false;
		}

		while (true) {
			const startX = Math.floor(Math.random() * size);
			const startY = Math.floor(Math.random() * size);
			if (buildPath(startX, startY)) break;
			path = [];
			visited.clear()
		}

		return path;
	}, [isValidCell])

	const splitPathIntoSegments = useCallback((fullPath, numColors) => {
		const minSegmentLength = 2;
		const totalCells = fullPath.length;
		let remaining = totalCells - numColors * minSegmentLength;

		const segmentLengths = Array(numColors).fill(minSegmentLength);
		while (remaining > 0) {
			segmentLengths[Math.floor(Math.random() * numColors)]++;
			remaining--;
		}

		let currentIndex = 0;
		return segmentLengths.map(length => {
			const segment = fullPath.slice(currentIndex, currentIndex + length);
			currentIndex += length;
			return {
				path: segment,
				start: segment[0],
				end: segment[segment.length - 1]
			};
		});
	}, []);

	const initializeGame = useCallback(() => {
		const { size, colors: numColors } = DIFFICULTY_SETTINGS[difficulty];
		const hamiltonianPath = createRandomHamiltonianPath(size);
		const colorSegments = splitPathIntoSegments(hamiltonianPath, numColors);
		const newColors = Array.from({ length: numColors }, (_, i) =>
			`hsl(${(i * 360) / numColors}, 70%, 60%)`
		);

		const newGrid = Array.from({ length: size }, () => Array(size).fill(null));
		
		colorSegments.forEach((seg, i) => {
			const [startRow, startCol] = seg.start;
			const [endRow, endCol] = seg.end;
			
			// Set the start and end points in the grid
			newGrid[startRow][startCol] = newColors[i];
			newGrid[endRow][endCol] = newColors[i];
		});
		
		setColors(newColors);
		setGrid(newGrid);
		setSolutionSegments(colorSegments.map((seg, i) => ({
			...seg,
			color: newColors[i]
		})));
		setColorPaths({});
		setSelectedColor(null);
		setCurrentPath([]);
	}, [difficulty, createRandomHamiltonianPath, splitPathIntoSegments]);

	useEffect(() => {
		if (grid.length <= 0 || grid.some(row => row.some(cell => cell === null))) {
			return;
		}
		setTimeout(() => {
			alert("You Won!");
			initializeGame();
		}, 300);
	}, [grid])

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

	const pathToSvg = (path, color, opacity = 1) => {
		if (!path || path.length < 2) return null;
		const toPoint = ([row, col]) => `${col + 0.5},${row + 0.5}`;
		const d = path.map((pt, i) => `${i === 0 ? 'M' : 'L'}${toPoint(pt)}`).join(' ');

		return (
			<path
				key={`${color}-${opacity}-${path.length}`}
				d={d}
				fill="none"
				stroke={color}
				strokeWidth={0.38}
				strokeLinecap="round"
				strokeLinejoin="round"
				opacity={opacity}
				filter="url(#glow)"
			/>
		);
	};

	const committedLines = Object.entries(colorPaths).map(([color, path]) => pathToSvg(path, color, 0.92));
	const activeLine = selectedColor ? pathToSvg(currentPath, selectedColor, 0.75) : null;

	return (
		<div className="flex flex-col items-center gap-4 p-5 bg-slate-900/90 rounded-3xl shadow-2xl border border-slate-600/30 backdrop-blur-sm">
			<div className="text-slate-400 text-xs tracking-[0.25em] uppercase font-medium">Connect the dots</div>
			<div
				className="relative grid touch-none select-none"
				style={{
					gridTemplateColumns: `repeat(${size}, 1fr)`,
					width: `${boardSizeVmin}vmin`,
					height: `${boardSizeVmin}vmin`,
					maxWidth: '92vw',
					maxHeight: '92vw',
				}}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				onPointerDown={handleTouchStart}
				onPointerMove={handleTouchMove}
				onPointerUp={handleTouchEnd}
			>
				<svg
					className="absolute inset-0 pointer-events-none z-10"
					viewBox={`0 0 ${size} ${size}`}
					preserveAspectRatio="xMidYMid meet"
					style={{ width: '100%', height: '100%' }}
				>
					<defs>
						<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
							<feGaussianBlur stdDeviation="0.12" result="blur" />
							<feMerge>
								<feMergeNode in="blur" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</defs>
					{committedLines}
					{activeLine}
				</svg>
				{grid.map((row, i) =>
					row.map((cell, j) => {
						const inActive = currentPath.some(([r, c]) => r === i && c === j);
						const isEndpoint = cell && isEndpointCell(i, j, cell);
						return (
							<div key={`${i}-${j}`} className="relative aspect-square p-[5%]">
								<div
									className={`w-full h-full rounded-xl transition-colors duration-150 ${
										inActive
											? 'bg-slate-700/90 border border-slate-500/80'
											: 'bg-slate-800/60 border border-slate-700/50'
									}`}
								/>
								{isEndpoint && (
									<div
										className="absolute inset-0 flex items-center justify-center z-20"
									>
										<div
											className="w-[42%] h-[42%] rounded-full border-2 border-white/60"
											style={{
												backgroundColor: cell,
												boxShadow: `0 0 12px ${cell}99, inset 0 1px 2px rgba(255,255,255,0.3)`
											}}
										/>
									</div>
								)}
							</div>
						);
					})
				)}
			</div>
			<button
				onClick={onRestart}
				className="mt-1 px-5 py-2 rounded-xl bg-slate-700/80 hover:bg-slate-600 text-slate-300 text-xs tracking-wider uppercase"
			>
				Back
			</button>
		</div>
	);
}

export default FlowGame;
