#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform sampler2D u_texture;
uniform vec2 u_texture_size; // Added texture size uniform
uniform float u_gridSize;
uniform float u_radius;
uniform int u_inverted;
uniform int u_monotone;

void main() {
    // Get normalized coordinates
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

    // Calculate aspect ratios
    float textureAR = u_texture_size.x / u_texture_size.y;
    float canvasAR = u_resolution.x / u_resolution.y;

    // Adjust UVs to maintain aspect ratio (cover)
    vec2 adjustedUV = uv;

    if(canvasAR < textureAR) {
        // Canvas is wider than texture - crop sides
        float scale = canvasAR / textureAR;
        adjustedUV.x = (uv.x - 0.5) * scale + 0.5;
    } else {
        // Canvas is taller than texture - crop top/bottom
        float scale = textureAR / canvasAR;
        adjustedUV.y = (uv.y - 0.5) * scale + 0.5;
    }

    // Flip Y coordinate for proper orientation
    adjustedUV.y = 1.0 - adjustedUV.y;

    // Sample original texture for the color
    vec4 texColor = texture2D(u_texture, adjustedUV);

    gl_FragColor = texColor;

}