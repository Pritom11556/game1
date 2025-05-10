// Manages the Three.js scene, camera, and renderer
import * as THREE from 'three';
import { World } from './world.js';

export class SceneManager {
    constructor(game) {
        this.game = game;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.world = null;
    }

    async init() {
        // Create Three.js scene
        this.scene = new THREE.Scene();
        
        // Setup camera
        this.setupCamera();
        
        // Setup renderer
        this.setupRenderer();
        
        // Initialize world
        this.world = new World(this);
        await this.world.init();
        
        // Add lights
        this.setupLights();
    }

    setupCamera() {
        // Create perspective camera
        const aspect = this.game.config.renderWidth / this.game.config.renderHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        
        // Set initial position
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        
        // Add camera to scene
        this.scene.add(this.camera);
    }

    setupRenderer() {
        // Create WebGL renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });
        
        // Configure renderer
        this.renderer.setSize(this.game.config.renderWidth, this.game.config.renderHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        // Add renderer to DOM
        this.game.config.container.appendChild(this.renderer.domElement);
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 200, 100);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;
        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
        
        // Hemisphere light for more natural outdoor lighting
        const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.3);
        this.scene.add(hemisphereLight);
    }

    update(deltaTime) {
        // Update world
        this.world.update(deltaTime);
    }

    render() {
        // Render scene with camera
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        // Update camera aspect ratio
        this.camera.aspect = this.game.config.renderWidth / this.game.config.renderHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(this.game.config.renderWidth, this.game.config.renderHeight);
    }

    destroy() {
        // Cleanup Three.js objects
        while(this.scene.children.length > 0) { 
            this.scene.remove(this.scene.children[0]); 
        }
        
        // Remove renderer from DOM
        this.game.config.container.removeChild(this.renderer.domElement);
        
        // Dispose of renderer
        this.renderer.dispose();
        
        // Cleanup world
        this.world.destroy();
    }
}