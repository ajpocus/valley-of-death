$(function () {
  // set the scene size
  var WIDTH = 1024,
    HEIGHT = 768;

  // set some camera attributes
  var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

  // get the DOM element to attach to
  // - assume we've got jQuery to hand
  var $container = $('#container');

  // create a WebGL renderer, camera
  // and a scene
  var renderer = new THREE.WebGLRenderer();
  var camera =
    new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);

  var scene = new THREE.Scene();
  scene.add(camera);
  camera.position.y = 50;
  camera.position.z = 300;
  renderer.setSize(WIDTH, HEIGHT);
  $container.append(renderer.domElement);

  // create an ambient light
  var ambientLight = new THREE.AmbientLight(0x404040);

  // set its position
  ambientLight.position.x = 0;
  ambientLight.position.y = 500;
  ambientLight.position.z = 130;

  // add to the scene
  scene.add(ambientLight);
  
  // create a plane
  var width = 500,
    height = 500,
    widthSegments = width - 1,
    heightSegments = height - 1;
  
  var planeGeometry = new THREE.PlaneGeometry(7500, 7500, widthSegments,
    heightSegments);
  var planeMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color:0x00CC00 });
  
  
  console.log(plane);
  
  var depth = height;
  var data = generateHeight( width, depth);
  
  camera.position.y = data[ (width/2) + (depth/2) * width ] + 500;
	planeGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	for ( var i = 0, l = planeGeometry.vertices.length; i < l; i ++ ) {
		planeGeometry.vertices[ i ].y = data[ i ] * 10;
	}

  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  console.log(plane);
  scene.add(plane);
  
  // draw!
  renderer.render(scene, camera);
  
  (function animate() {
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
  })();
  
  function generateHeight( width, height ) {
		var size = width * height, data = new Float32Array( size ),
		perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;

		for ( var i = 0; i < size; i ++ ) {

			data[ i ] = 0

		}

		for ( var j = 0; j < 4; j ++ ) {

			for ( var i = 0; i < size; i ++ ) {

				var x = i % width, y = ~~ ( i / width );
				data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );


			}

			quality *= 5;

		}

		return data;
	}

  function ImprovedNoise() {
  	var p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
  		 23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
  		 174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
  		 133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
  		 89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
  		 202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
  		 248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
  		 178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
  		 14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
  		 93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  
  	for (var i=0; i < 256 ; i++) {
  
  		p[256+i] = p[i];
  
  	}
  
  	function fade(t) {
  
  		return t * t * t * (t * (t * 6 - 15) + 10);
  
  	}
  
  	function lerp(t, a, b) {
  
  		return a + t * (b - a);
  
  	}
  
  	function grad(hash, x, y, z) {
  
  		var h = hash & 15;
  		var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
  		return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
  
  	}
  
  	return {
  
  		noise: function (x, y, z) {
  
  			var floorX = ~~x, floorY = ~~y, floorZ = ~~z;
  
  			var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;
  
  			x -= floorX;
  			y -= floorY;
  			z -= floorZ;
  
  			var xMinus1 = x -1, yMinus1 = y - 1, zMinus1 = z - 1;
  
  			var u = fade(x), v = fade(y), w = fade(z);
  
  			var A = p[X]+Y, AA = p[A]+Z, AB = p[A+1]+Z, B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;
  
  			return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), 
  							grad(p[BA], xMinus1, y, z)),
  						lerp(u, grad(p[AB], x, yMinus1, z),
  							grad(p[BB], xMinus1, yMinus1, z))),
  					lerp(v, lerp(u, grad(p[AA+1], x, y, zMinus1),
  							grad(p[BA+1], xMinus1, y, z-1)),
  						lerp(u, grad(p[AB+1], x, yMinus1, zMinus1),
  							grad(p[BB+1], xMinus1, yMinus1, zMinus1))));
  
  		}
  	}
  }

});
