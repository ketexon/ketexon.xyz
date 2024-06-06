import React from "react"
import { compileProgram, createShader } from "~/util/gl/shader";

const POS_LOCATION = 0;

const vert =
`#version 300 es

layout (location = ${POS_LOCATION}) in vec3 aPos;

void main()
{
    gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);
}
`

const frag =
`#version 300 es
precision highp float;

out vec4 color;

void main()
{
    color = vec4(1.0f, 0.5f, 0.2f, 1.0f);
}
`

function render(canvas: HTMLCanvasElement): () => void {
	const gl = canvas.getContext("webgl2");
	if(!gl){
		throw "WebGL2 not supported";
	}

	const program = (() => {
		const vertShader = createShader(gl, gl.VERTEX_SHADER, vert);
		const fragShader = createShader(gl, gl.FRAGMENT_SHADER, frag);

		const res = compileProgram(gl, vertShader, fragShader);
		gl.deleteShader(vertShader);
		gl.deleteShader(fragShader);

		return res;
	})();

	gl.useProgram(program);
	gl.vertexAttribPointer(POS_LOCATION, 3, gl.FLOAT, false, 3 * 4, 0);

	const vao = gl.createVertexArray();
	gl.bindVertexArray(vao);

	const vbo = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

	return () => {
		gl.deleteVertexArray(vao);
		gl.deleteBuffer(vbo);
		gl.deleteProgram(program);
	}
}

export default function Demo(){
	const canvasRef = React.useRef<HTMLCanvasElement>(null);

	React.useEffect(() => {
		if(canvasRef.current){
			return render(canvasRef.current);
		}
	}, [canvasRef])

	return <canvas width="640" height="480" ref={canvasRef}>

	</canvas>
}