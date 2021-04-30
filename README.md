# fragment-shader-template
This is a node.js fullscreen WebGL fragment shader template.

CLI setup:
```
git clone https://github.com/wnbaum/fragment-shader-template
npm install
```

This project utilizes nodemon, so whenever you save a file, the server will be restarted as long as you run the server with the command:
```
npm run dev
```

To start the server normally, use:
```
npm start
```

To edit the fragment shader, edit the following GLSL found in the file `public/js/webgl-canvas.js`
```javascript
const fs = `
            precision highp float;

            uniform vec2 u_resolution;
            uniform vec2 u_mouse;
            uniform float u_time;

            void main(void) {

              ...

            }
`;
```

Changes will be made in the future to load the fragment shader from a file. Also dynamic canvas resizing would be desirable.
