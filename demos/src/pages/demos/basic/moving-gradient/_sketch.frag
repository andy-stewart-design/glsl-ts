#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 outColor;

//https://iquilezles.org/articles/palettes/
vec3 palette(float t) {
    vec3 a = vec3(0.1);
    vec3 b = vec3(0.8);
    vec3 c = vec3(0.4);
    vec3 d = vec3(0.0, 0.1, 0.2);

    return a + b * cos(6.28318 * (c * t + d));
}

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
    // Normalize the coordinate space
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    // Remap the coordinate space from 0,1 to -1,1
    uv = uv * 2.0 - 1.0;

    uv *= 0.06;
    uv -= 0.03;

    float grain = rand(100.0 * uv);

    for(int n = 1; n < 2; n++) {
        float i = float(n);
        uv += vec2(sin(uv.x * 6.0 + sin(u_time + uv.y * 6.0) * 0.2), sin(uv.y * 6.0 + sin(u_time + uv.x * 6.0) * 0.2));
    }

    vec3 black = vec3(0.0, 0.0, 0.0);
    vec3 color = palette(uv.x * sin(1.0) + uv.y);
    vec3 colorGrained = palette(uv.x * sin(1.0) + uv.y + grain);

    color = mix(colorGrained, color, 0.925);
    color = mix(black, color, 0.9);

    outColor = vec4(color, 1.0);
}