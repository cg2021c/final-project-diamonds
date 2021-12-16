function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  var clock = new THREE.Clock();

  //Menambahkan Object untuk intersection
  const objects = [];

  //Add raycaster to for interactivity
  //Raycaster untuk object intersection
  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, 0, 0 ), 0, 0 );

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

  const webs = ['https://en.wikipedia.org/wiki/Fox',
                'https://en.wikipedia.org/wiki/Hippopotamus',
                'https://en.wikipedia.org/wiki/Kangaroo',
                'https://en.wikipedia.org/wiki/Moose',
                'https://en.wikipedia.org/wiki/Skunk',
                'https://en.wikipedia.org/wiki/Pig',
                'https://en.wikipedia.org/wiki/Sheep',
                'https://en.wikipedia.org/wiki/Cattle',
                'https://en.wikipedia.org/wiki/Giraffe'];

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

      case 'Digit1':
        window.open(webs[0], '_blank');
        break;

      case 'Digit2':
        window.open(webs[1], '_blank');
        break;

      case 'Digit3':
        window.open(webs[2], '_blank');
        break;

      case 'Digit4':
        window.open(webs[3], '_blank');
        break;

      case 'Digit5':
        window.open(webs[4], '_blank');
        break;

      case 'Digit6':
        window.open(webs[5], '_blank');
        break;

      case 'Digit7':
        window.open(webs[6], '_blank');
        break;

      case 'Digit8':
        window.open(webs[7], '_blank');
        break;

      case 'Digit9':
        window.open(webs[8], '_blank');
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
  document.addEventListener( 'keydown', onKeyDown );
  document.addEventListener( 'keyup', onKeyUp );

  scene.add( fpControls_locked.getObject() );

  const velocity = new THREE.Vector3();
	const direction = new THREE.Vector3();
	const vertex = new THREE.Vector3();
  let prevTime = performance.now();

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

    gltfLoader_1.load('resource/map/AZoo.gltf', (gltf) =>{
      gltf.scene.scale.set(0.09, 1, 0.28);
      var root_1 = gltf.scene;
      root_1.position.set(-17.3,10.5,32.2);
      // root_1.rotation.x += Math.PI/(3);
      root_1.rotation.y += Math.PI/(3);
      root_1.rotation.z += Math.PI/(2);
      scene.add(root_1);
      objects.push(root_1);
    });

    gltfLoader_1.load('resource/map/SignPost.gltf', (gltf) =>{
      gltf.scene.scale.set(0.5, 1, 1);
      var root_1 = gltf.scene;
      root_1.position.set(-9,6,38);
      // root_1.rotation.x += Math.PI/(3);
      root_1.rotation.y += Math.PI/(3);
      root_1.rotation.z += Math.PI/(2);
      scene.add(root_1);
      objects.push(root_1);
    });

    gltfLoader_1.load('resource/map/scene.gltf', (gltf) =>{
      gltf.scene.scale.set(0.1, 0.1, 0.1);
      var root_1 = gltf.scene;
      root_1.rotation.y += Math.PI/(-5.9);
      scene.add(root_1);
      objects.push(root_1);
    });

    gltfLoader_1.load('resource/animals/moose/scene.gltf', (gltf) => {
      gltf.scene.scale.set(1.8, 1.8, 1.8);
      var root_1 = gltf.scene;
      root_1.position.set(23.,3.15,-15.);
      root_1.rotation.y += Math.PI/(-5.9);
      scene.add(root_1);
      objects.push(root_1);
    });

    gltfLoader_1.load('resource/animals/kangaroo/scene.gltf', (gltf) => {
      gltf.scene.scale.set(10.8, 10.8, 10.8);
      var root_1 = gltf.scene;
      root_1.position.set(-10.,1.5,-30.);
      root_1.rotation.y += Math.PI/(2.9);
      scene.add(root_1);
      objects.push(root_1);
    });

    gltfLoader_1.load('resource/animals/hippo/scene.gltf', (gltf) => {
      gltf.scene.scale.set(3.8, 3.8, 3.8);
      var root_1 = gltf.scene;
      root_1.position.set(-30.,2.3,18.);
      root_1.rotation.y += Math.PI/(-2);
      scene.add(root_1);
      objects.push(root_1);
    });

    gltfLoader_1.load('resource/animals/skunk/scene.gltf', (gltf) => {
      gltf.scene.scale.set(0.5, .5, .5);
      var root_1 = gltf.scene;
      root_1.position.set(-10.,0.1,-20.);
      root_1.rotation.y += Math.PI/(2.5);
      scene.add(root_1);
      objects.push(root_1);
    });

    gltfLoader_1.load('resource/animals/fox/scene.gltf', (gltf) => {
      gltf.scene.scale.set(1.3, 1.3, 1.3);
      var root_1 = gltf.scene;
      root_1.position.set(10.,1.4,22.);
      root_1.rotation.y += Math.PI/(-2.5);
      scene.add(root_1);
      objects.push(root_1);
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

      var delta = ( time - prevTime ) / 1000;
      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;

      velocity.y -= 15.8 * 100.0 * delta; // 100.0 = mass

      direction.z = Number( moveForward ) - Number( moveBackward );
      direction.x = Number( moveRight ) - Number( moveLeft );
      direction.normalize(); // this ensures consistent movements in all directions

      if ( moveForward || moveBackward ) {
        velocity.z -= direction.z * 4.0 * delta;
      }
      if ( moveLeft || moveRight ) {
        velocity.x -= direction.x * 4.0 * delta;
      }
      if ( onObject === true ) {
        console.log("Diatas");
        velocity.y = Math.max( 0, velocity.y );
        canJump = true;
      } 

     
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
    fpControls_locked.load;
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }   
}
