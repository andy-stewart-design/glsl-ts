#version 300 es
precision highp float;

#define PI 3.1415926535897932384626433832795

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_amplitude;
uniform float u_wavelength;
uniform float u_speed;
// uniform float u_midline;
out vec4 outColor;

const float TWO_PI = 2. * PI;
const vec3 color_1 = vec3(0.97, 0.83, 0.21);
const vec3 color_2 = vec3(0.93, 0.11, 0.57);

float noise(float x, float time) {
    // Set up wave params
    float L = TWO_PI * u_wavelength; // wavelength
    float A = u_amplitude; // amplitude
    float S = u_speed * TWO_PI; // period/speed

    // Create a stack of sin waves
    float sum = 0.;
    sum += sin(x * (L / 1.000) + time * (0.90 * S)) * (A * 0.64);
    sum += sin(x * (L / 1.153) + time * (1.15 * S)) * (A * 0.40);
    sum += sin(x * (L / 1.622) + time * (-0.75 * S)) * (A * 0.48);
    sum += sin(x * (L / 1.871) + time * (0.65 * S)) * (A * 0.43);
    sum += sin(x * (L / 2.013) + time * (-1.05 * S)) * (A * 0.32);
    return sum;
}

float wave_alpha(float x, float midline, float time) {
    float sum = noise(x, time);
    float dist = midline + sum;
    float alpha = (sign(dist) + 1.0) / 2.0;
    return alpha;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.y = 1. - uv.y;

    float lp_1 = 0.;
    float hp_1 = 0.625;
    vec3 gradient_1 = mix(color_1, color_2, max(min((uv.y - lp_1) / (hp_1 - lp_1), 1.0), 0.0));

    float lp_2 = 0.125;
    float hp_2 = 0.875;
    vec3 gradient_2 = mix(color_1, color_2, max(min((uv.y - lp_2) / (hp_2 - lp_2), 1.0), 0.0));

    float lp_3 = 0.375;
    float hp_3 = 1.;
    vec3 gradient_3 = mix(color_1, color_2, max(min((uv.y - lp_3) / (hp_3 - lp_3), 1.0), 0.0));

    // float blur = mix(0.0, (210. - u_blur), (1. - uv.x));
    // float alpha = clamp(dist, 0., 1.);

    float alpha_1 = wave_alpha(uv.x, uv.y - 0.3, u_time * 0.5);
    float alpha_2 = wave_alpha(uv.x, uv.y - 0.6, u_time + PI * 1.333);
    vec3 color = gradient_1;
    color = mix(color, gradient_2, alpha_1);
    color = mix(color, gradient_3, alpha_2);

    outColor = vec4(color, 1.0);
}