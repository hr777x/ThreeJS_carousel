//Importing Three.js library
import * as THREE from 'three';

//Creating a scene
const scene = new THREE.Scene();

//creating a reference for my  canvas
const myCanvas = document.getElementById('carousel');
console.log(myCanvas);

//Creating a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//setting the  camera position
camera.position.z = 5;

//Creating a renderer
const renderer = new THREE.WebGLRenderer({antialias: true, canvas: myCanvas});

//Setting the size of the renderer
renderer.setSize(window.innerWidth, window.innerHeight);

// //Adding the renderer to the canvas
// document.body.appendChild(renderer.domElement);



//Adding the renderer to the canvas
renderer.render(scene, camera);

//Creating a loop to animate the scene(60fps)
renderer.setAnimationLoop(animate);

//creating a cube geometry
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

//creating a material
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});

//creating a cube mesh using its geometry and material
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

//adding a cube to the scene
scene.add(cube);

//any code that is written in the animate function will be called on every frame
function animate(){
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

