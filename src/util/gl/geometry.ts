import { Quaternion, Vector3, Vector4 } from "@math.gl/core"

export const FLOAT_SIZE = 4
export const VERTEX_STRIDE = FLOAT_SIZE * 4 * 3

export type Vec3 = [number, number, number] | Vector3
export type Vec4 = [number, number, number, number] | Vector4

export type Transform = {
	origin?: Vector3,
	scale?: Vector3,
	rotation?: Quaternion,
	translation?: Vector3,
}

export function TransformPoint(transform: Transform, point: Vector3){
	const origin = transform.origin || Vector3.ZERO;
	return point
		.clone()
		.subtract(origin)
		.scale(transform.scale || new Vector3(1, 1, 1))
		.transformByQuaternion(transform.rotation || new Quaternion().identity())
		.add(origin)
		.add(transform.translation || Vector3.ZERO)
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
	flipFace?: boolean,
}

export function GenerateQuadVertices(quad: Quad): number[]{
	const {bottomLeft: a, topLeft: b, bottomRight: c, topRight: d, flipFace, color} = quad;
	const normal = new Vector4(...new Vector3()
		.subVectors(c, a)
		.cross(new Vector3().subVectors(b, a)), 1)
		.multiplyByScalar(flipFace ? -1 : 1);

	return flipFace !== true ? [
		...b, 1, ...color, ...normal,
		...a, 1, ...color, ...normal,
		...c, 1, ...color,  ...normal,

		...b, 1, ...color, ...normal,
		...c, 1, ...color, ...normal,
		...d, 1, ...color, ...normal,
	] : [
		...a, 1, ...color, ...normal,
		...b, 1, ...color, ...normal,
		...c, 1, ...color, ...normal,

		...c, 1, ...color, ...normal,
		...b, 1, ...color, ...normal,
		...d, 1, ...color, ...normal,
	]
}

export type UnitCube = {
	color: Vec4,
	transform?: Transform
}

export function GenerateUnitCubeVertices({color, transform}: UnitCube){
	const t = transform ? TransformPoint.bind(null, transform) : (x: Vector3) => x
	return [
		// front
		...GenerateQuadVertices({
			bottomLeft: t(new Vector3(0, 0, 0)),
			topLeft: t(new Vector3(0, 1, 0)),
			bottomRight: t(new Vector3(1, 0, 0)),
			topRight: t(new Vector3(1, 1, 0)),
			color,
			flipFace: true,
		}),
		// bottom
		...GenerateQuadVertices({
			bottomLeft: t(new Vector3(0, 0, 0)),
			topLeft: t(new Vector3(0, 0, 1)),
			bottomRight: t(new Vector3(1, 0, 0)),
			topRight: t(new Vector3(1, 0, 1)),
			color,
			flipFace: false
		}),
		// left
		...GenerateQuadVertices({
			bottomLeft: t(new Vector3(0, 0, 0)),
			topLeft: t(new Vector3(0, 0, 1)),
			bottomRight: t(new Vector3(0, 1, 0)),
			topRight: t(new Vector3(0, 1, 1)),
			color,
			flipFace: true,
		}),

		// back
		...GenerateQuadVertices({
			bottomLeft: t(new Vector3(0, 0, 1)),
			topLeft: t(new Vector3(0, 1, 1)),
			bottomRight: t(new Vector3(1, 0, 1)),
			topRight: t(new Vector3(1, 1, 1)),
			color,
			flipFace: false,
		}),
		// top
		...GenerateQuadVertices({
			bottomLeft: t(new Vector3(0, 1, 0)),
			topLeft: t(new Vector3(0, 1, 1)),
			bottomRight: t(new Vector3(1, 1, 0)),
			topRight: t(new Vector3(1, 1, 1)),
			color,
			flipFace: true
		}),
		// right
		...GenerateQuadVertices({
			bottomLeft: new Vector3(1, 0, 0),
			topLeft: new Vector3(1, 0, 1),
			bottomRight: new Vector3(1, 1, 0),
			topRight: new Vector3(1, 1, 1),
			color,
			flipFace: false,
		}),
	]
}