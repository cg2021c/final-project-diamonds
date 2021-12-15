
  //import { PointerLockControls } from './lib/PointerLockControls';
function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  var clock = new THREE.Clock();


  //Menambahkan Object untuk intersection
  const objects = [];

  // initDefaultLighting(scene);

  scene.background = new THREE.Color('lightblue');

  {
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0x000000;  // black
    const intensity = 0.8;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
  }

  {
    const color = 0xFFFFFF;
    const intensity = 5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(5, 10, 20);
    scene.add(light);
    scene.add(light.target);
  }

  var fpControls = new THREE.FirstPersonControls(camera, renderer.domElement);
  fpControls.lookSpeed = 0.4;
  fpControls.movementSpeed = 20;
  fpControls.lookVertical = true;
  fpControls.constrainVertical = true;
  fpControls.verticalMin = 1.0;
  fpControls.verticalMax = 2.0;
  fpControls.lon = -150;
  fpControls.lat = 120;

  //First Person Locked, a better camera than just first person Controls
  let moveForward = false;
			let moveBackward = false;
			let moveLeft = false;
			let moveRight = false;
			let canJump = false;
  var fpControls_locked = new THREE.PointerLockControls(camera, renderer.domElement);
  const instructions = document.getElementById( 'webgl-output' );



  instructions.addEventListener( 'click', function () {

    fpControls_locked.lock();

  } );

  fpControls_locked.addEventListener( 'lock', function () {


  } );

  fpControls_locked.addEventListener( 'unlock', function () {


  } );

  

  const onKeyDown = function ( event ) {

    switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
        moveForward = true;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = true;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = true;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = true;
        break;

      case 'Space':
        if ( canJump === true ) velocity.y += 350;
        canJump = false;
        break;

    }

  };

  const onKeyUp = function ( event ) {

    switch ( event.code ) {

      case 'ArrowUp':
      case 'KeyW':
        moveForward = false;
        break;

      case 'ArrowLeft':
      case 'KeyA':
        moveLeft = false;
        break;

      case 'ArrowDown':
      case 'KeyS':
        moveBackward = false;
        break;

      case 'ArrowRight':
      case 'KeyD':
        moveRight = false;
        break;

    }

  };
 
  instructions.addEventListener('keydown', onKeyDown);
  instructions.addEventListener('keyup', onKeyUp);
  /*document.addEventListener( 'keydown', onKeyDown );
  document.addEventListener( 'keyup', onKeyUp );*/

  scene.add( fpControls_locked.getObject() );

  const velocity = new THREE.Vector3();
	const direction = new THREE.Vector3();
	const vertex = new THREE.Vector3();
  let prevTime = performance.now();

  //Raycaster untuk object intersection
  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 0, 0 ), 0, 0 );
  /* raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 ); */

  var fpControls_gamepad = new THREE.GamepadControls(camera);
  fpControls_gamepad.lookSpeed = 1.0;
  
  //Load Maps & Models
  //Remember to add Maps and models to objects so we can have collision
  //example :
  // objects.push(something_that_you_added_to_scene);
  const gltfLoader_1 = new THREE.GLTFLoader();
  gltfLoader_1.load('resource/map/budapest.gltf', (gltf) => {
    
    gltf.scene.scale.set(10, 10, 10); 
    const root = gltf.scene;
    root.position.set(-60, -9, 130);
    scene.add(root);
    objects.push(root);
    gltfLoader_1.load('resource/map/scene.gltf', (gltf) =>{
      gltf.scene.scale.set(0.1, 0.1, 0.1);
      //gltf.scene.applyAxisAngle(new THREE.Vector3(0,0,0), Math.PI /2);
      var root_1 = gltf.scene;
      root_1.rotation.y += Math.PI/(-5.9);
      //root_1 = rotateAboutPoint(root_1, new THREE.Vector3(0,0,0), 1, Math.PI /2);
      scene.add(root_1);
      if(objects.push(root_1)){
        console.log("berhasil menambah objek");
      }
    });

    
  });


  

  render();
  function render() {
  
    //requestAnimationFrame(render);
    //Render parameters for first person locked
    const time = performance.now();
    if ( fpControls_locked.isLocked === true ) {

      //prevTime = performance.now();
      raycaster.ray.origin.copy( fpControls_locked.getObject().position );
      raycaster.ray.origin.y -= 10;

      const intersections = raycaster.intersectObjects( objects , false );

      const onObject = intersections.length > 0;

      //console.log("Sini");

      var delta = ( time - prevTime ) / 1000;
      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;

      velocity.y -= 15.8 * 100.0 * delta; // 100.0 = mass

      direction.z = Number( moveForward ) - Number( moveBackward );
      direction.x = Number( moveRight ) - Number( moveLeft );
      direction.normalize(); // this ensures consistent movements in all directions

      if ( moveForward || moveBackward ) {
        velocity.z -= direction.z * 4.0 * delta;
        console.log("MAJU/MUNDUR");
        console.log(velocity.z);
      }
      if ( moveLeft || moveRight ) {
        velocity.x -= direction.x * 4.0 * delta;
        console.log("KIRI/KANAN");
        console.log(velocity.x);
      }

       if ( onObject === true ) {
        console.log("Diatas");
        velocity.y = Math.max( 0, velocity.y );
        canJump = true;

      } 

     
      /*  fpControls_locked.moveRight( 1  );
      fpControls_locked.moveForward( 1 );  */
      fpControls_locked.moveRight( - velocity.x * delta * 100 );
      fpControls_locked.moveForward( - velocity.z * delta  * 100);  

      fpControls_locked.getObject().position.y += ( velocity.y * delta * 1/2 ); // new behavior

      if ( fpControls_locked.getObject().position.y < 5 ) {

        velocity.y = 0;
        fpControls_locked.getObject().position.y = 5;

        canJump = true;

      }

    }








    prevTime = time;
    stats.update();
    //fpControls.update(clock.getDelta());
    //fpControls_gamepad.update(clock.getDelta());
    fpControls_locked.load;
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }   
}
