// Main game initialization file
import { Game } from './scripts/game.js';

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if WebGL is supported
    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
        return;
    }

    // Create game instance
    const game = new Game({
        container: document.getElementById('game-container'),
        uiContainer: document.getElementById('ui-container'),
        debug: false
    });

    // Initialize game systems
    game.init()
        .then(() => {
            console.log('Game initialized successfully');
            // Show loading screen while assets load
            game.uiManager.showLoadingScreen();
            
            // Load all game assets
            return game.assetManager.loadAll();
        })
        .then(() => {
            // Hide loading screen and show login screen
            game.uiManager.hideLoadingScreen();
            game.uiManager.showLoginScreen();
            
            // Start game loop
            game.start();
        })
        .catch(error => {
            console.error('Game initialization failed:', error);
            game.uiManager.showErrorScreen('Failed to initialize game');
        });
});

// WebGL detection helper
const Detector = {
    webgl: (function() {
        try {
            const canvas = document.createElement('canvas');
            return !!(
                window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
            );
        } catch (e) {
            return false;
        }
    })(),

    addGetWebGLMessage: function() {
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.width = '100%';
        container.style.textAlign = 'center';
        container.style.backgroundColor = 'black';
        container.style.color = 'white';
        container.style.padding = '1em';
        container.style.zIndex = '1000';
        
        const message = document.createElement('div');
        message.innerHTML = 'Your browser does not support WebGL. Please upgrade to a modern browser.';
        
        container.appendChild(message);
        document.body.appendChild(container);
    }
};