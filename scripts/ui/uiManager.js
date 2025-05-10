// Manages all UI elements and screens in the game
import { LoginScreen } from './screens/loginScreen.js';
import { HomeScreen } from './screens/homeScreen.js';
import { HUD } from './hud/hud.js';
import { LoadingScreen } from './screens/loadingScreen.js';
import { DeathScreen } from './screens/deathScreen.js';

export class UIManager {
    constructor(game) {
        this.game = game;
        this.container = game.config.uiContainer;
        
        // UI screens
        this.loginScreen = null;
        this.homeScreen = null;
        this.hud = null;
        this.loadingScreen = null;
        this.deathScreen = null;
        
        // Current active screen
        this.currentScreen = null;
    }

    async init() {
        // Create all UI screens
        this.loginScreen = new LoginScreen(this);
        this.homeScreen = new HomeScreen(this);
        this.hud = new HUD(this);
        this.loadingScreen = new LoadingScreen(this);
        this.deathScreen = new DeathScreen(this);
        
        // Initialize screens
        await this.loginScreen.init();
        await this.homeScreen.init();
        await this.hud.init();
        await this.loadingScreen.init();
        await this.deathScreen.init();
        
        // Hide all screens initially
        this.hideAllScreens();
    }

    hideAllScreens() {
        this.loginScreen.hide();
        this.homeScreen.hide();
        this.hud.hide();
        this.loadingScreen.hide();
        this.deathScreen.hide();
    }

    showLoginScreen() {
        this.hideAllScreens();
        this.loginScreen.show();
        this.currentScreen = 'login';
    }

    showHomeScreen() {
        this.hideAllScreens();
        this.homeScreen.show();
        this.currentScreen = 'home';
    }

    showHUD() {
        this.hideAllScreens();
        this.hud.show();
        this.currentScreen = 'hud';
    }

    showLoadingScreen() {
        this.hideAllScreens();
        this.loadingScreen.show();
        this.currentScreen = 'loading';
    }

    showDeathScreen() {
        this.hideAllScreens();
        this.deathScreen.show();
        this.currentScreen = 'death';
    }

    showErrorScreen(message) {
        // Create error message element if it doesn't exist
        let errorElement = document.getElementById('error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'error-message';
            errorElement.className = 'error-panel';
            this.container.appendChild(errorElement);
        }
        
        // Set error message
        errorElement.innerHTML = `
            <h2>Error</h2>
            <p>${message}</p>
            <button class="button" id="error-retry">Retry</button>
        `;
        
        // Add retry button handler
        document.getElementById('error-retry').addEventListener('click', () => {
            window.location.reload();
        });
        
        // Show error screen
        this.hideAllScreens();
        errorElement.style.display = 'block';
        this.currentScreen = 'error';
    }

    updatePlayerStats(stats) {
        // Update HUD with player stats
        this.hud.updateStats(stats);
    }

    update(deltaTime) {
        // Update current screen
        switch (this.currentScreen) {
            case 'hud':
                this.hud.update(deltaTime);
                break;
            case 'home':
                this.homeScreen.update(deltaTime);
                break;
        }
    }

    handleResize() {
        // Notify all screens about resize
        this.loginScreen.handleResize();
        this.homeScreen.handleResize();
        this.hud.handleResize();
        this.loadingScreen.handleResize();
        this.deathScreen.handleResize();
    }

    destroy() {
        // Cleanup all UI elements
        this.loginScreen.destroy();
        this.homeScreen.destroy();
        this.hud.destroy();
        this.loadingScreen.destroy();
        this.deathScreen.destroy();
        
        // Clear container
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }
}