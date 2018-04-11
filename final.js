console.log("Final!");

  var scene, renderer,clock,soccer,avatar;
  var camera, edgeCam,standCam;
  var gameState = {score1:0, score2:0, scene:'main', camera: 'none' }


  init();
  initControls();
  animate();

  function init(){
	  initPhysijs();
    // createStartScene();
    // createEndScene();
	  createMainScene();
  	  initRenderer();
  	  }

  function createMainScene(){
  		scene=initScene();
  		var ground = createGround('Soccer-Field.jpg');
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
    	avatar = createAvatar();
    	avatar.translateX(20);
		avatar.translateY(3);
		avatar.translateZ(0);
		scene.add(avatar);
		edgeCam = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 );
    edgeCam.position.set(20,20,10);
    standCam = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );
    standCam.position.set(0,30,50);
    gameState.camera=edgeCam;
    var wall1=createWall('brick-wall.jpg', 105,50,1);
    wall1.position.set(0,20,-34);
    scene.add(wall1);
    var wall2=createWall('brick-wall.jpg', 105,50,1);
    wall2.position.set(0,20,34);
    scene.add(wall2);
    var wall3 = createWall('brick-wall.jpg', 68,50,1);
    wall3.position.set(52.5,20,0);
    wall3.rotateY(Math.PI/2);
    scene.add(wall3);
    var wall4 = createWall('brick-wall.jpg', 68,50,1);
    wall4.position.set(-52.5,20,0);
    wall4.rotateY(Math.PI/2);
    scene.add(wall4);
  }

  function createStartScene(){
			startScene=initScene();
			var floor =createGround('startscreen.jpg',1);
			floor.rotateX(Math.PI);
			//floor.rotateY(Math.PI);
			startScene.add(floor);
			var light1 = createPointLight();
			light1.position.set(0,200,20);
			startScene.add(light1);
			startCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
			startCamera.position.set(0,50,1);
			startCamera.lookAt(0,0,0);
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
	function createGround(image){
		// creating a textured plane which receives shadows
		var geometry = new THREE.PlaneGeometry( 105, 68, 1 );
		var texture = new THREE.TextureLoader().load( '../images/'+image );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
		var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
		//var mesh = new THREE.Mesh( geometry, material );
		var mesh = new Physijs.BoxMesh( geometry, pmaterial,0);
		mesh.receiveShadow = true;
		mesh.rotateX(Math.PI/2);
		return mesh
		// we need to rotate the mesh 90 degrees to make it horizontal not vertical
	}

  function createWall(image,w,h,d){
    // creating a textured plane which receives shadows
    var geometry = new THREE.PlaneGeometry( w,h, d );
    var texture = new THREE.TextureLoader().load( '../images/'+image );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
    var pmaterial = new Physijs.createMaterial(material,0.9,0.05);
    //var mesh = new THREE.Mesh( geometry, material );
    var mesh = new Physijs.BoxMesh( geometry, pmaterial, 0 );
    mesh.receiveShadow = true;
    return mesh
    // we need to rotate the mesh 90 degrees to make it horizontal not vertical
  }


  function addBalls(){
  	soccer = createBall();
  	soccer.position.set(0,10,0);
    soccer.addEventListener( 'collision',
      function( other_object, relative_velocity, relative_rotation, contact_normal ) {

          // this.position.y = this.position.y - 100;
          this.__dirtyPosition = true;
      }
    )
  	scene.add(soccer);
  }


  function createBall(){
	  var geometry = new THREE.SphereGeometry( 2, 16, 16);
	  var material = new THREE.MeshLambertMaterial( { color: "white"} );
	  var pmaterial = new Physijs.createMaterial(material,0.9,0.95);
    var mesh = new Physijs.BoxMesh( geometry, pmaterial);
	  mesh.setDamping(0.1,0.1);
	  mesh.castShadow = true;
	  return mesh;
  }

	function createBoxMesh(color){
    	var geometry = new THREE.BoxGeometry( 1, 1, 1);
    	var material = new THREE.MeshLambertMaterial( { color: color} );
    	var mesh = new Physijs.BoxMesh( geometry, material );
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
    	// mesh.setDamping(0.1,0.1);
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
    console.dir(event);
  	console.log("Keydown: '"+event.key+"'");

    if(gameState.scene =='start' && event.key == 'p'){
      gameState.scene='main';
      gameState.score=0;
      addBalls();
      return;
    }

    if (gameState.scene == 'end' && event.key=='r') {
      gameState.scene = 'main';
      gameState.score = 0;
      addBalls();
      return;
    }
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

			case "end":
				//endText.rotateY(0.005);
				renderer.render( endScene, endCamera );
				break;


			case "main":
      	scene.simulate();
				/*updateAvatar();
				updateNPC();


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

	}
