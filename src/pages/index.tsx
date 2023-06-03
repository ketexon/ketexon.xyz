import * as React from "react";

import Head from "next/head";
import Title from "~/components/Title";
import Box from "@mui/material/Box";
import { createShader, compileProgram } from "~/util/gl/shader";

import { Matrix4, Quaternion, Vector3, Vector4 } from "@math.gl/core"
import { FLOAT_SIZE, GenerateUnitCubeVertices, VERTEX_STRIDE } from "~/util/gl/geometry"

const positionAttribLocation = 0;
const colorAttribLocation = 1;
const normalAttribLocation = 2;

const viewUniformName = "u_view";

const ambientStrenghtUniformName = "u_ambientStrength";
const ambientColorUniformName = "u_ambientColor";

const directionalLightStrengthUniformName = "u_directionalLightStrength";
const directionalLightColorUniformName = "u_directionalLightColor";
const directionalLightPositionUniformName = "u_directionalLightPosition";


const vertexSource = `#version 300 es
layout(location = ${positionAttribLocation}) in vec4 a_position;
layout(location = ${colorAttribLocation}) in vec4 a_color;
layout(location = ${normalAttribLocation}) in vec4 a_normal;
uniform mat4 ${viewUniformName};

out vec4 v_position;
out vec4 v_color;
out vec4 v_normal;

void main() {
	gl_Position = ${viewUniformName} * a_position;

	v_position = a_position;
	v_color = a_color;
	v_normal = a_normal;
}
`

const fragmentSource = `#version 300 es
precision highp float;

in vec4 v_position;
in vec4 v_color;
in vec4 v_normal;

uniform float ${ambientStrenghtUniformName};
uniform vec3 ${ambientColorUniformName};

uniform float ${directionalLightStrengthUniformName};
uniform vec4 ${directionalLightPositionUniformName};
uniform vec3 ${directionalLightColorUniformName};

out vec4 outColor;

void main() {
	vec3 ambient = ${ambientStrenghtUniformName} * ${ambientColorUniformName};

	vec4 lightDir = normalize(${directionalLightPositionUniformName} - v_position);
	float diffuseStrength = max(dot(lightDir, normalize(v_normal)), 0.0) * ${directionalLightStrengthUniformName};

	outColor = v_color * vec4(ambient + diffuseStrength * ${directionalLightColorUniformName}, 1);
}
`

function init(canvas: HTMLCanvasElement, sizer: HTMLDivElement) {
	const gl = canvas.getContext("webgl2")!;

	gl.enable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);

	gl.cullFace(gl.BACK);


	let canvasSizeChanged = false;
	let canvasSize = [-1, -1]
	let canvasSizePx = [-1, -1]

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

	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
	const program = compileProgram(gl, vertexShader, fragmentShader);

	const vertices = new Float32Array(GenerateUnitCubeVertices({
		color: new Vector4(1, 0, 0, 1),
		transform: {
			origin: new Vector3(0.5, 0.5, 0.5),
			translation: new Vector3(0.5, 0.5, 0.5).scale(-1),
		}
	}))

	const vao = gl.createVertexArray()
	gl.bindVertexArray(vao);

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);
	gl.enableVertexAttribArray(normalAttribLocation);

	const nTriangles = vertices.length * FLOAT_SIZE / VERTEX_STRIDE;

	gl.vertexAttribPointer(
		positionAttribLocation,
		4,
		gl.FLOAT,
		false,
		VERTEX_STRIDE,
		0
	);

	gl.vertexAttribPointer(
		colorAttribLocation,
		4,
		gl.FLOAT,
		false,
		VERTEX_STRIDE,
		4 * FLOAT_SIZE
	);

	gl.vertexAttribPointer(
		normalAttribLocation,
		4,
		gl.FLOAT,
		false,
		VERTEX_STRIDE,
		8 * FLOAT_SIZE
	);

	gl.useProgram(program);

	const viewMatrixLocation = gl.getUniformLocation(program, viewUniformName);

	const ambientStrengthLocation = gl.getUniformLocation(program, ambientStrenghtUniformName);
	const ambientColorLocation = gl.getUniformLocation(program, ambientColorUniformName);

	const directionalStrengthLocation = gl.getUniformLocation(program, directionalLightStrengthUniformName);
	const directionalPositionLocation = gl.getUniformLocation(program, directionalLightPositionUniformName);
	const directionalColorLocation = gl.getUniformLocation(program, directionalLightColorUniformName);

	gl.uniform1f(ambientStrengthLocation, 0.5);
	gl.uniform3fv(ambientColorLocation, new Vector3(1, 1, 1));

	gl.uniform1f(directionalStrengthLocation, 0.5);
	gl.uniform4fv(directionalPositionLocation, new Vector4(5, -5, 5, 1));
	gl.uniform3fv(directionalColorLocation, new Vector3(1, 1, 1));

	let proj = new Matrix4();
	let view = new Matrix4();
	let worldToLocal = new Matrix4();

	let viewEye = new Vector3([-5, 5, 5]);

	const resizeCanvas = () => {
		if(canvasSizeChanged){
			canvas.style.width = `${canvasSizePx[0]}px`;
			canvas.style.height = `${canvasSizePx[1]}px`;
			canvas.width = canvasSize[0];
			canvas.height = canvasSize[1];
			canvasSizeChanged = false;
			gl.viewport(0, 0, canvas.width, canvas.height);

			const canvasHtoW = canvas.height/canvas.width;

			proj.ortho({
				left: -5, right: 5,
				bottom: -canvasHtoW*5, top: canvasHtoW*5,
				near: 0, far: 100,
			})

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
		gl.useProgram(program);
		gl.uniformMatrix4fv(viewMatrixLocation, false, worldToLocal, 0, worldToLocal.ELEMENTS);
	}

	let currentTime: number;
	let lastFrameTime: number | null = null;
	let delta: number | null = null;

	const draw = () => {
		currentTime = performance.now();
		if(lastFrameTime !== null){
			delta = currentTime - lastFrameTime;
		}

		resizeCanvas();

		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.drawArrays(gl.TRIANGLES, 0, nTriangles);

		// viewEye.set(
		// 	5 * Math.sin(currentTime / 2000),
		// 	5,
		// 	5 * Math.cos(currentTime / 2000),
		// )

		// view.lookAt({eye: viewEye, center: [0,0,0], up: [0,1,0]})
		// updateWorldToLocal();
		// gl.uniform4fv(directionalPositionLocation, new Vector4(5 * Math.cos(currentTime / 500), -5, 5 * Math.sin(currentTime / 500), 1));

		lastFrameTime = currentTime;

		requestAnimationFrame(draw);
	}

	requestAnimationFrame(draw);

	const destroy = () => {
		gl.deleteProgram(program);

		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
	}
	return destroy;
}

export default function Home(){
	const canvasRef = React.createRef<HTMLCanvasElement>();
	const boxRef = React.createRef<HTMLDivElement>();
	React.useEffect(() => {
		if(!canvasRef.current || !boxRef.current) return;
		return init(canvasRef.current!, boxRef.current!);
	})

	return <Box position="relative" width="100%" height="100%" overflow="hidden">
		<Title/>
		<Box ref={boxRef} sx={{display: "flex", height: "100%", width: "100%"}}></Box>
		<canvas ref={canvasRef} style={{
			display: "block",
			position: "absolute",
			top: 0,
			left: 0
		}}/>
	</Box>
}