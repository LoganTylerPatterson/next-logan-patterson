export const cyan = '0, 255, 255';
export const blue = '0, 0, 255';
export const red = '255, 0, 0';
export const yellow = '255, 255, 0';
export const green = '0, 255, 0';
export const purple = '128, 0, 128';
export const orange = '255, 128, 0';

export const TETROMINOS = {
  0: { shape: [[0]], color: '0, 0, 0' },
  I: {
    shape: [[0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0], [0, 'I', 0, 0]],
    color: cyan
  },
  J: {
    shape: [[0, 'J', 0], [0, 'J', 0], ['J', 'J', 0]],
    color: blue,
  },
  L: {
    shape: [[0, 'L', 0], [0, 'L', 0], [0, 'L', 'L']],
    color: red,
  },
  O: {
    shape: [['O', 'O'], ['O', 'O']],
    color: yellow,
  },
  S: {
    shape: [[0, 'S', 'S'], ['S', 'S', 0], [0, 0, 0]],
    color: green,
  },
  T: {
    shape: [[0, 0, 0], ['T', 'T', 'T'], [0, 'T', 0]],
    color: purple,
  },
  Z: {
    shape: [['Z', 'Z', 0], [0, 'Z', 'Z'], [0, 0, 0]],
    color: orange,
  },
};

export const randomTetromino = () => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino =
    tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};
