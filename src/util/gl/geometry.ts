import { Quaternion, Vector3, Vector4 } from "@math.gl/core"
import { Ray } from "~/util/gl/physics"

export const FLOAT_SIZE = 4
export const INT_SIZE = 4
export const VERTEX_STRIDE = FLOAT_SIZE * 4 * 3 + INT_SIZE


export type Vec3 = [number, number, number] | Vector3
export type Vec4 = [number, number, number, number] | Vector4

export abstract class COLOR {
	static readonly TRANSPARENT = Vector4.ZERO;
	static readonly BLACK = new Vector4(0, 0, 0, 1);
	static readonly RED = new Vector4(1, 0, 0, 1);
	static readonly YELLOW = new Vector4(1, 1, 0, 1);
	static readonly GREEN = new Vector4(0, 1, 0, 1);
	static readonly CYAN = new Vector4(0, 1, 1, 1);
	static readonly BLUE = new Vector4(0, 0, 1, 1);
	static readonly MAGENTA = new Vector4(1, 0, 1, 1);
	static readonly WHITE = new Vector4(1, 1, 1, 1);
}

export type TransformConstructor = Partial<{
	origin: Vector3,
	scale: Vector3,
	rotation: Quaternion,
	translation: Vector3,
}>

export class Transform {
	static IDENTITY: Transform = new Transform();

	public origin: Vector3 = Vector3.ZERO;
	public scale: Vector3 = new Vector3(1, 1, 1);
	public rotation: Quaternion = new Quaternion().identity();
	public translation: Vector3 = Vector3.ZERO;

	constructor(args?: TransformConstructor){
		if(args){
			const {origin, scale, rotation, translation} = args;

			this.origin = origin || this.origin;
			this.scale = scale || this.scale;
			this.rotation = rotation || this.rotation;
			this.translation = translation || this.translation;
		}
	}

	transformPoint(point: Vector3, offsetOrigin: boolean = false){
		point.subtract(this.origin)
			.scale(this.scale)
			.transformByQuaternion(this.rotation)
			.add(offsetOrigin ? Vector3.ZERO : this.origin)
			.add(this.translation)
		return point;
	}
}

export function GetVertexInBuffer(buffer: Float32Array, i: number): Float32Array {
	const start = i * VERTEX_STRIDE / FLOAT_SIZE;
	return buffer.subarray(start, start + VERTEX_STRIDE)
}

export type Quad = {
	bottomLeft: Vec3,
	topLeft: Vec3,
	bottomRight: Vec3,
	topRight: Vec3,
	color: Vec4,
	material?: number,
	flipFace?: boolean,
}

export function GenerateQuadVertices(quad: Quad): number[]{
	const {
		bottomLeft: a, topLeft: b, bottomRight: c, topRight: d,
		flipFace,
		color
	} = quad;

	const material = quad.material || 0

	const normal = new Vector4(
		...new Vector3()
			.subVectors(c, a)
			.cross(new Vector3().subVectors(b, a))
			.multiplyByScalar(flipFace ? -1 : 1),
		1
	);

	return flipFace !== true ? [
		...b, 1, ...color, ...normal, material,
		...a, 1, ...color, ...normal, material,
		...c, 1, ...color,  ...normal, material,

		...b, 1, ...color, ...normal, material,
		...c, 1, ...color, ...normal, material,
		...d, 1, ...color, ...normal, material,
	] : [
		...a, 1, ...color, ...normal, material,
		...b, 1, ...color, ...normal, material,
		...c, 1, ...color, ...normal, material,

		...c, 1, ...color, ...normal, material,
		...b, 1, ...color, ...normal, material,
		...d, 1, ...color, ...normal, material,
	]
}

export type PrimitiveConstructor = Partial<{
	color: Vector4,
	transform: Transform,
	material: number,
}>

export abstract class Primitive {
	color: Vector4 = COLOR.WHITE;
	transform: Transform = Transform.IDENTITY;
	material: number = 0;

	constructor(args?: PrimitiveConstructor){
		if(args){
			const {color, transform, material} = args;
			this.color = color || this.color;
			this.transform = transform || this.transform;
			this.material = material || this.material;
		}
	}

	abstract generateVertices(): number[];
}

export class Rect extends Primitive {
	generateVertices(): number[] {
		const t = (point: Vector3) => this.transform.transformPoint(point, true);
		return [
			...GenerateQuadVertices({
				bottomLeft: t(new Vector3(0, 0, 0)),
				topLeft: t(new Vector3(0, 0, 1)),
				bottomRight: t(new Vector3(1, 0, 0)),
				topRight: t(new Vector3(1, 0, 1)),
				color: this.color,
				flipFace: true,
				material: this.material,
			}),
		]
	}
}

export class Cube extends Primitive {
	generateVertices(): number[] {
		const t = (point: Vector3) => this.transform.transformPoint(point, true);
		return [
			// front
			...GenerateQuadVertices({
				bottomLeft: t(new Vector3(0, 0, 0)),
				topLeft: t(new Vector3(0, 1, 0)),
				bottomRight: t(new Vector3(1, 0, 0)),
				topRight: t(new Vector3(1, 1, 0)),
				color: this.color,
				material: this.material,
				flipFace: true,
			}),
			// bottom
			...GenerateQuadVertices({
				bottomLeft: t(new Vector3(0, 0, 0)),
				topLeft: t(new Vector3(0, 0, 1)),
				bottomRight: t(new Vector3(1, 0, 0)),
				topRight: t(new Vector3(1, 0, 1)),
				color: this.color,
				material: this.material,
				flipFace: false
			}),
			// left
			...GenerateQuadVertices({
				bottomLeft: t(new Vector3(0, 0, 0)),
				topLeft: t(new Vector3(0, 0, 1)),
				bottomRight: t(new Vector3(0, 1, 0)),
				topRight: t(new Vector3(0, 1, 1)),
				color: this.color,
				material: this.material,
				flipFace: true,
			}),

			// back
			...GenerateQuadVertices({
				bottomLeft: t(new Vector3(0, 0, 1)),
				topLeft: t(new Vector3(0, 1, 1)),
				bottomRight: t(new Vector3(1, 0, 1)),
				topRight: t(new Vector3(1, 1, 1)),
				color: this.color,
				material: this.material,
				flipFace: false,
			}),
			// top
			...GenerateQuadVertices({
				bottomLeft: t(new Vector3(0, 1, 0)),
				topLeft: t(new Vector3(0, 1, 1)),
				bottomRight: t(new Vector3(1, 1, 0)),
				topRight: t(new Vector3(1, 1, 1)),
				color: this.color,
				material: this.material,
				flipFace: true
			}),
			// right
			...GenerateQuadVertices({
				bottomLeft: t(new Vector3(1, 0, 0)),
				topLeft: t(new Vector3(1, 0, 1)),
				bottomRight: t(new Vector3(1, 1, 0)),
				topRight: t(new Vector3(1, 1, 1)),
				color: this.color,
				material: this.material,
				flipFace: false,
			}),
		]
	}
}

export type SceneConstructorOptions = {
	objects: {[k: string | number | symbol]: Primitive}
}

export type SceneObject = {
	primitive: Primitive,
	subarray: Float32Array,
}

export class Scene {
	objects: {[k: string | number | symbol]: SceneObject} = {}
	vertices: Float32Array

	constructor({objects}: SceneConstructorOptions) {
		const objectVerticesEntries: [string, number[]][] = Object.entries(objects).map(([key, primitive]) => [
			key,
			primitive instanceof Array ? primitive.map(p => p.generateVertices()) : primitive.generateVertices()
		]);
		const nFloats = objectVerticesEntries.reduce((acc, [key, verticies]) => acc + verticies.length, 0);

		this.vertices = new Float32Array(nFloats);

		let offset = 0;
		for(const [key, vertices] of objectVerticesEntries){
			this.vertices.set(vertices, offset);
			this.objects[key] = {
				primitive: objects[key] as Primitive,
				subarray: this.vertices.subarray(offset, offset + vertices.length),
			}
			offset += vertices.length
		}
	}

	get bufferSize(): number {
		return this.vertices.length * FLOAT_SIZE;
	}

	get points(): number {
		return this.bufferSize / VERTEX_STRIDE;
	}

	regenerateObject(id: string | number | symbol){
		const newVerts = this.objects[id].primitive.generateVertices();
		this.objects[id].subarray.set(newVerts);
	}
}