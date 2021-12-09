function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  var clock = new THREE.Clock();

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
    const intensity = 1;
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

  // var loader = new THREE.OBJLoader();
  // loader.load("resource/map/city.obj", function (object) {

  //   var scale = chroma.scale(['red', 'green', 'blue']);
  //   setRandomColors(object, scale);
  //   mesh = object ;
  //   scene.add(mesh);
  // });

  const gltfLoader = new THREE.GLTFLoader();
  gltfLoader.load('resource/map/zoo_land.glb', (gltf) => {
    const root = gltf.scene;
    scene.add(root);

    //compute the box that contains all the stuff
    //from root and below
    // const box = new THREE.Box3().setFromObject(root);

    // const boxSize = box.getSize(new THREE.Vector3()).length();
    // const boxCenter = box.getCenter(new THREE.Vector3());

    //set the camera to frame the box
    // frameArea(boxSize * 0.5, boxSize, boxCenter, camera);

    //update the Trackball controls to handle the new size
    // fpControls.maxDistance = boxSize * 10;
    // fpControls.target.copy(boxCenter);
    // fpControls.update();
  });

  render();
  function render() {
    stats.update();
    fpControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }   
}
