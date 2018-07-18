import bottlebin from './models/bottle.bin';
import bottlegltf from './models/bottle.gltf';
import capBin from './models/cap.bin';
import capGltf from './models/cap.gltf';

import * as THREE from 'three'
import {OrbitControls} from 'three/examples/js/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/js/loaders/GLTFLoader';

const shadowConfig = {
  shadowCameraVisible: false,
  shadowCameraNear: 750,
  shadowCameraFar: 4000,
  shadowCameraFov: 30,
  shadowBias: -0.0002
};
const glContainer = document.getElementById('container');
glContainer.width = window.innerWidth;
glContainer.height = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const light = new THREE.AmbientLight(0x404040);
const gltfLoader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer({
  canvas: glContainer,
  antialias: true
});

var geometry = new THREE.BoxGeometry( 10, 10, 10);
var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
cube.receiveShadow = true;
const sunLight = new THREE.SpotLight( 0xffffff, 0.3, 0, Math.PI/2 );
sunLight.position.set( 100, 200, 1000 );
sunLight.castShadow = true;
sunLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( shadowConfig.shadowCameraFov, 1, shadowConfig.shadowCameraNear, shadowConfig.shadowCameraFar ) );
sunLight.shadow.bias = shadowConfig.shadowBias;
scene.add( sunLight );

const shadowCameraHelper = new THREE.CameraHelper( sunLight.shadow.camera );
shadowCameraHelper.visible = shadowConfig.shadowCameraVisible;
scene.add( shadowCameraHelper );

const controls = new OrbitControls(camera, renderer.domElement);
gltfLoader.load(bottlegltf, function(obj) {
  scene.add(obj.scene);
  obj.scene.children[0].material.color = new THREE.Color('#ff0000');
  obj.scene.children[0].castShadow = true;
  obj.scene.children[0].receiveShadow = true;
});

gltfLoader.load(capGltf, function(obj) {
  scene.add(obj.scene);
  obj.scene.children[0].material.color = new THREE.Color('#ff0000');
  obj.scene.children[0].castShadow = true;
  obj.scene.children[0].receiveShadow = true;
});
scene.add( light);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.gammaInput = true;
renderer.gammaOutput = true

camera.position.z = 20;

function animate() {
  controls.update();
  requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();