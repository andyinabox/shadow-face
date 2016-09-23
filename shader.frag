precision highp float;
varying vec2 uv;
varying vec2 texCoord;

uniform float t;
uniform sampler2D tex;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 texel(vec2 uv);

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
// #pragma glslify: blur = require('glsl-fast-gaussian-blur') 
#pragma glslify: blur = require('glsl-hash-blur', sample=texel, iterations=20) 
#pragma glslify: map = require(glsl-map) 


vec3 texel(vec2 uv) {
  return texture2D(tex, uv).rgb;
}

void main() {
	float blur_radius = map(cos(t), -1.0, 1.0, 0.03, 0.08);
	float mix_amount = map(sin(t), -1.0, 1.0, 0.9, 1.0);

	// vec4 img = texture2D(tex, texCoord);
	vec3 noise = vec3(snoise3(vec3(uv, t)));
	// vec4 blurry = blur(tex, texCoord, resolution, vec2(sin(t), cos(t)));
	vec3 blurry = blur(texCoord, blur_radius, (resolution.x / resolution.y));

	vec3 multiplied = blurry.rgb * noise;
	vec3 mixed = mix(noise, multiplied, mix_amount);
  gl_FragColor = vec4(mixed, 1.0);
}