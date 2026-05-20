/**
 * Numberlink Generator translated from Python
 */

export class UnionFind {
  constructor(initial = null) {
    this.uf = initial || new Map();
  }

  union(a, b) {
    const aPar = this.find(a);
    const bPar = this.find(b);
    if (aPar !== bPar) {
      this.uf.set(aPar, bPar);
    }
  }

  find(a) {
    // We use JSON.stringify for complex keys like [x, y] if not using a better key
    const key = typeof a === 'object' ? JSON.stringify(a) : a;
    if (!this.uf.has(key)) {
      return key;
    }
    let curr = key;
    while (this.uf.has(curr) && this.uf.get(curr) !== curr) {
      curr = this.uf.get(curr);
    }
    // Path compression
    let node = key;
    while (this.uf.has(node) && this.uf.get(node) !== curr) {
      let next = this.uf.get(node);
      this.uf.set(node, curr);
      node = next;
    }
    return curr;
  }
}

const T = 0, L = 1, R = 2;

export class Path {
  constructor(steps) {
    this.steps = steps;
  }

  *xys(dx = 0, dy = 1) {
    let x = 0, y = 0;
    yield [x, y];
    for (const step of this.steps) {
      x += dx;
      y += dy;
      yield [x, y];
      if (step === L) {
        [dx, dy] = [-dy, dx];
      } else if (step === R) {
        [dx, dy] = [dy, -dx];
      } else if (step === T) {
        x += dx;
        y += dy;
        yield [x, y];
      }
    }
  }

  test() {
    const ps = Array.from(this.xys());
    const seen = new Set();
    for (const [x, y] of ps) {
      const key = `${x},${y}`;
      if (seen.has(key)) return false;
      seen.add(key);
    }
    return true;
  }

  testLoop() {
    const ps = Array.from(this.xys());
    const seen = new Set();
    for (let i = 0; i < ps.length; i++) {
      const [x, y] = ps[i];
      const key = `${x},${y}`;
      if (seen.has(key)) {
        if (i === ps.length - 1 && x === ps[0][0] && y === ps[0][1]) {
          return true;
        }
        return false;
      }
      seen.add(key);
    }
    return true;
  }

  winding() {
    let countR = 0, countL = 0;
    for (const s of this.steps) {
      if (s === R) countR++;
      if (s === L) countL++;
    }
    return countR - countL;
  }
}

function unrotate(x, y, dx, dy) {
  while (dx !== 0 || dy !== 1) {
    [x, y, dx, dy] = [-y, x, -dy, dx];
  }
  return [x, y];
}

export class Mitm {
  constructor(lrPrice, tPrice) {
    this.lrPrice = lrPrice;
    this.tPrice = tPrice;
    this.inv = new Map();
    this.list = [];
  }

  prepare(budget) {
    const dx0 = 0, dy0 = 1;
    for (const { path, end } of this._goodPaths(0, 0, dx0, dy0, budget)) {
      const [x, y, dx, dy] = end;
      this.list.push({ path, x, y, dx, dy });
      const key = `${x},${y},${dx},${dy}`;
      if (!this.inv.has(key)) this.inv.set(key, []);
      this.inv.get(key).push(path);
    }
  }

  randPath2(xn, yn, dxn, dyn) {
    let seen = new Set();
    while (true) {
      seen.clear();
      let path = [];
      let x = 0, y = 0, dx = 0, dy = 1;
      seen.add(`${x},${y}`);
      const limit = 2 * (Math.abs(xn) + Math.abs(yn));
      
      let failed = false;
      for (let i = 0; i < limit; i++) {
        const r = Math.random();
        const wL = 1 / this.lrPrice;
        const wR = 1 / this.lrPrice;
        const wT = 2 / this.tPrice;
        const total = wL + wR + wT;
        let step;
        if (r < wL / total) step = L;
        else if (r < (wL + wR) / total) step = R;
        else step = T;

        path.push(step);
        x += dx;
        y += dy;
        if (seen.has(`${x},${y}`)) { failed = true; break; }
        seen.add(`${x},${y}`);

        if (step === L) [dx, dy] = [-dy, dx];
        else if (step === R) [dx, dy] = [dy, -dx];
        else if (step === T) {
          x += dx;
          y += dy;
          if (seen.has(`${x},${y}`)) { failed = true; break; }
          seen.add(`${x},${y}`);
        }

        if (x === xn && y === yn) return new Path(path);
        
        const ends = this._lookup(dx, dy, xn - x, yn - y, dxn, dyn);
        if (ends && ends.length > 0) {
          const path2 = ends[Math.floor(Math.random() * ends.length)];
          return new Path([...path, ...path2]);
        }
      }
    }
  }

  randLoop(clock = 0) {
    while (true) {
      const { path, x, y, dx, dy } = this.list[Math.floor(Math.random() * this.list.length)];
      const path2s = this._lookup(dx, dy, -x, -y, 0, 1);
      if (path2s && path2s.length > 0) {
        const path2 = path2s[Math.floor(Math.random() * path2s.length)];
        const joined = new Path([...path, ...path2]);
        if (clock && joined.winding() !== clock * 4) continue;
        if (joined.testLoop()) return joined;
      }
    }
  }

  *_goodPaths(x, y, dx, dy, budget, seen = new Set()) {
    if (budget >= 0) {
      yield { path: [], end: [x, y, dx, dy] };
    }
    if (budget <= 0) return;

    const key = `${x},${y}`;
    seen.add(key);
    const x1 = x + dx, y1 = y + dy;
    const key1 = `${x1},${y1}`;
    if (!seen.has(key1)) {
      // Left
      for (const { path, end } of this._goodPaths(x1, y1, -dy, dx, budget - this.lrPrice, seen)) {
        yield { path: [L, ...path], end };
      }
      // Right
      for (const { path, end } of this._goodPaths(x1, y1, dy, -dx, budget - this.lrPrice, seen)) {
        yield { path: [R, ...path], end };
      }
      
      seen.add(key1);
      const x2 = x1 + dx, y2 = y1 + dy;
      const key2 = `${x2},${y2}`;
      if (!seen.has(key2)) {
        // Straight (T)
        for (const { path, end } of this._goodPaths(x2, y2, dx, dy, budget - this.tPrice, seen)) {
          yield { path: [T, ...path], end };
        }
      }
      seen.delete(key1);
    }
    seen.delete(key);
  }

  _lookup(dx, dy, xn, yn, dxn, dyn) {
    const [xt, yt] = unrotate(xn, yn, dx, dy);
    const [dxt, dyt] = unrotate(dxn, dyn, dx, dy);
    const key = `${xt},${yt},${dxt},${dyt}`;
    return this.inv.get(key);
  }
}

function sign(x) {
  return x === 0 ? 0 : (x < 0 ? -1 : 1);
}

export class Grid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.grid = new Map();
  }

  set(x, y, val) {
    this.grid.set(`${x},${y}`, val);
  }

  get(x, y) {
    return this.grid.get(`${x},${y}`) || ' ';
  }

  clear() {
    this.grid.clear();
  }

  shrink() {
    const smallGrid = new Grid(Math.floor(this.w / 2), Math.floor(this.h / 2));
    for (let y = 0; y < smallGrid.h; y++) {
      for (let x = 0; x < smallGrid.w; x++) {
        smallGrid.set(x, y, this.get(2 * x + 1, 2 * y + 1));
      }
    }
    return smallGrid;
  }

  testPath(path, x0, y0, dx0 = 0, dy0 = 1) {
    for (const [x, y] of path.xys(dx0, dy0)) {
      const gx = x0 - x + y;
      const gy = y0 + x + y;
      if (gx < 0 || gx >= this.w || gy < 0 || gy >= this.h || this.grid.has(`${gx},${gy}`)) {
        return false;
      }
    }
    return true;
  }

  drawPath(path, x0, y0, dx0 = 0, dy0 = 1, loop = false) {
    const ps = Array.from(path.xys(dx0, dy0));
    if (loop) {
      ps.push(ps[1]);
    }
    for (let i = 1; i < ps.length - 1; i++) {
      const [xp, yp] = ps[i - 1];
      const [x, y] = ps[i];
      const [xn, yn] = ps[i + 1];
      
      const dx1 = xn - xp;
      const dy1 = yn - yp;
      const s = sign((x - xp) * (yn - y) - (xn - x) * (y - yp));
      
      const key = `${dx1},${dy1},${s}`;
      const val = {
        '1,1,1': '<', '-1,-1,-1': '<',
        '1,1,-1': '>', '-1,-1,1': '>',
        '-1,1,1': 'v', '1,-1,-1': 'v',
        '-1,1,-1': '^', '1,-1,1': '^',
        '0,2,0': '\\', '0,-2,0': '\\',
        '2,0,0': '/', '-2,0,0': '/'
      }[key];
      
      if (val) {
        this.set(x0 - x + y, y0 + x + y, val);
      }
    }
  }

  makeTubes() {
    const uf = new UnionFind();
    const tubeGrid = new Grid(this.w, this.h);
    for (let x = 0; x < this.w; x++) {
      let d = '-';
      for (let y = 0; y < this.h; y++) {
        const val = this.get(x, y);
        const state = val + d;
        const unions = {
          '/-': [[0, 1]], '\\-': [[1, 0], [0, 1]],
          '/|': [[1, 0]],
          ' -': [[1, 0]], ' |': [[0, 1]],
          'v|': [[0, 1]], '>|': [[1, 0]],
          'v-': [[0, 1]], '>-': [[1, 0]],
        }[state] || [];
        
        for (const [dx, dy] of unions) {
          if (x + dx < this.w && y + dy < this.h) {
            uf.union([x, y], [x + dx, y + dy]);
          }
        }
        
        const tubeVal = {
          '/-': '┐', '\\-': '┌',
          '/|': '└', '\\|': '┘',
          ' -': '-', ' |': '|',
        }[state] || 'x';
        
        tubeGrid.set(x, y, tubeVal);
        
        if ('\\/v^'.includes(val)) {
          d = (d === '-' ? '|' : '-');
        }
      }
    }
    return [tubeGrid, uf];
  }

  clearPath(path, x, y) {
    const pathGrid = new Grid(this.w, this.h);
    pathGrid.drawPath(path, x, y, 0, 1, true);
    const [tubeGrid] = pathGrid.makeTubes();
    for (const [key, val] of tubeGrid.grid.entries()) {
      if (val === '|') {
        this.grid.delete(key);
      }
    }
  }
}

function hasLoops(grid, uf) {
  const groups = new Set();
  for (let y = 0; y < grid.h; y++) {
    for (let x = 0; x < grid.w; x++) {
      groups.add(uf.find([x, y]));
    }
  }
  let ends = 0;
  for (let y = 0; y < grid.h; y++) {
    for (let x = 0; x < grid.w; x++) {
      if ('v^<>'.includes(grid.get(x, y))) ends++;
    }
  }
  return ends !== 2 * groups.size;
}

function hasPair(tg, uf) {
  for (let y = 0; y < tg.h; y++) {
    for (let x = 0; x < tg.w; x++) {
      for (const [dx, dy] of [[1, 0], [0, 1]]) {
        const x1 = x + dx, y1 = y + dy;
        if (x1 < tg.w && y1 < tg.h) {
          if (tg.get(x, y) === 'x' && tg.get(x1, y1) === 'x' && uf.find([x, y]) === uf.find([x1, y1])) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function hasTriple(tg, uf) {
  for (let y = 0; y < tg.h; y++) {
    for (let x = 0; x < tg.w; x++) {
      const r = uf.find([x, y]);
      let nbs = 0;
      for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        const x1 = x + dx, y1 = y + dy;
        if (x1 >= 0 && x1 < tg.w && y1 >= 0 && y1 < tg.h && uf.find([x1, y1]) === r) {
          nbs++;
        }
      }
      if (nbs >= 3) return true;
    }
  }
  return false;
}

export function generatePuzzle(w, h, mitm, minNumbers = 0, maxNumbers = 1000) {
  function testReady(grid) {
    const sg = grid.shrink();
    const [stg, uf] = sg.makeTubes();
    let xCount = 0;
    for (const val of stg.grid.values()) if (val === 'x') xCount++;
    const numbers = Math.floor(xCount / 2);
    return numbers >= minNumbers && numbers <= maxNumbers &&
           !hasLoops(sg, uf) && !hasPair(stg, uf) && !hasTriple(stg, uf);
  }

  const grid = new Grid(2 * w + 1, 2 * h + 1);
  const LOOP_TRIES = 1000;

  while (true) {
    grid.clear();

    const path = mitm.randPath2(h, h, 0, -1);
    if (!grid.testPath(path, 0, 0)) continue;
    grid.drawPath(path, 0, 0);
    grid.set(0, 0, '\\');
    grid.set(0, 2 * h, '/');

    const path2 = mitm.randPath2(h, h, 0, -1);
    if (!grid.testPath(path2, 2 * w, 2 * h, 0, -1)) continue;
    grid.drawPath(path2, 2 * w, 2 * h, 0, -1);
    grid.set(2 * w, 0, '/');
    grid.set(2 * w, 2 * h, '\\');

    if (testReady(grid)) return grid.shrink();

    let [tg] = grid.makeTubes();
    for (let tries = 0; tries < LOOP_TRIES; tries++) {
      const x = 2 * Math.floor(Math.random() * w);
      const y = 2 * Math.floor(Math.random() * h);

      const val = tg.get(x, y);
      if (val !== '-' && val !== '|') continue;

      const pathL = mitm.randLoop(val === '-' ? 1 : -1);
      if (grid.testPath(pathL, x, y)) {
        grid.clearPath(pathL, x, y);
        grid.drawPath(pathL, x, y, 0, 1, true);
        [tg] = grid.makeTubes();

        const sg = grid.shrink();
        const [stg, uf] = sg.makeTubes();
        let xCount = 0;
        for (const v of stg.grid.values()) if (v === 'x') xCount++;
        const numbers = Math.floor(xCount / 2);

        if (numbers > maxNumbers) break;
        if (testReady(grid)) return sg;
      }
    }
  }
}

export function formatPuzzle(grid) {
  const [tg, uf] = grid.makeTubes();
  const res = {
    width: grid.w,
    height: grid.h,
    cells: []
  };
  
  const mapping = new Map();
  let nextId = 1;

  for (let y = 0; y < grid.h; y++) {
    const row = [];
    for (let x = 0; x < grid.w; x++) {
      if ('v^<>'.includes(grid.get(x, y))) {
        const root = uf.find([x, y]);
        if (!mapping.has(root)) {
          mapping.set(root, nextId++);
        }
        row.push(mapping.get(root));
      } else {
        row.push(0);
      }
    }
    res.cells.push(row);
  }
  return res;
}
