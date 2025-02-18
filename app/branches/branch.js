export default class Branch {
	constructor(x, y, max_life, color = undefined) {
		this.life = 0;
		this.max_life = max_life;
		this.speed = Math.random() * 1;
		this.x = x;
		this.y = y;
		this.rw = Math.random() * 360;
		this.color = color == undefined ? this.getRandomBrightColor() : color;
	}


	getRandomBrightColor() {
	    const hue = Math.floor(Math.random() * 360);
	    return `hsl(${hue}, 100%, 60%)`; // 100% saturation, 60% lightness
	}
}