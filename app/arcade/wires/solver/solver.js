/**
 * Numberlink Solver translated from Go (paper.go)
 */

const GRASS = '#';
const EMPTY = '.';

const N = 1;
const E = 2;
const S = 4;
const W = 8;

const DIRS = [N, E, S, W];
const MIR = {
  [N]: S,
  [E]: W,
  [S]: N,
  [W]: E
};

const DIAG = {
  [N | E]: true,
  [N | W]: true,
  [S | E]: true,
  [S | W]: true
};

const TUBE = [' ', '╵', '╶', '└', '╷', '│', '┌', '├', '╴', '┘', '─', '┴', '┐', '┤', '┬', '┼'];

export class Paper {
  // ... (previous constructor and methods)
  constructor(width, height, table) {
    this.w = width + 2;
    this.h = height + 2;
    this.width = this.w;
    this.height = this.h;
    
    this.Table = new Array(this.w * this.h).fill(GRASS);
    for (let y = 1; y < this.h - 1; y++) {
      for (let x = 1; x < this.w - 1; x++) {
        this.Table[y * this.w + x] = table[(y - 1) * (this.w - 2) + (x - 1)];
      }
    }

    this.Vctr = new Array(16).fill(0);
    this.Crnr = new Array(16).fill(0);
    this.Con = new Array(this.w * this.h).fill(0);
    this.source = new Array(this.w * this.h).fill(false);
    this.end = new Array(this.w * this.h).fill(0);
    this.canSE = new Array(this.w * this.h).fill(false);
    this.canSW = new Array(this.w * this.h).fill(false);
    this.next = new Array(this.w * this.h).fill(0);

    this.initTables();
  }

  initTables() {
    const w = this.w;
    const h = this.h;

    for (let dir = 0; dir < 16; dir++) {
      if (dir & N) this.Vctr[dir] -= w;
      if (dir & E) this.Vctr[dir] += 1;
      if (dir & S) this.Vctr[dir] += w;
      if (dir & W) this.Vctr[dir] -= 1;
    }

    this.Crnr[N | W] = w + 1;
    this.Crnr[N | E] = 2 * w - 2;
    this.Crnr[S | E] = h * w - w - 2;
    this.Crnr[S | W] = h * w - 2 * w + 1;

    for (let pos = 0; pos < w * h; pos++) {
      this.source[pos] = this.Table[pos] !== EMPTY && this.Table[pos] !== GRASS;
    }

    for (let pos = 0; pos < w * h; pos++) {
      if (this.source[pos]) {
        let d = this.Vctr[N | W];
        for (let p = pos + d; this.Table[p] === EMPTY; p += d) {
          this.canSE[p] = true;
        }
        d = this.Vctr[N | E];
        for (let p = pos + d; this.Table[p] === EMPTY; p += d) {
          this.canSW[p] = true;
        }
      }
    }

    let last = 0;
    const diagonals = [];
    for (let i = this.Crnr[N | W]; i < this.Crnr[N | E]; i++) diagonals.push(i);
    for (let i = this.Crnr[N | E]; i <= this.Crnr[S | E]; i += w) diagonals.push(i);

    for (let startPos of diagonals) {
      let pos = startPos;
      while (this.Table[pos] !== GRASS) {
        this.next[last] = pos;
        last = pos;
        pos = pos + w - 1;
      }
    }

    for (let pos = 0; pos < w * h; pos++) {
      this.end[pos] = pos;
    }
  }

  solve() {
    return this.chooseConnection(this.Crnr[N | W]);
  }

  chooseConnection(pos) {
    if (pos === 0) {
      return this.validate();
    }

    const w = this.w;
    if (this.source[pos]) {
      switch (this.Con[pos]) {
        case 0:
          if (this.Con[pos - w + 1] !== (S | W)) {
            if (this.tryConnection(pos, E)) return true;
          }
          if (this.checkImplicitSE(pos)) {
            if (this.tryConnection(pos, S)) return true;
          }
          break;
        case N:
        case W:
          return this.chooseConnection(this.next[pos]);
      }
    } else {
      switch (this.Con[pos]) {
        case 0:
          if (this.canSE[pos]) {
            return this.tryConnection(pos, E | S);
          }
          break;
        case W:
          if (this.canSW[pos] && this.checkSWLane(pos) && this.checkImplicitSE(pos)) {
            if (this.tryConnection(pos, S)) return true;
          }
          if (this.Con[pos - w + 1] !== (S | W) && this.Con[pos - w - 1] !== (S | E)) {
            if (this.tryConnection(pos, E)) return true;
          }
          break;
        case N | W:
          if (this.Con[pos - w - 1] === (N | W) || this.source[pos - w - 1]) {
            return this.chooseConnection(this.next[pos]);
          }
          break;
        case N:
          if (this.Con[pos - w + 1] === (N | E) || (this.source[pos - w + 1] && (this.Con[pos - w + 1] & (N | E)) !== 0)) {
            if (this.tryConnection(pos, E)) return true;
          }
          if (this.Con[pos - w + 1] !== (S | W) && this.Con[pos - w - 1] !== (S | E) && this.checkImplicitSE(pos)) {
            if (this.tryConnection(pos, S)) return true;
          }
          break;
      }
    }
    return false;
  }

  checkSWLane(pos) {
    const w = this.w;
    let p = pos;
    while (!this.source[p]) {
      if (this.Con[p] !== W) return false;
      p += w - 1;
    }
    return true;
  }

  checkImplicitSE(pos) {
    return this.Con[pos + 1] !== 0 || this.canSE[pos + 1] || this.Table[pos + 1] !== EMPTY;
  }

  tryConnection(pos1, dirs) {
    const dir = dirs & -dirs;
    const pos2 = pos1 + this.Vctr[dir];
    const end1 = this.end[pos1];
    const end2 = this.end[pos2];

    if (this.Table[pos2] === GRASS) return false;
    if (this.Table[end1] !== EMPTY && this.Table[end2] !== EMPTY && this.Table[end1] !== this.Table[end2]) return false;
    if (end1 === pos2 && end2 === pos1) return false;

    if (this.Con[pos1] !== 0) {
      const dir2 = this.Con[pos1 + this.Vctr[this.Con[pos1]]];
      const dir3 = this.Con[pos1] | dir;
      if (DIAG[dir2] && DIAG[dir3] && (dir2 & dir3) !== 0) return false;
    }

    const old1 = this.Con[pos1];
    const old2 = this.Con[pos2];
    this.Con[pos1] |= dir;
    this.Con[pos2] |= MIR[dir];

    const oldEnd1 = this.end[end1];
    const oldEnd2 = this.end[end2];
    this.end[end1] = end2;
    this.end[end2] = end1;

    const dirRemaining = dirs ^ dir;
    let res = false;
    if (dirRemaining === 0) {
      res = this.chooseConnection(this.next[pos1]);
    } else {
      res = this.tryConnection(pos1, dirRemaining);
    }

    if (!res) {
      this.Con[pos1] = old1;
      this.Con[pos2] = old2;
      this.end[end1] = oldEnd1;
      this.end[end2] = oldEnd2;
    }
    return res;
  }

  validate() {
    const w = this.w;
    const h = this.h;
    const vtable = new Array(w * h).fill(null);
    for (let pos = 0; pos < w * h; pos++) {
      if (this.source[pos]) {
        const alpha = this.Table[pos];
        let p = pos;
        let old = pos;
        let next = pos;
        while (true) {
          vtable[p] = alpha;
          for (let dir of DIRS) {
            const cand = p + this.Vctr[dir];
            if ((this.Con[p] & dir) !== 0) {
              if (cand !== old) {
                next = cand;
              }
            } else if (vtable[cand] === alpha) {
              return false;
            }
          }
          if (old !== p && this.source[p]) break;
          old = p;
          p = next;
        }
      }
    }
    return true;
  }

  fillTable() {
    const w = this.w;
    const h = this.h;
    const table = [...this.Table];
    for (let pos = 0; pos < w * h; pos++) {
      if (this.source[pos]) {
        const queue = [pos];
        while (queue.length > 0) {
          const p = queue.shift();
          const paint = table[p];
          for (let dir of DIRS) {
            const next = p + this.Vctr[dir];
            if ((this.Con[p] & dir) !== 0 && table[next] === EMPTY) {
              table[next] = paint;
              queue.push(next);
            }
          }
        }
      }
    }
    return table;
  }
}

export function solve(width, height, table) {
  const paper = new Paper(width, height, table);
  if (paper.solve()) {
    const filledTable = paper.fillTable();
    const result = [];
    const tubes = [];
    for (let y = 1; y < paper.h - 1; y++) {
      let row = "";
      let tubeRow = "";
      for (let x = 1; x < paper.w - 1; x++) {
        const pos = y * paper.w + x;
        row += filledTable[pos];
        tubeRow += paper.Table[pos] !== EMPTY ? paper.Table[pos] : TUBE[paper.Con[pos]];
      }
      result.push(row);
      tubes.push(tubeRow);
    }
    return {
      table: result,
      tubes: tubes,
      con: paper.Con
    };
  }
  return null;
}

