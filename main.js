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

// Hardcoded product details
const productDetails = [
    {title: "Apple", description: "Fresh and juicy apples." },
    {title: "Grapes", description: "Sweet and seedless grapes." },
    {title: "Pizza", description: "Delicious cheese pizza." }
  ];

// Creating a loader for GLTF models
const loader = new GLTFLoader();

// getting the canvas to store the reference
canvas = document.querySelector('#canvas');

// Get the carousel container element
const carousel = document.querySelector('.carousel'); 

// Function to dynamically create carousel cards and scenes
function createCarouselCards() {
   
    const maxScenes  = Math.min(modelsURLs.length, 20); // display all the models referenced in the modelsURLs array or 20 models, whichever is less

    for( i = 0; i < maxScenes; i++) {
        const scene = new THREE.Scene();

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

        // Get the size of the element and its position relative to the viewport
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
    const cardWidth = document.querySelector('.carousel-card').offsetWidth;  // Get card width
    const carouselWidth = carousel.offsetWidth;  // Get carousel width
    const totalCards = carousel.querySelectorAll('.carousel-card').length;  // Total cards in carousel
    const cardSpacing = 15;  // The gap between cards (adjust if needed)

    // Calculate the new index
    const newIndex = (i + direction + totalCards) % totalCards;

    // Calculate the new position for centering the current card
    const newPosition = -newIndex * (cardWidth + cardSpacing) + (carouselWidth - cardWidth) / 2;

    // Apply the transform with smooth transition
    carousel.style.transition = 'transform 0.5s ease';  // Smooth transition
    carousel.style.transform = `translateX(${newPosition}px)`;  

    // Update the current index
    i = newIndex;  
}


// Event listeners for Prev and Next buttons
document.querySelector('.prev').addEventListener('click', () => changeCarousel(-1));
document.querySelector('.next').addEventListener('click', () => changeCarousel(1));

// Initialize the carousel cards and models
createCarouselCards();

// Get pop-up elements
const canvasdiv = document.querySelectorAll('.carousel-card');
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupDescription = document.getElementById("popup-description");
const closePopup = document.getElementById("close-popup");

// Function to show the pop-up
function showPopup(product) {
    popupTitle.textContent = product.title;
    popupDescription.textContent = product.description;
    popup.classList.remove("hidden");
  }

  // Function to close the pop-up
function hidePopup() {
    popup.classList.add("hidden");
  }
//onclick event listener for the close button
closePopup.addEventListener("click", hidePopup);

//onclick event listener for all the carousel cards
canvasdiv.forEach((card, index) => {
    card.addEventListener('click',() => {
        //show the index of the div clicked
        console.log('clicked')
        if(index === 0){
            showPopup(productDetails[index]);
            popupTitle.innerHTML = productDetails[index].title;
            popupDescription.innerHTML = productDetails[0].description;
        }   
        else if(index === 1){
            showPopup(productDetails[index]);
            popupTitle.innerHTML = productDetails[index].title;
            popupDescription.innerHTML = productDetails[1].description;
        }
        else if(index === 2){
            showPopup(productDetails[index]);
            popupTitle.innerHTML = productDetails[index].title;
            popupDescription.innerHTML = productDetails[2].description;
        }

    });
});