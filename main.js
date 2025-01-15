import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


let i; // current index of the carousel

let canvas;  // Reference to the current canvas

let renderer;

// Creating a scene array to store scenes for each model
const scenes = [];

// Loading multiple models from URLs
const modelsURLs = [
    new URL('/models/apple.glb', import.meta.url),
    new URL('/models/grapes.glb', import.meta.url),     
    new URL('/models/pizza.glb', import.meta.url),       
    
];

// Creating a loader for GLTF models
const loader = new GLTFLoader();

// getting the canvas to store the reference
canvas = document.querySelector('#canvas');

// Get the carousel container element
const carousel = document.querySelector('.carousel'); 

// Function to dynamically create carousel cards and canvases
function createCarouselCards() {
   
    const maxScenes  = Math.min(modelsURLs.length, 20); // Maximum number of cards to display

    for( i = 0; i < maxScenes; i++) {
        const scene = new THREE.Scene();
        console.log(scene.userData);

        // Create a new element for each model
        const element = document.createElement('div');
        element.className = 'carousel-card';
        
        const sceneElement = document.createElement('div');
        sceneElement.className = 'carousel-canvas';
        sceneElement.id = `canvas${i}`;  // Unique ID for each canvas
        // Append the canvas(placeholder which is a div) to the card
        element.appendChild(sceneElement);

        scene.userData.element = sceneElement;

        // Append the card to the carousel container
        carousel.appendChild(element);
     
        // Append the card to the carousel container
        carousel.appendChild(element);
        
        // Create a camera for each model
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 1.25, 7.5);  // Set camera position
        scene.userData.camera = camera;
        // // Store the canvas reference in the canvases array
        

        // Create a directional light for each model
        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(-25, 20, 10);
        
        scene.add(dirLight);

        loader.load(
            modelsURLs[i % modelsURLs.length].href, // Load models cyclically
            function (gltf) {
                const model = gltf.scene;
                scene.add(model); // Add the model to the scene
                console.log(`Model ${i} loaded successfully`);
            },
            undefined,
            function (error) {
                console.error(`Error loading model ${i}:`, error);
            }
        );

        scenes.push(scene);
    
    }
};


 renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas, alpha: true });
 // Start the animation loop
    renderer.setAnimationLoop(animate);
    renderer.setClearColor( 0xffffff, 1 );
    renderer.setPixelRatio( window.devicePixelRatio );
    
    function updateSize() {

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        if ( canvas.width !== width || canvas.height !== height ) {

            renderer.setSize( width, height, false );

        }

    }

 // Render loop for each canvas
 function animate(time) {
    updateSize();

    renderer.setClearColor( 0xffffff );
	renderer.setScissorTest( false );
	renderer.clear();

	renderer.setClearColor( 0xe0e0e0 );
	renderer.setScissorTest( true );

    // Loop through each scene
    scenes.forEach((scene) => {

        // Rotate all models in the scene
        scene.traverse((child) => {
            if (child.isMesh) {
                child.rotation.y = time / 1000; // Adjust speed as needed
            }
        });
        

        // Get the div associated with this scene
        const element = scene.userData.element;
        const rect = element.getBoundingClientRect();

       // check if it's offscreen. If so skip it
				if ( rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
                        rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {

                       return; // it's off screen
                    }


        // Set the renderer's viewport to match the div's position and size
        const width = rect.right - rect.left;
        const height = rect.bottom - rect.top;
        const left = rect.left;
        const bottom = renderer.domElement.clientHeight - rect.bottom;

        renderer.setViewport(left, bottom, width, height);
        renderer.setScissor(left, bottom, width, height);

        // Update the camera aspect ratio
        const camera = scene.userData.camera;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // Render the scene
        renderer.render(scene, camera);
    });
}


// Function to handle carousel navigation (Prev/Next)
function changeCarousel(direction) {
    const cards = document.querySelectorAll('.carousel-card'); // Get all carousel cards
    const cardWidth = cards[0].offsetWidth; // Width of a single card
    const cardSpacing = parseFloat(window.getComputedStyle(cards[0]).marginRight) || 15; // Margin between cards
    const totalCards = cards.length;

    // Calculate the new index based on the direction
    i = (i + direction + totalCards) % totalCards;

    // Calculate the total carousel width
    const carouselWidth = cardWidth * totalCards + cardSpacing * (totalCards - 1);

    // Calculate the position to center the active card
    const newPosition = -i * (cardWidth + cardSpacing) + (carousel.offsetWidth - cardWidth) / 2;

    // Clamp the new position to avoid over-scrolling
    const maxScrollPosition = 0; // Maximum (leftmost) scroll
    const minScrollPosition = -(carouselWidth - carousel.offsetWidth); // Minimum (rightmost) scroll
    const finalPosition = Math.min(Math.max(newPosition, minScrollPosition), maxScrollPosition);

    // Apply the new transform to center the active card
    carousel.style.transform = `translateX(${finalPosition}px)`;
    carousel.style.transition = 'transform 0.5s ease'; // Smooth scrolling

    console.log(`Active Card Index: ${i}`);
}

// Event listeners for Prev and Next buttons
document.querySelector('.prev').addEventListener('click', () => changeCarousel(-1));
document.querySelector('.next').addEventListener('click', () => changeCarousel(1));

// Initialize the carousel cards and models
createCarouselCards();
