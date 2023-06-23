
import { createShader, compileProgram } from "~/util/gl/shader";

import { Matrix4, Quaternion, Vector3, Vector4, lerp } from "@math.gl/core"
import { Cube, FLOAT_SIZE, Rect, Scene, Transform, VERTEX_STRIDE } from "~/util/gl/geometry"
import { Theme } from "@mui/material/styles";

import { hexToRGBA } from "~/util/hexToRGB";
import { Synth } from "~/util/audio/synth";

const GRID_LENGTH = 6;
const GRID_STRIDE = 1.1;

const CAMERA_MIN_HEIGHT = 4;
const CAMERA_MIN_WIDTH = (GRID_LENGTH * GRID_STRIDE - 0.1) * Math.SQRT2 / 2 + 1;
const CAMERA_MAX_WTOH = CAMERA_MIN_WIDTH/CAMERA_MIN_HEIGHT;

const CUBE_DEFAULT_HEIGHT = -0.49;
const CUBE_HOVER_HEIGHT = -0.40;
const CUBE_PRESS_HEIGHT = 0.5;
const CUBE_HEIGHT_EPSILON = 0.0001;
const CUBE_LERP_MULT = 20;

const positionAttribLocation = 0;
const colorAttribLocation = 1;
const normalAttribLocation = 2;
const materialAttribLocation = 3;

const viewUniformName = "u_view";

const ambientStrenghtUniformName = "u_ambientStrength";
const ambientColorUniformName = "u_ambientColor";

const directionalLightStrengthUniformName = "u_directionalLightStrength";
const directionalLightColorUniformName = "u_directionalLightColor";
const directionalLightDirectionUniformName = "u_directionalLightDirection";


const vertexSource = `#version 300 es
layout(location = ${positionAttribLocation}) in vec4 a_position;
layout(location = ${colorAttribLocation}) in vec4 a_color;
layout(location = ${normalAttribLocation}) in vec4 a_normal;
layout(location = ${materialAttribLocation}) in float a_material;

uniform mat4 ${viewUniformName};

out vec4 v_position;
out vec4 v_color;
out vec4 v_normal;
out float v_material;

void main() {
	gl_Position = ${viewUniformName} * a_position;

	v_position = a_position;
	v_color = a_color;
	v_normal = a_normal;
	v_material = a_material;
}
`

const fragmentSource = `#version 300 es
precision highp float;

in vec4 v_position;
in vec4 v_color;
in vec4 v_normal;
in float v_material;

uniform float ${ambientStrenghtUniformName};
uniform vec3 ${ambientColorUniformName};

uniform float ${directionalLightStrengthUniformName};
uniform vec4 ${directionalLightDirectionUniformName};
uniform vec3 ${directionalLightColorUniformName};

out vec4 outColor;

bool approx(float a, float b){
	return abs(b - a) < 0.01f;
}

void main() {
	if(approx(v_material, 1.0f)){
		vec3 ambient = ${ambientStrenghtUniformName} * ${ambientColorUniformName};

		float diffuseStrength = max(dot(-${directionalLightDirectionUniformName}, normalize(v_normal)), 0.0) * ${directionalLightStrengthUniformName};

		outColor = v_color * vec4(ambient + diffuseStrength * ${directionalLightColorUniformName}, 1);
	}
	else{
		outColor = v_color;
	}
}
`

export function initHomeGL(canvas: HTMLCanvasElement, sizer: HTMLDivElement, theme: Theme) {
	const synth = new Synth();

	let mousePosition = [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY];

	let canvasSizeChanged = false;
	let canvasSize = [-1, -1]
	let canvasSizePx = [-1, -1]
	let canvasWtoH = -1;
	let canvasHtoW = -1;

	canvas.addEventListener("mousemove", (event) => {
		mousePosition = [
			event.offsetX / canvasSizePx[0] * 2 - 1,
			-(event.offsetY / canvasSizePx[1] * 2 - 1)
		];
	});

	const onResize: ResizeObserverCallback = (entries: ResizeObserverEntry[]) => {
		for(const entry of entries){
			canvasSizePx = [entry.contentBoxSize[0].inlineSize, entry.contentBoxSize[0].blockSize]
			const contentBoxSize = entry.devicePixelContentBoxSize ? entry.devicePixelContentBoxSize[0] : entry.contentBoxSize[0];
			const dpr = entry.devicePixelContentBoxSize ? 1 : window.devicePixelRatio;
			const width = Math.round(contentBoxSize.inlineSize * dpr);
			const height = Math.round(contentBoxSize.blockSize * dpr);
			if(canvasSize[0] != width || canvasSize[1] != height){
				canvasSizeChanged = true;
			}
			canvasSize = [width, height]
		}
	}

	const resizeObserver = new ResizeObserver(onResize);

	try {
		resizeObserver.observe(sizer, {box: 'device-pixel-content-box'});
	} catch (ex) {
		resizeObserver.observe(sizer, {box: 'content-box'});
	}

	const gl = canvas.getContext("webgl2")!;

	gl.enable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);

	gl.cullFace(gl.BACK);

	const palette = {
		primary: new Vector4(hexToRGBA(theme.palette.primary.main)),
		secondary: new Vector4(hexToRGBA(theme.palette.secondary.main)),
	}

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
	const program = compileProgram(gl, vertexShader, fragmentShader);

	const intersectCube = ([x, z]: [number, number]): [number, number] | null => {
		// each cube(xIdx)(zIdx) origin is at
		// 		new Vector3((xIdx - GRID_LENGTH/2) * GRID_STRIDE, -0.49, (zIdx - GRID_LENGTH/2) * GRID_STRIDE).add([0.5, 0, 0.5])
		// and x,z should be within 0.5 of the origin
		// so -0.5 < (xIdx - GRID_LENGTH/2) * GRID_STRIDE + 0.5 - x < 0.5
		// 			-1 + x < (xIdx - GRID_LENGTH/2) * GRID_STRIDE < x
		// 			(-1 + x)/GRID_STRIDE < xIdx - GRID_LENGTH/2 < x/GRID_STRIDE
		// 			(-1 + x)/GRID_STRIDE + GRID_LENGTH/2 < xIdx < x/GRID_STRIDE + GRID_LENGTH/2
		// thus, since xIdx is an integer, ceil((-1 + x)/GRID_STRIDE + GRID_LENGTH/2) <= xIdx <= floor(x/GRID_STRIDE + GRID_LENGTH/2)
		const xIdx = Math.ceil((-1 + x)/GRID_STRIDE + GRID_LENGTH/2);
		const zIdx = Math.ceil((-1 + z)/GRID_STRIDE + GRID_LENGTH/2);
		if(
			!Number.isFinite(xIdx) || !Number.isFinite(zIdx)
			|| xIdx < 0 || xIdx >= GRID_LENGTH
			|| zIdx < 0 || zIdx >= GRID_LENGTH
			|| (-1 + x)/GRID_STRIDE + GRID_LENGTH/2 > xIdx
			|| xIdx > x/GRID_STRIDE + GRID_LENGTH/2
			|| (-1 + z)/GRID_STRIDE + GRID_LENGTH/2 > zIdx
			|| zIdx > z/GRID_STRIDE + GRID_LENGTH/2
		){
			return null;
		}

		return [xIdx, zIdx];
	}

	const scene = new Scene({
		objects: {
			...Object.fromEntries(
				new Array(GRID_LENGTH).fill(0).flatMap(
					(_, x) => new Array(GRID_LENGTH).fill(0).map(
						(_, z) => [
							`cube${x}${z}`,
							new Cube({
								color: palette.primary,
								transform: new Transform({
									origin: new Vector3(0.5, 0.5, 0.5),
									translation: new Vector3((x - GRID_LENGTH/2) * GRID_STRIDE, -0.49, (z - GRID_LENGTH/2) * GRID_STRIDE).add([0.5, 0, 0.5]),
								}),
								material: 1,
							})
						]
					)
				)
			),
			floor: new Rect({
				color: palette.secondary,
				transform: new Transform({
					origin: new Vector3(0.5, 0, 0.5),
					translation: new Vector3(0.5, 0, 0.5).scale(-1),
					scale: new Vector3(100, 100, 100)
				}),
				material: 0,
			})
		}
	})

	const vao = gl.createVertexArray()
	gl.bindVertexArray(vao);

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	const rebufferData = () => {
		gl.bufferData(gl.ARRAY_BUFFER, scene.vertices, gl.DYNAMIC_DRAW);
	}
	rebufferData();

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
	gl.enableVertexAttribArray(normalAttribLocation);
	gl.enableVertexAttribArray(materialAttribLocation);

	let offset = 0;
	gl.vertexAttribPointer(
		positionAttribLocation,
		4,
		gl.FLOAT,
		false,
		VERTEX_STRIDE,
		offset
	);
	offset += 4 * FLOAT_SIZE;

	gl.vertexAttribPointer(
		colorAttribLocation,
		4,
		gl.FLOAT,
		false,
		VERTEX_STRIDE,
		offset
	);
	offset += 4 * FLOAT_SIZE;

	gl.vertexAttribPointer(
		normalAttribLocation,
		4,
		gl.FLOAT,
		false,
		VERTEX_STRIDE,
		offset
	);
	offset += 4 * FLOAT_SIZE;

	gl.vertexAttribPointer(
		materialAttribLocation,
		1,
		gl.FLOAT,
		false,
		VERTEX_STRIDE,
		offset
	);
	offset += FLOAT_SIZE;

	gl.useProgram(program);

	const viewMatrixLocation = gl.getUniformLocation(program, viewUniformName);

	const ambientStrengthLocation = gl.getUniformLocation(program, ambientStrenghtUniformName);
	const ambientColorLocation = gl.getUniformLocation(program, ambientColorUniformName);

	const directionalStrengthLocation = gl.getUniformLocation(program, directionalLightStrengthUniformName);
	const directionalDirectionLocation = gl.getUniformLocation(program, directionalLightDirectionUniformName);
	const directionalColorLocation = gl.getUniformLocation(program, directionalLightColorUniformName);

	gl.uniform1f(ambientStrengthLocation, 0.5);
	gl.uniform3fv(ambientColorLocation, new Vector3(1, 1, 1));

	gl.uniform1f(directionalStrengthLocation, 0.5);

	let lightAngleY = Math.PI * 5 / 6;

	gl.uniform4fv(
		directionalDirectionLocation,
		new Quaternion().rotateY(lightAngleY).rotateZ(-Math.PI/4).transformVector4([1, 0, 0, 0])
	);
	gl.uniform3fv(directionalColorLocation, new Vector3(1, 1, 1));

	let proj = new Matrix4();
	let view = new Matrix4();
	let worldToLocal = new Matrix4();
	let localToWorld = new Matrix4();

	let viewEye = new Vector4(new Quaternion().rotateY(Math.PI/4).rotateZ(-Math.PI/4).transformVector4([1, 0, 0, 0])).multiplyByScalar(-20);


	const resizeCanvas = () => {
		if(canvasSizeChanged){
			canvas.style.width = `${canvasSizePx[0]}px`;
			canvas.style.height = `${canvasSizePx[1]}px`;
			canvas.width = canvasSize[0];
			canvas.height = canvasSize[1];
			canvasSizeChanged = false;

			gl.viewport(0, 0, canvas.width, canvas.height);

			canvasHtoW = canvas.width/canvas.height;
			canvasWtoH = canvas.height/canvas.width;

			if(canvasHtoW > CAMERA_MAX_WTOH){
				proj.ortho({
					left: -CAMERA_MIN_HEIGHT * canvasHtoW, right: CAMERA_MIN_HEIGHT * canvasHtoW,
					bottom: -CAMERA_MIN_HEIGHT, top: CAMERA_MIN_HEIGHT,
					near: 0, far: 100,
				})
			}
			else{
				proj.ortho({
					left: -CAMERA_MIN_WIDTH, right: CAMERA_MIN_WIDTH,
					bottom: -CAMERA_MIN_WIDTH * canvasWtoH, top: CAMERA_MIN_WIDTH * canvasWtoH,
					near: 0, far: 100,
				})
			}

			view.lookAt({
				eye: viewEye,
				center: [0, 0, 0],
				up: [0, 1, 0]
			});

			updateWorldToLocal();
		}
	}

	function updateWorldToLocal(){
		worldToLocal.copy(view).multiplyLeft(proj);
		localToWorld.copy(worldToLocal).invert();
		gl.useProgram(program);
		gl.uniformMatrix4fv(viewMatrixLocation, false, worldToLocal, 0, worldToLocal.ELEMENTS);
	}

	enum CubeState {
		None,
		Hovered,
		Pressed,
	}

	const cubeStates = new Array(GRID_LENGTH).fill(0).flatMap(
		(_, x): [[number, number], CubeState][] => new Array(GRID_LENGTH).fill(0).map(
			(_, z) => [[x, z], CubeState.None]
		)
	)

	const getCubeState = ([x, z]: [number, number]) => cubeStates[x][z]
	const setCubeState = ([x, z]: [number, number], v: CubeState) => {cubeStates[x][z] = v};

	const cubesInProgress: Set<[number, number]> = new Set();
	let hoveredCubes: Set<[number, number]> = new Set();
	let pressedCubes: Set<[number, number]> = new Set();

	let clicked: boolean = false;

	canvas.addEventListener("mouseup", (ev) => {
		clicked = true;
		synth.ensureContext();
	})

	let currentTime: number;
	let lastFrameTime: number | null = null;
	let delta: number | null = null;

	let drawRequestID;

	const draw = () => {
		currentTime = performance.now();
		if(lastFrameTime !== null){
			delta = currentTime - lastFrameTime;
		}

		resizeCanvas();

		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.drawArrays(gl.TRIANGLES, 0, scene.points);

		if(delta){
			// console.log(mousePosition);
			const mouseWorld = new Vector3(localToWorld.transform(new Vector3(...mousePosition, 0)));
			// mouseWorld - (viewEye - center) * t
			// mouseWorld.y - (viewEye - center).y * t = 0
			// t = mouseWorld.y / Math.SQRT2/2
			const t = mouseWorld.y / viewEye.y;
			mouseWorld.subtract(viewEye.clone().multiplyByScalar(t))

			const intersection = intersectCube([mouseWorld.x, mouseWorld.z])
			if(intersection !== null){
				const cubeState = getCubeState(intersection);

				if(!hoveredCubes.has(intersection) && cubeState != CubeState.Pressed && !clicked){
					setCubeState(intersection, CubeState.Hovered);
					cubesInProgress.add(intersection);
				}
				hoveredCubes.forEach((cubeIdx) => {
					if(cubeIdx[0] === intersection[0] && cubeIdx[1] === intersection[1]) return;
					setCubeState(cubeIdx, CubeState.None);
					cubesInProgress.add(cubeIdx);
				})
				hoveredCubes.clear();
				if(!clicked && cubeState != CubeState.Pressed){
					hoveredCubes.add(intersection);
				}
				else if(clicked){
					if(cubeState === CubeState.Pressed){
						pressedCubes.delete(intersection);
						setCubeState(intersection, CubeState.None);
						synth.unpressCube(intersection);
					}
					else{
						pressedCubes.add(intersection);
						setCubeState(intersection, CubeState.Pressed);
						synth.pressCube(intersection);
					}

					cubesInProgress.add(intersection);
				}
			}
			else {
				hoveredCubes.forEach((cubeIdx) => {
					setCubeState(cubeIdx, CubeState.None);
					cubesInProgress.add(cubeIdx);
				})
			}

			const dirty = cubesInProgress.size > 0;
			for(const cubeIdx of cubesInProgress){
				const [x, z] = cubeIdx;
				const cubeID = `cube${x}${z}`
				const cubeState = getCubeState(cubeIdx);
				const targetY =
					cubeState === CubeState.None
					? CUBE_DEFAULT_HEIGHT
					: cubeState === CubeState.Hovered
						? CUBE_HOVER_HEIGHT
						: CUBE_PRESS_HEIGHT
				const transform = scene.objects[cubeID].primitive.transform;
				if(Math.abs(transform.translation.y - targetY) < CUBE_HEIGHT_EPSILON){
					transform.translation.y = targetY;
					cubesInProgress.delete(cubeIdx)
				}
				else{
					transform.translation.y = lerp(transform.translation.y, targetY, Math.min(delta/1000 * CUBE_LERP_MULT, 1))
				}
				scene.regenerateObject(cubeID);
			}
			if(dirty){
				rebufferData();
			}
		}

		// viewEye.set(
		// 	5 * Math.sin(currentTime / 2000),
		// 	5,
		// 	5 * Math.cos(currentTime / 2000),
		// )

		// view.lookAt({eye: viewEye, center: [0,0,0], up: [0,1,0]})
		// updateWorldToLocal();
		// gl.uniform4fv(directionalPositionLocation, new Vector4(5 * Math.cos(currentTime / 500), -5, 5 * Math.sin(currentTime / 500), 1));

		clicked = false;

		lastFrameTime = currentTime;

		drawRequestID = requestAnimationFrame(draw);
	}

	drawRequestID = requestAnimationFrame(draw);

	const destroy = () => {
		cancelAnimationFrame(drawRequestID);

		gl.deleteProgram(program);

		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);

		synth.close();
	}
	return destroy;
}