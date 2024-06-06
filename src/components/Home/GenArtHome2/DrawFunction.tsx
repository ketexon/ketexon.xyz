export class DrawFunction {
	x: number;
	y: number;
	w: number;
	h: number;
	ctx: CanvasRenderingContext2D;

	init(x: number, y: number, w: number, h: number, ctx: CanvasRenderingContext2D) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.ctx = ctx;
	}

	draw(){

	}

	destroy(){

	}
}

export class Tiled<Other extends DrawFunction> extends DrawFunction {
	tilesX: number;
	tilesY: number;
	subDrawFunctions: Other[];

	constructor(tilesX: number, tilesY: number, subFunctions: Other[]){
		super();
		this.tilesX = tilesX;
		this.tilesY = tilesY;
		this.subDrawFunctions = subFunctions;
	}

	init(x: number, y: number, w: number, h: number, ctx: CanvasRenderingContext2D): void {
		super.init(x, y, w, h, ctx);

		for(let x = 0; x < this.tilesX; ++x){
			for(let y = 0; y < this.tilesY; ++y){
				this.subDrawFunctions[x + y * this.tilesX].init(
					w / this.tilesX * x,
					h / this.tilesY * y,
					w / this.tilesX,
					h / this.tilesY,
					ctx,
				);
			}
		}
	}

	draw(): void {
		for(const fn of this.subDrawFunctions){
			fn.draw()
		}
	}

	destroy(): void {
		for(const fn of this.subDrawFunctions){
			fn.destroy()
		}
	}
}

export class Lines extends DrawFunction {
	timers: NodeJS.Timer[]

	draw(): void {
		this.ctx.fillStyle = "#000";
		this.ctx.fillRect(this.x, this.y, this.w, this.h);

		const nLines = 1;
		this.timers = Array.from({ length: nLines }).map((_, i) => setInterval(() => {
			this.ctx.strokeStyle = "#00f"

			this.ctx.moveTo(this.x, this.y);
			this.ctx.lineTo(this.x + this.w, this.y + this.h);
			this.ctx.stroke();
		}, 120))
	}

	destroy(): void {
		for(const timer of this.timers){
			clearInterval(timer);
		}
	}
}

export const drawFunctions = [
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
	new Tiled(4, 4, Array.from({ length: 4 * 4 }).map(() => new Lines())),
]