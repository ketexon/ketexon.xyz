export function createShader(
	gl: WebGL2RenderingContext,
	type: number,
	source: string
): WebGLShader {
	const shader = gl.createShader(type)!;
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if(!success){
		const message = `Could not compile shader: ${gl.getShaderInfoLog(shader)}`;
		gl.deleteShader(shader);
		throw message;
	}
	return shader;
}

export function compileProgram(
	gl: WebGL2RenderingContext,
	...shaders: WebGLShader[]
): WebGLProgram {
	const program = gl.createProgram()!;

	for(const shader of shaders){
		gl.attachShader(program, shader);
	}
	gl.linkProgram(program);

	const success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if(!success){
		const message = `Could not link program: ${gl.getProgramInfoLog(program)}`;
		gl.deleteProgram(program);
		throw message;
	}

	return program;
}