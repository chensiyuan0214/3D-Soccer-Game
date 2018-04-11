console.log("Final!");

  var scene, renderer,clock,soccer;
  var camera, edgeCam,standCam;
  var gameState = {score1:0, score2:0, scene:'main', camera: 'none' }

  init();
  initControls();
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
		addBalls();
		edgeCam = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 );
        edgeCam.position.set(20,20,10);
        standCam = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 );
        standCam.position.set(0,30,100);
        gameState.camera=edgeCam;
        var wall1=createGround('brick-wall.jpg', 1);
        wall1.rotateX(Math.PI/2);
        wall1.position.set(0,0,-100);
        scene.add(wall1);
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

  function addBalls(){
  	soccer = createBall();
  	soccer.position.set(0,10,0);
  	soccer.__dirtyPosition=true;
  	scene.add(soccer);

  }

  function createBall(){
	var geometry = new THREE.SphereGeometry( 2, 16, 16);
	var material = new THREE.MeshLambertMaterial( { color: "white"} );
	var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial );
	mesh.setDamping(0.1,0.1);
	mesh.castShadow = true;
	return mesh;
  }

  function initControls(){
		clock = new THREE.Clock();
		clock.start();
		window.addEventListener( 'keydown', keydown);
		window.addEventListener( 'keyup',   keyup );
  }

  function keydown(event){
  	console.log("Keydown: '"+event.key+"'");
  	switch (event.key){
  		case "1": gameState.camera = camera; break;
  		case "2": gameState.camera = standCam; break;
  		case "3": gameState.camera = edgeCam; break;
  	}
  }

  function keyup(event){
  	switch (event.key){
  	}
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

	    		scene.simulate();
				if (gameState.camera!= 'none'){
					renderer.render( scene, gameState.camera );
				}
				*/
				edgeCam.lookAt(soccer.position);
				renderer.render( scene, gameState.camera);
				break;


			//default:
			  //console.log("don't know the scene "+gameState.scene);

		}

    function createBoxMesh(color){
		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: color} );
		mesh = new Physijs.BoxMesh( geometry, material );
    //mesh = new Physijs.BoxMesh( geometry, material,0 );
		mesh.castShadow = true;
		return mesh;
	}

  function createAvatar(){
		//var geometry = new THREE.SphereGeometry( 4, 20, 20);

		var geometry = new THREE.BoxGeometry( 1, 1, 1);
		var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
		// pmaterial.visible = false;
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial );
		mesh.setDamping(0.1,0.1);
		mesh.castShadow = true;
		avatarCam.position.set(0,4,0);
		avatarCam.lookAt(0,4,10);
		mesh.add(avatarCam);
		return mesh;
	}

	}
