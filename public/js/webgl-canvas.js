var start = function() {
    const canvas = document.querySelector("canvas");
    const gl = canvas.getContext("webgl");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    const vs = `
				// an attribute will receive data from a buffer
				attribute vec4 a_position;

				// all shaders have a main function
				void main() {

					// gl_Position is a special variable a vertex shader
					// is responsible for setting
					gl_Position = a_position;
				}
			`;

    const fs = `
				precision highp float;

				uniform vec2 u_resolution;
				uniform vec2 u_mouse;
				uniform float u_time;

				void main(void) {
		
					// get frag coords
					vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
					// preserve aspect ratio
                    float aspect = u_resolution.x / u_resolution.y;
					uv.x *= aspect;
					// adjust mouse coords
					vec2 mouse = vec2(aspect*((2.*u_mouse.x/u_resolution.x) - 1.), (-2.*u_mouse.y/u_resolution.y) + 1.);

					gl_FragColor = vec4(uv.x-mouse.x, uv.y-mouse.y, 0., 1.);
				}
	`;

    // setup GLSL program
    const program = webglUtils.createProgramFromSources(gl, [vs, fs]);

    // look up where the vertex data needs to go.
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // look up uniform locations
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const timeLocation = gl.getUniformLocation(program, "u_time");

    // Create a buffer to put three 2d clip space points in
    const positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // fill it with a 2 triangles that cover clipspace
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, // first triangle
        1, -1, -1, 1, -1, 1, // second triangle
        1, -1,
        1, 1,
    ]), gl.STATIC_DRAW);

    let mouseX = 0;
    let mouseY = 0;

    // pointer lock
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;

    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

    document.addEventListener("mousemove", updatePosition, false);

    function updatePosition(e) {
        var rect = e.target.getBoundingClientRect();
        mouseX = e.clientX - rect.left; // x position within the element.
        mouseY = e.clientY - rect.top; // y position within the element.
    }

    function render(time) {
        time *= 0.001; // convert to seconds

        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        gl.vertexAttribPointer(
            positionAttributeLocation,
            2, // 2 components per iteration
            gl.FLOAT, // the data is 32bit floats
            false, // don't normalize the data
            0, // 0 = move forward size * sizeof(type) each iteration to get the next position
            0, // start at the beginning of the buffer
        );

        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(mouseLocation, mouseX, mouseY);
        gl.uniform1f(timeLocation, time);

        gl.drawArrays(
            gl.TRIANGLES,
            0, // offset
            6, // num vertices to process
        );

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}