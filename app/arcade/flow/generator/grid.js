function sign(x) {
    if (x === 0) return x;
    return x < 0 ? -1 : 1;
}

function keyToString(key) {
    if (Array.isArray(key)) {
        return `${key[0]},${key[1]}`;
    }
    return key;
}

class UnionFind {
    constructor(initial = null) {
        this.uf = initial || {};
    }

    union(a, b) {
        const aPar = this.find(a);
        const bPar = this.find(b);
        this.uf[aPar] = bPar;
    }

    find(a) {
        const key = Array.isArray(a) ? `${a[0]},${a[1]}` : a;
        if (this.uf[key] === undefined || this.uf[key] === key) {
            return key;
        }
        const par = this.find(this.uf[key]);
        this.uf[key] = par;
        return par;
    }
}

class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = {};
    }

    setItem(key, val) {
        const k = keyToString(key);
        this.grid[k] = val;
    }

    getItem(key) {
        const k = keyToString(key);
        return this.grid[k] !== undefined ? this.grid[k] : ' ';
    }

    represent() {
        const res = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(this.getItem([x, y]));
            }
            res.push(row.join(''));
        }
        return res.join('\n');
    }

    [Symbol.iterator]() {
        return Object.entries(this.grid)[Symbol.iterator]();
    }

    has(key) {
        const k = keyToString(key);
        return k in this.grid;
    }

    deleteItem(key) {
        const k = keyToString(key);
        delete this.grid[k];
    }

    clear() {
        this.grid = {};
    }

    values() {
        return Object.values(this.grid);
    }

    shrink() {
        const smallGrid = new Grid(Math.floor(this.width / 2), Math.floor(this.height / 2));
        for (let y = 0; y < Math.floor(this.height / 2); y++) {
            for (let x = 0; x < Math.floor(this.width / 2); x++) {
                smallGrid.setItem([x, y], this.getItem([2 * x + 1, 2 * y + 1]));
            }
        }
        return smallGrid;
    }

    test_path(path, x0, y0, dx0 = 0, dy0 = 1) {
        const coords = Array.from(path.xys(dx0, dy0));
        return coords.every(([x, y]) => {
            const gridX = x0 - x + y;
            const gridY = y0 + x + y;
            return gridX >= 0 && gridX < this.width &&
                   gridY >= 0 && gridY < this.height &&
                   !this.has([gridX, gridY]);
        });
    }

    draw_path(path, x0, y0, dx0 = 0, dy0 = 1, loop = false) {
        const ps = Array.from(path.xys(dx0, dy0));
        
        if (loop) {
            if (ps[0][0] !== ps[ps.length - 1][0] || ps[0][1] !== ps[ps.length - 1][1]) {
                throw new Error(`Path is not a loop: ${path}, ${ps}`);
            }
            ps.push(ps[1]);
        }

        const charMap = {
            '1,1,1': '<', '-1,-1,-1': '<',
            '1,1,-1': '>', '-1,-1,1': '>',
            '-1,1,1': 'v', '1,-1,-1': 'v',
            '-1,1,-1': '^', '1,-1,1': '^',
            '0,2,0': '\\', '0,-2,0': '\\',
            '2,0,0': '/', '-2,0,0': '/'
        };

        for (let i = 1; i < ps.length - 1; i++) {
            const [xp, yp] = ps[i - 1];
            const [x, y] = ps[i];
            const [xn, yn] = ps[i + 1];
            
            const dx = xn - xp;
            const dy = yn - yp;
            const cross = (x - xp) * (yn - y) - (xn - x) * (y - yp);
            const s = sign(cross);
            
            const key = `${dx},${dy},${s}`;
            const char = charMap[key];
            if (!char) {
                throw new Error(`No character mapping for ${key}`);
            }
            
            this.setItem([x0 - x + y, y0 + x + y], char);
        }
    }

    make_tubes() {
        const uf = new UnionFind();
        const tubeGrid = new Grid(this.width, this.height);
        
        for (let x = 0; x < this.width; x++) {
            let d = '-';
            for (let y = 0; y < this.height; y++) {
                const cell = this.getItem([x, y]);
                const key = cell + d;
                
                const unionMap = {
                    '/-': [[0, 1]],
                    '\\-': [[1, 0], [0, 1]],
                    '/|': [[1, 0]],
                    ' -': [[1, 0]],
                    ' |': [[0, 1]],
                    'v|': [[0, 1]],
                    '>|': [[1, 0]],
                    'v-': [[0, 1]],
                    '>-': [[1, 0]]
                };
                
                const unions = unionMap[key] || [];
                for (const [dx, dy] of unions) {
                    uf.union([x, y], [x + dx, y + dy]);
                }
                
                const tubeMap = {
                    '/-': '┐',
                    '\\-': '┌',
                    '/|': '└',
                    '\\|': '┘',
                    ' -': '-',
                    ' |': '|'
                };
                
                tubeGrid.setItem([x, y], tubeMap[key] || 'x');
                
                if (cell === '\\' || cell === '/' || cell === 'v' || cell === '^') {
                    d = d === '-' ? '|' : '-';
                }
            }
        }
        
        return [tubeGrid, uf];
    }

    clear_path(path, x, y) {
        const pathGrid = new Grid(this.width, this.height);
        pathGrid.draw_path(path, x, y, 0, 1, true);
        const [tubeGrid] = pathGrid.make_tubes();
        
        for (const [key, val] of tubeGrid) {
            if (val === '|') {
                this.deleteItem(key);
            }
        }
    }
}

export { sign, UnionFind, Grid };
export default Grid;
