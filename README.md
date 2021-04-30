# fragment-shader-template
This is a node.js fullscreen WebGL fragment shader template.

CLI setup is:
```
git clone https://github.com/wnbaum/fragment-shader-template
npm install
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

Changes will be made in the future to load the fragment shader from a file. Also dynamic canvas resizing would be desireable.
