import * as React from "react";

import Head from "next/head";
import Title from "~/components/Title";
import Box from "@mui/material/Box";
import { createShader, compileProgram } from "~/util/gl/shader";

import { Matrix4 } from "@math.gl/core"

const vertexSource = `#version 300 es
layout(location = 0) in vec4 a_position;
uniform mat4 u_view;

void main() {
	gl_Position = u_view * a_position;
}
`

const positionAttribLocation = 0;

const fragmentSource = `#version 300 es
precision highp float;

out vec4 outColor;

void main() {
	outColor = vec4(1, 0, 0.5, 1);
}
`

function init(canvas: HTMLCanvasElement, sizer: HTMLDivElement) {
	const gl = canvas.getContext("webgl2")!;

	let canvasSizeChanged = false;
	let canvasSize = [-1, -1]

	const onResize: ResizeObserverCallback = (entries: ResizeObserverEntry[]) => {
		for(const entry of entries){
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

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 200, 100, 0]), gl.STATIC_DRAW);

	const vao = gl.createVertexArray()
	gl.bindVertexArray(vao);
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.vertexAttribPointer(
		positionAttribLocation,
		2,
		gl.FLOAT,
		false,
		0,
		0
	);

	gl.useProgram(program);
	gl.bindVertexArray(vao);

	const viewMatrixLocation = gl.getUniformLocation(program, "u_view");

	const resizeCanvas = () => {
		if(canvasSizeChanged){
			canvas.width = canvasSize[0];
			canvas.height = canvasSize[1];
			canvasSizeChanged = false;
			gl.viewport(0, 0, canvas.width, canvas.height);

			const viewMatrix = new Matrix4().ortho({
				left: 0, right: canvas.width,
				bottom: 0, top: canvas.height,
				near: 0, far: 100
			});
			gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix, 0, viewMatrix.ELEMENTS);
		}
	}

	const draw = () => {
		resizeCanvas();

		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.drawArrays(gl.TRIANGLES, 0, 3);

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