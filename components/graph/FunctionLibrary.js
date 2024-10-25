
const functionsList = {
    "wave": wave,
    "multiwave": multiwave,
    "ripple": ripple,
    "sphere": sphere,
    "torus": torus
}
const functionsIndex = {
    "wave": 0,
    "multiwave": 1,
    "ripple": 2,
    "sphere": 3,
    "torus": 4
}

export function getFunction(name) {
    return functionsList[name]
}

export function getFunctionIndex(name) {
    return functionsIndex[name]
}

/**
 * 
 * @param {*} x x position 
 * @param {*} z z position
 * @param {*} t time elapsed since start
 */
export function wave(x, z, t) {
    return Math.sin(Math.PI * (x + z + t))
}

/**
 * 
 * @param {*} x x position 
 * @param {*} z z position
 * @param {*} t time elapsed since start
 */
export function multiwave(x, z, t) {
    let y;
    y = Math.sin(Math.PI * (x + z + 0.5 * t))
    y += Math.sin(2 * Math.PI * (x + t)) * (1 / 2)
    return y * (2 / 3)
}

/**
 * 
 * @param {*} x x position
 * @param {*} z z position
 * @param {*} t time elasped since start
 */
export function ripple(x, z, t) {
    let d = Math.abs(x + z)
    let y = Math.sin(4 * Math.PI * d + t)
    return y / (1 + 10 * d)
}

export function sphere(u, v, t) {
    return 0;
}

export function torus(u, v, t) {
    return 0;
}