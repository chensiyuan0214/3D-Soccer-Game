console.log("Final!");

  var scene, renderer;  
  var camera;
  var gameState = {score1:0, score2:0, scene:'main', camera:'none' }
  
  init();
  animate();
  
  function init(){
	  initPhysijs();
	  createMainScene();
  	  initRenderer();
	}

  function createMainScene(){
  		scene=initScene();
  		var ground = createGround('Soccer-Field.jpg', 1);
		scene.add(ground);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		scene.add(light1);
		var light0 = new THREE.AmbientLight( 0xffffff,0.25);
		scene.add(light0);
		camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.set(0,50,0);
		camera.lookAt(0,0,0);	
  }

  function initScene(){
  		var scene = new Physijs.Scene();
    	return scene;
  }

  function initPhysijs(){
    Physijs.scripts.worker = '/js/physijs_worker.js';
    Physijs.scripts.ammo = '/js/ammo.js';
  }

	function initRenderer(){
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight-50 );
		document.body.appendChild( renderer.domElement );
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	} 

  function createPointLight(){
    var light;
    light = new THREE.PointLight( 0xffffff);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;  // default
    light.shadow.mapSize.height = 2048; // default
    light.shadow.camera.near = 0.5;       // default
    light.shadow.camera.far = 500      // default
    return light;
  }

  // need to change image, size, color 
	function createGround(image,k){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 180, 180, 128 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( k, k );
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );

		mesh.receiveShadow = true;

		mesh.rotateX(Math.PI/2);
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}


  function createBall(){
		var geometry = new THREE.SphereGeometry( 1, 4, 4);
		var material = new THREE.MeshLambertMaterial( { color: "white"} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    	var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		return mesh;
  }
  
  function animate() {

		requestAnimationFrame( animate );

		switch(gameState.scene) {

			case "start":
				renderer.render(startScene,startCamera);
				break;

			case "youwon":
				//endText.rotateY(0.005);
				renderer.render( endScene, endCamera );
				break;

			case "main":
				/*updateAvatar();
				updateNPC();
       			edgeCam.lookAt(avatar.position);
	    		scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
				}
				*/
				renderer.render( scene, camera);
				break;
				

			default:
			  console.log("don't know the scene "+gameState.scene);

		}
	}
