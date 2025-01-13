//Importing Three.js library
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; //used to load 3D models in GLTF format
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; //used to control the camera


//Importing the 3D model
const headphonesURL = new URL('/models/headphones.glb', import.meta.url);

//Creating a variable to store the 3D model
let headphonesModel;
//Creating a scene
const scene = new THREE.Scene();

//creating a reference for my  canvas
const myCanvas = document.getElementById('carousel1');

//Creating a light
const dirLight = new THREE.DirectionalLight(0xffffff, 1);

//setting the light position
dirLight.position.set(-30, 20, 10);

scene.add(dirLight);

//Creating a camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

//setting the  camera position
camera.position.z = 5;

//using orbit controls to control the camera
const controls = new OrbitControls(camera, myCanvas);

scene.add(controls);

//creating a GLTF loader
const loader = new GLTFLoader();

//adding an axis helper to the scene
const axesHelper = new THREE.AxesHelper(5);

scene.add(axesHelper);

//loading a 3D model
loader.load(headphonesURL.href, function(gltf){
    headphonesModel = gltf.scene;
    headphonesModel.position.set(5, 0, -30);
    scene.add(headphonesModel);
}, 
undefined, 
function(error){
    console.log(error);
});

//Creating a renderer
const renderer = new THREE.WebGLRenderer({antialias: true, canvas: myCanvas, alpha: true});

//Setting the size of the renderer
renderer.setSize(window.innerWidth, window.innerHeight);

// //Adding the renderer to the canvas
// document.body.appendChild(renderer.domElement);



//Adding the renderer to the canvas
renderer.render(scene, camera);

//Creating a loop to animate the scene(60fps)
renderer.setAnimationLoop(animate);

//any code that is written in the animate function will be called on every frame
function animate(time){
    // headphonesModel.rotation.y = time * 0.001;
    renderer.render(scene, camera);
}

