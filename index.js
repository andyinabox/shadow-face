var shell = require('gl-now')();
var createShader = require('gl-shader');
var createTexture = require('gl-texture2d');
var gessoCanvas = require('a-big-triangle');
var mousePosition = require('mouse-position');

var glslify = require('glslify');

var vert = glslify('./shader.vert');
var frag = glslify('./shader.frag');

var img, texture;

var mouse = mousePosition();
var pos = [0, 0];


function translateMouse() {
	return [(pos[0] / shell.width), (pos[1] / shell.height)];
}


shell.on('gl-init', function() {
	var gl = shell.gl;

	img = new Image();
	img.onload = function() {
  	texture = createTexture(gl, img);		
	}
	img.src = 'face.jpg';

	mouse.on('move', function(e) {
		pos = [e.x, e.y];
	})

	shader = createShader(gl, vert, frag);
});


shell.on('gl-render', function(t) {
	var gl = shell.gl;



	// bind shader
	shader.bind();

	shader.uniforms.t += 0.005;
	// console.log(translateMouse());
	shader.uniforms.mouse = translateMouse();
	shader.uniforms.resolution = [shell.width, shell.height];

	if(texture) {
		shader.uniforms.tex = texture.bind()
	}

	// draw big triangle
	gessoCanvas(gl);
});

shell.on("gl-error", function(e) {
  throw new Error("WebGL not supported :(")
});