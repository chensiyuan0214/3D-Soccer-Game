console.log("Final!");

  var scene, renderer,clock,soccer,avatar1,avatar2,wall1,wall2,wall3,wall4;
  var startScene, startCamera;
  var blueScene, blueCamera;
  var redScene, redCamera;
  var camera, edgeCam,standCam;
  var goal1, goal2;
  var gameState = {score1:0, score2:0, scene:'startScene', camera: 'none' }
  var controls1 ={fwd:false, bwd:false, left:false, right:false,
				speed:15, fly:false, reset:false,
		    camera:camera}
  var controls2 ={fwd:false, bwd:false, left:false, right:false,
      	speed:15, fly:false, reset:false,
      	camera:camera}



  init();
  initControls();
  animate();

  function init(){
	  initPhysijs();
    createStartScene();
    createblueScene();
    createredScene();
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
      avatar1 = createAvatar();
      avatar1.position.set(20,3,0);
      initMario1();
      scene.add(avatar1);
      avatar2 = createAvatar2();
      avatar2.position.set(-20,3,0);
      initMario2();
      scene.add(avatar2);

      goal1 = createGoalMesh();
      goal1.position.set(-42, 1, 0);
      initGoalModel1();
      scene.add(goal1);
      goal2 = createGoalMesh();
      goal2.position.set(42, 1, 0);
      initGoalModel2();
      scene.add(goal2);

		edgeCam = new THREE.PerspectiveCamera( 120, window.innerWidth / window.innerHeight, 0.1, 1000 );
        edgeCam.position.set(20,20,10);
        edgeCam.position.set(20,20,10);
  standCam = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );
  standCam.position.set(0,30,50);
  gameState.camera=edgeCam;

  //adding wars to the soccer turf
  wall1=createWall('brick-wall.jpg', 105,50,1);
  wall1.position.set(0,20,-34);
  scene.add(wall1);
  wall2=createWall('brick-wall.jpg', 105,50,1);
  wall2.position.set(0,20,34);
  scene.add(wall2);
  wall3 = createWall('brick-wall.jpg', 68,50,1);
  wall3.position.set(52.5,20,0);
  wall3.rotateY(Math.PI/2);
  scene.add(wall3);
  wall4 = createWall('brick-wall.jpg', 68,50,1);
  wall4.position.set(-52.5,20,0);
  wall4.rotateY(Math.PI/2);
  scene.add(wall4);

  }

  function createStartScene(){
			startScene=initScene();
			var floor =createGround('start-screen.jpg');
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

    function createblueScene(){
        blueScene=initScene();
        var floor =createGround('end1.jpg');
        floor.rotateX(Math.PI);
        //floor.rotateY(Math.PI);
        blueScene.add(floor);
        var light1 = createPointLight();
        light1.position.set(0,200,20);
        blueScene.add(light1);
        blueCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
        blueCamera.position.set(0,50,1);
        blueCamera.lookAt(0,0,0);
      }

      function createredScene(){
          redScene=initScene();
          var floor =createGround('end2.jpg');
          floor.rotateX(Math.PI);
          //floor.rotateY(Math.PI);
          redScene.add(floor);
          var light1 = createPointLight();
          light1.position.set(0,200,20);
          redScene.add(light1);
          redCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
          redCamera.position.set(0,50,1);
          redCamera.lookAt(0,0,0);
        }

 function createGoalMesh(color){
    var geometry = new THREE.BoxGeometry(1,3,7.5);
    var material = new THREE.MeshLambertMaterial({color: "white"});
    var pmaterial = new Physijs.createMaterial(material, 0.9, 0.5);
    pmaterial.visible = false;
    var mesh = new Physijs.BoxMesh(geometry, pmaterial, 0);
    mesh.setDamping(0.1,0.1);
    mesh.castShadow = true;
    return mesh;
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
      function(other_object) {
        if(other_object==wall1||other_object==wall2||other_object==wall3||other_object==wall4){
          this.position.set(0,10,0);
          this.__dirtyPosition = true;
        }});
    soccer.addEventListener('collision',
      function(other_object) {
        if(other_object==goal1){
          gameState.score1++;
          if (gameState.score1==1) {
            gameState.scene='blueScene';
          }
          this.position.set(0,10,0);
          this.__dirtyPosition = true;
        }});
    soccer.addEventListener('collision',
      function(other_object) {
        if(other_object==goal2){
          gameState.score2++;
          if (gameState.score2==1) {
            gameState.scene='redScene';
          }
          this.position.set(0,10,0);
          this.__dirtyPosition = true;
        }});
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
    	var geometry = new THREE.BoxGeometry( 3, 3, 3);
    	var material = new THREE.MeshLambertMaterial( { color: "yellow"} );
    	var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
    	pmaterial.visible = false;
    	//var mesh = new THREE.Mesh( geometry, material );
    	var mesh = new Physijs.BoxMesh( geometry, pmaterial );
    	// mesh.setDamping(0.1,0.1);
    	mesh.castShadow = true;
    	return mesh;
	}

  function createAvatar2(){
    	//var geometry = new THREE.SphereGeometry( 4, 20, 20);
    	var geometry = new THREE.BoxGeometry( 3, 3, 3);
    	var material = new THREE.MeshLambertMaterial( { color: "red"} );
    	var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
    	pmaterial.visible = false;
    	//var mesh = new THREE.Mesh( geometry, material );
    	var mesh = new Physijs.BoxMesh( geometry, pmaterial );
    	// mesh.setDamping(0.1,0.1);
    	mesh.castShadow = true;
    	return mesh;
	}

function initGoalModel1() {
    var json_loader = new THREE.JSONLoader();
    json_loader.load("../models/goalFF.json", function (goalF, goalF_materials) {
        var mesh = new THREE.Mesh(
            goalF,
            // new THREE.MeshFaceMaterial( suzanne_materials )
            new THREE.MeshLambertMaterial({color: "white"})
        );
        mesh.castShadow = true;
        goal1.add(mesh);
    });
}

function initGoalModel2() {
    var json_loader = new THREE.JSONLoader();
    json_loader.load("../models/goalFF.json", function (goalF, goalF_materials) {
        var mesh = new THREE.Mesh(
            goalF,
            // new THREE.MeshFaceMaterial( suzanne_materials )
            new THREE.MeshLambertMaterial({color: "white"})
        );
        mesh.castShadow = true;
        goal2.add(mesh);
    });
}

function initMario1(){
    var json_loader = new THREE.JSONLoader();
    json_loader.load( "../models/suzanne.json", function( mario, mario_materials ) {
        var mesh = new THREE.Mesh(
            mario,
            // new THREE.MeshFaceMaterial( suzanne_materials )
            new THREE.MeshLambertMaterial( { color: "red" } )
        );
        mesh.castShadow = true;
        avatar1.add(mesh);
    });
}

function initMario2(){
    var json_loader = new THREE.JSONLoader();
    json_loader.load( "../models/suzanne.json", function( mario, mario_materials ) {
        var mesh = new THREE.Mesh(
            mario,
            // new THREE.MeshFaceMaterial( suzanne_materials )
            new THREE.MeshLambertMaterial( { color: "yellow" } )
        );
        mesh.castShadow = true;
        avatar2.add(mesh);
    });
}

  function updateAvatar1(){
    "change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

    var forward = avatar1.getWorldDirection();

    if (controls1.fwd){
      avatar1.setLinearVelocity(forward.multiplyScalar(controls1.speed));
    } else if (controls1.bwd){
      avatar1.setLinearVelocity(forward.multiplyScalar(-controls1.speed));
    } else {
      var velocity = avatar1.getLinearVelocity();
      velocity.x=velocity.z=0;
      avatar1.setLinearVelocity(velocity); //stop the xz motion
    }

    if (controls1.fly){
      avatar1.setLinearVelocity(new THREE.Vector3(0,controls1.speed,0));
    }

    if (controls1.left){
      avatar1.setAngularVelocity(new THREE.Vector3(0,controls1.speed*0.2,0));
    } else if (controls1.right){
      avatar1.setAngularVelocity(new THREE.Vector3(0,-controls1.speed*0.2,0));
    }

    if (controls1.reset){
      avatar1.__dirtyPosition = true;
      avatar1.position.set(20,3,0);
    }

  }

  function updateAvatar2(){
    "change the avatar's linear or angular velocity based on controls state (set by WSAD key presses)"

    var forward = avatar2.getWorldDirection();

    if (controls2.fwd){
      avatar2.setLinearVelocity(forward.multiplyScalar(controls2.speed));
    } else if (controls2.bwd){
      avatar2.setLinearVelocity(forward.multiplyScalar(-controls2.speed));
    } else {
      var velocity = avatar2.getLinearVelocity();
      velocity.x=velocity.z=0;
      avatar2.setLinearVelocity(velocity); //stop the xz motion
    }

    if (controls2.fly){
      avatar2.setLinearVelocity(new THREE.Vector3(0,controls2.speed,0));
    }

    if (controls2.left){
      avatar2.setAngularVelocity(new THREE.Vector3(0,controls2.speed*0.2,0));
    } else if (controls2.right){
      avatar2.setAngularVelocity(new THREE.Vector3(0,-controls2.speed*0.2,0));
    }

    if (controls2.reset){
      avatar2.__dirtyPosition = true;
      avatar2.position.set(-20,3,0);
    }

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

    if(gameState.scene =='startScene' && event.key == 'p'){
      gameState.scene='main';
      gameState.score1=0;
      gameState.score2=0;
      return;
    }

    if (gameState.scene == 'blueScene' && event.key=='r') {
      gameState.scene = 'main';
      gameState.score1=0;
      gameState.score2=0;
      createMainScene();
      return;
    }

    if (gameState.scene == 'redScene' && event.key=='r') {
      gameState.scene = 'main';
      gameState.score1=0;
      gameState.score2=0;
      createMainScene();
      return;
    }

    if (gameState.scene == 'main' && event.key=='r' ) {
      gameState.scene = 'main';
      gameState.score1=0;
      gameState.score2=0;
      createMainScene();
      return;
    }

    switch (event.key){
  		case "1": gameState.camera = camera; break;
  		case "2": gameState.camera = standCam; break;
  		case "3": gameState.camera = edgeCam; break;
      case "w": controls1.fwd = true;  break;
      case "s": controls1.bwd = true; break;
      case "a": controls1.left = true; break;
      case "d": controls1.right = true; break;
      case "ArrowUp": controls2.fwd = true;  break;
      case "ArrowDown": controls2.bwd = true; break;
      case "ArrowLeft": controls2.left = true; break;
      case "ArrowRight": controls2.right = true; break;

  	}
  }

  function keyup(event){
  	switch (event.key){
      case "w": controls1.fwd   = false;  break;
      case "s": controls1.bwd   = false; break;
      case "a": controls1.left  = false; break;
      case "d": controls1.right = false; break;
      case "ArrowUp": controls2.fwd = false;  break;
      case "ArrowDown": controls2.bwd = false; break;
      case "ArrowLeft": controls2.left = false; break;
      case "ArrowRight": controls2.right = false; break;
  	}
  }

  function animate() {

		requestAnimationFrame( animate );

		switch(gameState.scene) {

			case "startScene":
				renderer.render(startScene,startCamera);
				break;

			case "blueScene":
				//endText.rotateY(0.005);
				renderer.render( blueScene, blueCamera );
				break;

      case "redScene":
  				//endText.rotateY(0.005);
  			renderer.render( redScene, redCamera );
  			break;

			case "main":
      	scene.simulate();
				updateAvatar1();
        updateAvatar2();
				/*updateNPC();
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

   var info = document.getElementById("info");
   info.innerHTML='<div style="font-size:24pt">Score: '
   + " team1="+gameState.score1
   + " team2="+gameState.score2
   +'</div>';



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
