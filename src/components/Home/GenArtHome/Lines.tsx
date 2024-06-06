import { Rect } from "~/util/gl/geometry";
import { gaussian } from "./Gaussian";
import { Artwork, ArtworkCustomParameter, ArtworkParameters } from "./Artwork";

const quad = t => t * t;

export class Lines extends Artwork {
	lines: Line[];

	get nLines() {
		return this.customParameters.get("nLines") as number ?? 50;
	}

	get minHue(){
		return this.customParameters.get("minHue") as number ?? 0;
	}

	get maxHue(){
		return this.customParameters.get("maxHue") as number ?? 360;
	}

	get disturbanceMult(){
		return this.customParameters.get("disturbanceMult") as number ?? 10;
	}

	init(): void {
		super.init();

		this.lines = Array.from({ length: this.nLines }).map((_, i) => {
			const line = new Line(
				{
					...this.p,
					offset: [0, i * this.h / this.nLines],
					size: [this.w, this.h / this.nLines],
				}
			);

			line.init();

			line.setCustomParameter("lightnessMult", quad(i / this.nLines));
			line.setCustomParameter("disturbanceMult", this.disturbanceMult * Math.log(i) / this.nLines);
			line.setCustomParameter("hue", i / this.nLines * (this.maxHue - this.minHue) + this.minHue);

			return line;
		});
	}

	get customParameterTypes(): ArtworkCustomParameter[] {
		return [
			...super.customParameterTypes,
			{
				name: "N Lines", key: "nLines",
				default: 50,
				type: "number",
				min: 0, max: 500,
				display: "slider",
				width: "16rem",
			},
			{
				name: "Min Hue", key: "minHue",
				default: 0,
				type: "number",
				min: 0, max: 360,
				display: "slider"
			},
			{
				name: "Max Hue", key: "maxHue",
				default: 360,
				type: "number",
				min: 0, max: 360,
				display: "slider"
			},
			{
				name: "Disturbance Mult", key: "disturbanceMult",
				default: 10,
				type: "number",
				min: 0, max: 50,
				display: "slider"
			},
		]
	}

	update(): void {
		let allLinesFinished = true;
		for(const line of this.lines){
			if(!line.finished){
				allLinesFinished = false;
				line.update();
			}
		}

		if(allLinesFinished){
			this.finished = true;
		}
	}
}

export class Line extends Artwork {
	x: number;
	lineCenterY: number;
	lineOffsetY: number;

	get px() {
		return this.offsetX + this.x;
	}

	get py() {
		return this.lineOffsetY + this.lineCenterY;
	}

	get disturbanceMult(){
		return this.customParameters.get("disturbanceMult") as number ?? 1;
	}

	get lightnessMult(){
		return this.customParameters.get("lightnessMult") as number ?? 1;
	}

	get hue(){
		return this.customParameters.get("hue") as number ?? 0;
	}

	init(){
		super.init();
		this.x = 0;
		this.lineCenterY = this.h / 2 + this.offsetY;
		this.lineOffsetY = 0;
	}

	update(): void {
		const disturbance = this.px / this.w * this.disturbanceMult;
		const lightness = this.px / this.w * this.lightnessMult;

		this.ctx.beginPath();

		this.ctx.strokeStyle = `hsl(${this.hue} 100% ${lightness * 50}%)`
		this.ctx.lineWidth = 2;

		this.ctx.moveTo(this.px, this.py);

		this.lineOffsetY = gaussian(0, 2) * disturbance + this.lineOffsetY;

		this.x++;

		this.ctx.lineTo(this.px, this.py);

		this.ctx.stroke();

		if (this.px > this.w + this.offsetX){
			this.finished = true;
		}
	}
}