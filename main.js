import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Arrays to store the 3D models and corresponding canvases
const models = [];
const canvases = [];
let currentIndex = 0; // current index of the carousel

// Loading multiple models from URLs
const modelsURLs = [
    new URL('/models/apple.glb', import.meta.url),
    new URL('/models/grapes.glb', import.meta.url),     
    new URL('/models/pizza.glb', import.meta.url),       
    
];

// Get the carousel container element
const carousel = document.querySelector('.carousel');

// Creating a loader for GLTF models
const loader = new GLTFLoader();

// Creating a scene array to store scenes for each model
const scenes = [];

// Function to dynamically create carousel cards and canvases
function createCarouselCards() {
    modelsURLs.forEach((url, index) => {
        // Create a card div
        const card = document.createElement('div');
        card.classList.add('carousel-card');
        
        // Create a canvas element for each model
        const canvas = document.createElement('canvas');
        canvas.classList.add('carousel-canvas');
        canvas.id = `canvas-${index}`;  // Unique ID for each canvas

        // Append the canvas to the card
        card.appendChild(canvas);

        // Append the card to the carousel container
        carousel.appendChild(card);
        
        // Store the canvas reference in the canvases array
        canvases.push(canvas);
    });
}

// Function to load models into their respective scenes and render on canvases
function loadModels() {
    modelsURLs.forEach((url, index) => {
        const canvas = canvases[index];  // Get the corresponding canvas
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas, alpha: true });
        renderer.setSize(250, 250);  // Set the size of the canvas

        // Create a new scene for each model
        const scene = new THREE.Scene();
        scenes.push(scene);

        // Create a camera for each model
        const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
        camera.position.set(0, 1.25, 7.5);  // Set camera position

        // Create a directional light for each model
        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(-25, 20, 10);
        
        scene.add(dirLight);

        // Load the model into the scene
        loader.load(url.href, function(gltf) {
            const model = gltf.scene;
            scene.add(model);  // Add the model to the scene
            models.push(model); // Store model references

            // Render loop for each canvas
            function animate(time) {
                model.rotation.y = time / 1000;  // Rotate model continuously
                renderer.render(scene, camera);
            }

            // Set animation loop for each canvas
            renderer.setAnimationLoop(animate);

        }, undefined, function(error) {
            console.error(error);
        });
    });
}

// Function to handle carousel navigation (Prev/Next)
function changeCarousel(direction) {
    const cardWidth = document.querySelector('.carousel-card').offsetWidth;  // Get card width
    const carouselWidth = carousel.offsetWidth;  // Get carousel width
    const cardSpacing = 15;  // The gap between cards, you may adjust this value as needed

    // Calculate the new index based on direction
    const newIndex = (currentIndex + direction + models.length) % models.length;
    
    // Calculate the center offset (move carousel so the new card is centered)
    const newPosition = -newIndex * (cardWidth + cardSpacing) + (carouselWidth - cardWidth) / 2;

    // Move the carousel to the new position
    carousel.style.transform = `translateX(${newPosition}px)`;  

    // Update the current index
    currentIndex = newIndex;  
}

// Event listeners for Prev and Next buttons
document.querySelector('.prev').addEventListener('click', () => changeCarousel(-1));
document.querySelector('.next').addEventListener('click', () => changeCarousel(1));

// Initialize the carousel cards and models
createCarouselCards();
loadModels();
