// Core Game class that manages all game systems
import { SceneManager } from './world/sceneManager.js';
import { Player } from './player/player.js';
import { UIManager } from './ui/uiManager.js';
import { AssetManager } from './assets/assetManager.js';
import { InputManager } from './input/inputManager.js';

export class Game {
    constructor(options) {
        // Game configuration
        this.config = {
            container: options.container,
            uiContainer: options.uiContainer,
            debug: options.debug || false,
            fpsLimit: 60,
            renderWidth: window.innerWidth,
            renderHeight: window.innerHeight
        };

        // Game systems
        this.sceneManager = null;
        this.player = null;
        this.uiManager = null;
        this.assetManager = null;
        this.inputManager = null;

        // Game state
        this.state = {
            isRunning: false,
            lastTime: 0,
            deltaTime: 0,
            fps: 0
        };

        // Initialize resize handler
        window.addEventListener('resize', () => this.handleResize());
    }

    async init() {
        try {
            // Initialize core systems
            this.sceneManager = new SceneManager(this);
            this.uiManager = new UIManager(this);
            this.assetManager = new AssetManager(this);
            this.inputManager = new InputManager(this);

            // Initialize player after scene is ready
            await this.sceneManager.init();
            this.player = new Player(this);

            // Initialize UI
            await this.uiManager.init();

            // Initialize input
            await this.inputManager.init();

            return this;
        } catch (error) {
            console.error('Game initialization failed:', error);
            throw error;
        }
    }

    start() {
        if (this.state.isRunning) return;
        
        this.state.isRunning = true;
        this.state.lastTime = performance.now();
        
        // Start game loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    stop() {
        this.state.isRunning = false;
    }

    gameLoop(currentTime) {
        // Calculate delta time
        this.state.deltaTime = (currentTime - this.state.lastTime) / 1000;
        this.state.lastTime = currentTime;
        
        // Calculate FPS
        this.state.fps = 1 / this.state.deltaTime;

        // Update game systems
        this.update(this.state.deltaTime);
        
        // Render frame
        this.render();

        // Continue loop if game is running
        if (this.state.isRunning) {
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }

    update(deltaTime) {
        // Update game systems
        this.sceneManager.update(deltaTime);
        this.player.update(deltaTime);
        this.uiManager.update(deltaTime);
        this.inputManager.update(deltaTime);

        // Debug info
        if (this.config.debug) {
            console.log(`FPS: ${this.state.fps.toFixed(1)}`);
        }
    }

    render() {
        // Render scene
        this.sceneManager.render();
    }

    handleResize() {
        // Update render dimensions
        this.config.renderWidth = window.innerWidth;
        this.config.renderHeight = window.innerHeight;
        
        // Notify systems about resize
        this.sceneManager.handleResize();
        this.uiManager.handleResize();
    }

    // Cleanup method for game shutdown
    destroy() {
        this.stop();
        
        // Cleanup all systems
        this.sceneManager.destroy();
        this.player.destroy();
        this.uiManager.destroy();
        this.inputManager.destroy();
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
    }
}