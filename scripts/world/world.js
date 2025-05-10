// Manages the game world including terrain, environment, and weather
import * as THREE from 'three';
import { Terrain } from './terrain.js';
import { Skybox } from './skybox.js';
import { WeatherSystem } from './weather.js';

export class World {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.scene = sceneManager.scene;
        this.terrain = null;
        this.skybox = null;
        this.weather = null;
    }

    async init() {
        // Create terrain
        this.terrain = new Terrain(this);
        await this.terrain.init();
        
        // Create skybox
        this.skybox = new Skybox(this);
        await this.skybox.init();
        
        // Create weather system
        this.weather = new WeatherSystem(this);
        await this.weather.init();
        
        // Add debug helpers if in debug mode
        if (this.sceneManager.game.config.debug) {
            this.addDebugHelpers();
        }
    }

    update(deltaTime) {
        // Update weather system
        this.weather.update(deltaTime);
        
        // Update day/night cycle
        this.skybox.update(deltaTime);
    }

    addDebugHelpers() {
        // Add grid helper
        const gridHelper = new THREE.GridHelper(100, 100);
        this.scene.add(gridHelper);
        
        // Add axes helper
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }

    destroy() {
        // Cleanup terrain
        if (this.terrain) {
            this.terrain.destroy();
        }
        
        // Cleanup skybox
        if (this.skybox) {
            this.skybox.destroy();
        }
        
        // Cleanup weather
        if (this.weather) {
            this.weather.destroy();
        }
    }
}