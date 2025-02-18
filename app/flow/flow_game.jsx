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

	const handleStartPath = (row, col) => {
		const color = grid[row][col];
		if (color) {
			setSelectedColor(color);
			setCurrentPath([[row, col]]);
		}
	};

	const handleExtendPath = (row, col) => {
		if (!selectedColor) return;

		const last = currentPath[currentPath.length - 1];
		const isValid = (
			Math.abs(row - last[0]) + Math.abs(col - last[1]) === 1 &&
			!currentPath.some(([r, c]) => r === row && c === col)
		);

		if (isValid) {
			setCurrentPath(prev => [...prev, [row, col]]);
		}
	}

	const handleEndPath = () => {
		if (currentPath.length > 1) {
			// doesn't actually make sense to keep track of the entire solution segment, we really just want start and end colors to match
			const solution = solutionSegments.find(s => s.color === selectedColor);
			if (solution &&
				currentPath[0][0] == solution.end[0] &&
				currentPath[0][1] == solution.end[1] &&
				currentPath[currentPath.length - 1][0] === solution.start[0] &&
				currentPath[currentPath.length - 1][1] === solution.start[1] ||
				currentPath[0][0] === solution.start[0] &&
				currentPath[0][1] === solution.start[1] &&
				currentPath[currentPath.length - 1][0] === solution.end[0] &&
				currentPath[currentPath.length - 1][1] === solution.end[1]) {
				commitPath();
			}
		}

		setSelectedColor(null);
		setCurrentPath([]);
	};

	const commitPath = () => {
		 const newGrid = grid.map(row => [...row]);
		 
		 // First, find and remove all previous instances of this color
		 // (except at the endpoint positions which should be preserved)
		 const solution = solutionSegments.find(s => s.color === selectedColor);
		 if (solution) {
		   for (let row = 0; row < newGrid.length; row++) {
			 for (let col = 0; col < newGrid[row].length; col++) {
			   if ((row === solution.start[0] && col === solution.start[1]) ||
				   (row === solution.end[0] && col === solution.end[1])) {
				 continue;
			   }
			   
			   if (newGrid[row][col] === selectedColor) {
				 newGrid[row][col] = null;
			   }
			 }
		   }
		 }
		 
		 // Then add the new path
		 currentPath.forEach(([row, col]) => {
		   newGrid[row][col] = selectedColor;
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
		console.log("ye")
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

	const handleMouseDown = (e) => {
		e.preventDefault();
		const cell = getCellFromEvent(e);
		if (cell) handleStartPath(cell.row, cell.col);
	};

	const handleMouseMove = (e) => {
		e.preventDefault();
		if (!selectedColor) return;
		const cell = getCellFromEvent(e);
		if (cell) handleExtendPath(cell.row, cell.col);
	};

	const handleMouseUp = (e) => {
		e.preventDefault();
		handleEndPath();
	};

	const size = DIFFICULTY_SETTINGS[difficulty].size;

	return (
		<div className="flex flex-col items-center p-4 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700">
			<div
				className="grid bg-gray-800 p-[1vmin] gap-[1vmin] touch-none"
				style={{
					gridTemplateColumns: `repeat(${size}, 1fr)`,
					width: `calc(${size} * 12vmin + ${size - 1} * 1vmin)`,
					boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)'
				}}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				{grid.map((row, i) =>
					row.map((cell, j) => (
						<div
							key={`${i}-${j}`}
							className={`relative flex justify-center items-center w-[12vmin] h-[12vmin] md:w-[15vmin] md:h-[15vmin] transition-all duration-200 ${currentPath.some(([r, c]) => r === i && c === j)
								? 'bg-opacity-30 shadow-[0_0_15px]'
								: 'bg-gray-700 hover:bg-gray-600'
								}`}
							style={{
								backgroundColor: grid[i][j] !== null
									? `${grid[i][j]}`
									: undefined,
								shadowColor: grid[i][j] !== null
									? `${grid[i][j]}`
									: 'transparent'
							}}
						>
							{cell && (
								<div
									className="absolute w-[70%] h-[70%] rounded-full z-20 shadow-lg"
									style={{
										backgroundColor: cell,
										boxShadow: `0 0 15px ${cell}44`
									}}
								/>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
}

export default FlowGame;
