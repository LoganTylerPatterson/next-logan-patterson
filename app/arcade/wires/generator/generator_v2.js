/**
 * Numberlink Generator translated from Go
 * 
 * Algorithm:
 * 1) Tile the board with 2x1 dominos.
 * 2) Shuffle dominos by flipping 2x2 areas.
 * 3) Merge adjacent paths while ensuring they don't touch themselves.
 */

const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function inside(x, y, w, h) {
  return x >= 0 && x < w && y >= 0 && y < h;
}

function isWireHead(x, y, table, w, h) {
  let degree = 0;
  for (let i = 0; i < 4; i++) {
    const x1 = x + DX[i];
    const y1 = y + DY[i];
    if (inside(x1, y1, w, h) && table[y1][x1] === table[y][x]) {
      degree++;
    }
  }
  return degree < 2;
}

function canConnect(x1, y1, x2, y2, table, w, h) {
  if (table[y1][x1] === table[y2][x2]) return false;
  if (!isWireHead(x1, y1, table, w, h) || !isWireHead(x2, y2, table, w, h)) return false;

  for (let y3 = 0; y3 < h; y3++) {
    for (let x3 = 0; x3 < w; x3++) {
      for (let i = 0; i < 4; i++) {
        const x4 = x3 + DX[i];
        const y4 = y3 + DY[i];
        if (inside(x4, y4, w, h)) {
          if (!(x3 === x1 && y3 === y1 && x4 === x2 && y4 === y2) &&
              !(x3 === x2 && y3 === y2 && x4 === x1 && y4 === y1)) {
            if (table[y3][x3] === table[y1][x1] && table[y4][x4] === table[y2][x2]) {
              return false;
            }
          }
        }
      }
    }
  }
  return true;
}

function fill(x, y, alpha, table, w, h) {
  const orig = table[y][x];
  table[y][x] = alpha;
  for (let i = 0; i < 4; i++) {
    const x1 = x + DX[i];
    const y1 = y + DY[i];
    if (inside(x1, y1, w, h) && table[y1][x1] === orig) {
      fill(x1, y1, alpha, table, w, h);
    }
  }
}

function follow(x, y, x0, y0, table, w, h) {
  for (let i = 0; i < 4; i++) {
    const x1 = x + DX[i];
    const y1 = y + DY[i];
    if (inside(x1, y1, w, h) && !(x1 === x0 && y1 === y0) && table[y][x] === table[y1][x1]) {
      return follow(x1, y1, x, y, table, w, h);
    }
  }
  return [x, y];
}

function layWire(x, y, table, w, h) {
  const dirs = shuffleArray([0, 1, 2, 3]);
  for (const i of dirs) {
    const x1 = x + DX[i];
    const y1 = y + DY[i];
    if (inside(x1, y1, w, h) && canConnect(x, y, x1, y1, table, w, h)) {
      fill(x1, y1, table[y][x], table, w, h);
      const [x2, y2] = follow(x1, y1, x, y, table, w, h);
      layWire(x2, y2, table, w, h);
      return;
    }
  }
}

export function generateNumberlink(w, h) {
  if (w <= 1 && h <= 1) return null;

  // 1) Tile
  let table = Array.from({ length: h }, () => Array(w).fill(-1));
  let alpha = 0;
  for (let y = 0; y < h - 1; y += 2) {
    for (let x = 0; x < w; x++) {
      table[y][x] = alpha;
      table[y + 1][x] = alpha;
      alpha++;
    }
  }
  if (h % 2 === 1) {
    for (let x = 0; x < w - 1; x += 2) {
      table[h - 1][x] = alpha;
      table[h - 1][x + 1] = alpha;
      alpha++;
    }
    if (w % 2 === 1) {
      table[h - 1][w - 1] = alpha;
      alpha++;
    }
  }

  // 2) Shuffle
  if (w > 1 && h > 1) {
    for (let i = 0; i < w * h * w * h; i++) {
      const x = Math.floor(Math.random() * (w - 1));
      const y = Math.floor(Math.random() * (h - 1));
      if (table[y][x] === table[y][x + 1] && table[y + 1][x] === table[y + 1][x + 1]) {
        // Flip horizontal to vertical
        table[y + 1][x] = table[y][x];
        table[y][x + 1] = table[y + 1][x + 1];
      } else if (table[y][x] === table[y + 1][x] && table[y][x + 1] === table[y + 1][x + 1]) {
        // Flip vertical to horizontal
        table[y][x + 1] = table[y][x];
        table[y + 1][x] = table[y + 1][x + 1];
      }
    }
  }

  // 3) Odd corner handling (optional but good)
  if (w % 2 === 1 && h % 2 === 1) {
    if (w > 2 && table[h - 1][w - 3] === table[h - 1][w - 2]) {
      table[h - 1][w - 1] = table[h - 1][w - 2];
    } else if (h > 2 && table[h - 3][w - 1] === table[h - 2][w - 1]) {
      table[h - 1][w - 1] = table[h - 2][w - 1];
    }
  }

  // 4) Merge wires
  const positions = shuffleArray(Array.from({ length: w * h }, (_, i) => i));
  for (const p of positions) {
    const x = p % w;
    const y = Math.floor(p / w);
    if (isWireHead(x, y, table, w, h)) {
      layWire(x, y, table, w, h);
    }
  }

  // 5) Compact colors and format
  const colorMap = new Map();
  let nextColor = 1;
  const result = Array.from({ length: h }, () => Array(w).fill(0));
  
  // Re-flatten to get unique IDs
  const visited = new Set();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (isWireHead(x, y, table, w, h)) {
        const rawColor = table[y][x];
        if (!colorMap.has(rawColor)) {
          colorMap.set(rawColor, nextColor++);
        }
        result[y][x] = colorMap.get(rawColor);
      }
    }
  }

  return {
    width: w,
    height: h,
    cells: result,
    solution: table // Full table contains the solution paths
  };
}
