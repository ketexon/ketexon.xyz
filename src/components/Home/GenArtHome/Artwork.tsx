export type ArtworkParameters = {
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	offset: [number, number],
	size: [number, number],
}

export type ArtworkCustomParameter = {
	name: string,
	key: string,
	width?: string | number,
} & (
	{
		type: "number",
		default: number,
		min?: number,
		max?: number,
		display: "slider" | "field"
	}
	| {
		type: "color",
		default: string,
	}
)

export abstract class Artwork {
	p: ArtworkParameters
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	offsetX: number;
	offsetY: number;
	w: number;
	h: number;

	customParameters: Map<string, number | string> = new Map();

	finished: boolean;

	get backgroundColor() {
		return this.customParameters.get("backgroundColor") as string | undefined;
	}

	get customParameterTypes(): ArtworkCustomParameter[] {
		return [
			{
				name: "Background Color",
				key: "backgroundColor",
				default: "#111",
				type: "color",
			}
		]
	}

	setCustomParameter(name: string, value: number) {
		this.customParameters.set(name, value);
	}

	constructor(p: ArtworkParameters) {
		this.p = p;

		this.canvas = p.canvas;
		this.ctx = p.ctx;

		this.offsetX = p.offset[0];
		this.offsetY = p.offset[1];

		this.w = p.size[0];
		this.h = p.size[1];

		this.finished = false;
	}

	init() {
		this.finished = false;

		if(this.backgroundColor){
			console.log(this.backgroundColor);
			this.ctx.fillStyle = this.backgroundColor as string;
			this.ctx.fillRect(this.offsetX, this.offsetY, this.w, this.h);
		}
	};

	update() {};
}