import { Vector3 } from "@math.gl/core"

export type Ray = {
	origin: Vector3,
	direction: Vector3,
	length: number
}


type Object = {};

type TreeNode = {
	axis: 0 | 1 | 2,
	position: Vector3,
	object: Object,
}

// square magnitude
function distance(a: Vector3, b: Vector3): number {
	return a.clone().subtract(b).magnitudeSquared();
}

export class World {
	root?: TreeNode = undefined;

	addObject(vertices: Vector3[]): Object {
		const object = {};
		vertices.forEach(vertex => this.addPoint(vertex, object))
		return object;
	}

	addPoint(position: Vector3, object: Object) {
		if(this.root === undefined){
			this.root = {
				axis: 0,
				position: position,
				object
			}
		}
	}
}