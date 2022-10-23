import { GLTFLoader } from "../../lib/GLFTLoader.js";

// Resource-paths
const CAR_PATH = "../../rsc/carmodel/scene.gltf";
const FLOOR_PATH = "../../rsc/Floor.png";

// Model and texture-loader
const ModelLoader = new GLTFLoader();
const TextureLoader = new THREE.TextureLoader();

// Will be the first thing to set (Can be assumed to be set)
// Contains the dom-bind html element
var domBinding;

// Will be set after the first init has run
var camera,scene,renderer, carModel, controls;

// Current camera-moving-timeout
var moveTimeout = undefined;


// Update-function for continues frame-updates
function onAnimationUpdate(){
    controls.update();
    renderer.render(scene,camera);
    requestAnimationFrame(onAnimationUpdate);
}

// Returns the current ratio of the scene-parent object
function getRatio(){
    return domBinding.clientWidth/domBinding.clientHeight;
}

// Updates the renderer size
function updateRendererSize(){
    renderer.setSize(domBinding.clientWidth, domBinding.clientHeight);
}


// Exported function
// Resizes the car-scene according to it's html-parent
function resizeScene(){
    var ratio = getRatio();

    updateRendererSize();
    camera.aspect = ratio;
    camera.updateProjectionMatrix();
}

// Creates the lights and adds them to the scene
function createLights(){
    scene.add(new THREE.HemisphereLight(0xe4e4e4, 0x080820, 4));
    scene.add(new THREE.AmbientLight(0xe4e4e4, 1));
}

// Creates the scene
function createScene(){
    // Creates the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
}

// Creates the camera
function createCamera(){
    // Creates the camera
    camera = camera = new THREE.PerspectiveCamera(
        45,
        getRatio(),
        1,
        1000
    );  
}

// Creates the renderer
function createRenderer(){
    // Creates the renderer
    renderer = new THREE.WebGLRenderer();
    updateRendererSize(renderer);
    renderer.shadowMap.enabled = true;

    // Binds the rendering to the html-dom
    domBinding.appendChild(renderer.domElement);
}

// Creates the orbital-controls for the user
function createControls(){
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.maxDistance = 40;
    controls.minDistance = 10;
}

// Creates the floor below the car
function createFloor(){
    // Creates the mesh
    var material = new THREE.MeshBasicMaterial({
        map: TextureLoader.load(FLOOR_PATH),
        transparent: true
    });

    // Creates the upper floor
    var floorUp = new THREE.CircleGeometry(8, 8);
    var meshUp = new THREE.Mesh(floorUp, material);
    meshUp.rotation.x = -Math.PI/2;
    scene.add(meshUp);

    // Creates the lower floor
    var floorDown = new THREE.CircleGeometry(8, 8);
    var meshDown = new THREE.Mesh(floorDown, material);
    meshDown.rotation.x = Math.PI/2;
    scene.add(meshDown);
}

// Imports the car-object and adds it to the scene
async function importCarObj(){

    var onSuccess, onFailure;

    var prom = new Promise((res, rej)=>{
        onSuccess = res;
        onFailure = rej;
    });


    ModelLoader.load(CAR_PATH, (gltf)=>{
        carModel = gltf.scene;
        
        // Enables shadows for the model
        carModel.traverse(n => { if ( n.isMesh ) {
            n.castShadow = true;
            n.receiveShadow = true;
            if(n.material.map) n.material.map.anisotropy = 16;
        }});

        // Scales the model up and slightely updates the position
        carModel.scale.set(2,2,2);
        carModel.position.y+=.02;

        // Adds the to the scene
        scene.add(carModel);

        onSuccess();
    }, undefined, onFailure);
    return prom;
}

// Function to move the camera slowly in msTime millis to the given position
function moveTo(x,y,z, msTime = 500){
    // Stops any previous movements
    cancleMovement();

    // Gets the current position
    var {x: cx,y: cy,z: cz} = camera.position;

    // Amount of steps to take
    const steps = 100;

    // Calculates the next position based on a from, to and percentage between them value
    const calcNextposition = (from, to, perc) => from < to ? (from+(to-from)*perc) : (from-(from-to)*perc);

    // Performs the actual movement and queues the next move
    function move(step){
        if(step > steps)
            return;

        // Calculates the percentage
        var perc = step/steps;

        // Calculates the next position to move the camera to
        camera.position.set(
            calcNextposition(cx,x, perc),
            calcNextposition(cy,y, perc),
            calcNextposition(cz,z, perc)
        );
        // Readjustes the camera
        camera.lookAt(new THREE.Vector3(0,0,0));

        // Queues the next move
        moveTimeout = setTimeout(()=>move(step+1), msTime/steps);
    }

    // Starts the first move
    move(1);
}

function cancleMovement(){
    // Checks if there are any movements
    if(moveTimeout === undefined)
        return;

    clearTimeout(moveTimeout);
    moveTimeout = undefined;
}

// Call this at the beginning to load the cyber-car
async function initCarRender(){
    
    // Gets the dom-binding
    domBinding = document.querySelector("#leftView");

    createScene();

    createCamera();

    createRenderer();

    createControls();
    
    createLights();

    createFloor();

    // Fires the first update event and starts the render-loop
    onAnimationUpdate();

    // Imports the car-object
    await importCarObj();



    // Gives the camera an inital position
    camera.position.x = camera.position.y = camera.position.z = getRatio()*15;

    // Lets the camera look at the car
    camera.lookAt(new THREE.Vector3(0,0,0));
}

export const CarObject = {
    initCarRender,
    resizeScene,
    moveTo,
    cancleMovement
}