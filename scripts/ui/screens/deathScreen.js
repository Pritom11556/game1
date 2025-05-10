// Handles the death screen shown when the player dies
export class DeathScreen {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
        this.element = null;
    }

    async init() {
        // Create death screen element
        this.element = document.createElement('div');
        this.element.id = 'death-screen';
        this.element.className = 'panel';
        this.element.style.display = 'none';
        
        // Death screen HTML
        this.element.innerHTML = `
            <h2>Mission Failed</h2>
            <div class="death-stats">
                <div class="stat">
                    <div class="stat-label">Time Survived</div>
                    <div class="stat-value" id="time-survived">00:00</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Enemies Defeated</div>
                    <div class="stat-value" id="enemies-defeated">0</div>
                </div>
                <div class="stat">
                    <div class="stat-label">Distance Traveled</div>
                    <div class="stat-value" id="distance-traveled">0m</div>
                </div>
            </div>
            
            <div class="death-options">
                <button id="respawn-button" class="button primary">Respawn</button>
                <button id="quit-button" class="button secondary">Quit to Menu</button>
            </div>
            
            <div class="death-message">
                "The future belongs to those who keep fighting"
            </div>
        `;
        
        // Add to UI container
        this.uiManager.container.appendChild(this.element);
        
        // Add event listeners
        document.getElementById('respawn-button').addEventListener('click', () => this.handleRespawn());
        document.getElementById('quit-button').addEventListener('click', () => this.handleQuit());
    }

    show() {
        this.element.style.display = 'flex';
        
        // Update stats
        const player = this.game.player;
        document.getElementById('time-survived').textContent = this.formatTime(this.game.timePlayed);
        document.getElementById('enemies-defeated').textContent = player.stats.enemiesDefeated || 0;
        document.getElementById('distance-traveled').textContent = `${player.stats.distanceTraveled || 0}m`;
    }

    hide() {
        this.element.style.display = 'none';
    }

    handleRespawn() {
        // Respawn player
        this.game.player.respawn();
        
        // Hide death screen and show HUD
        this.uiManager.showHUD();
    }

    handleQuit() {
        // Quit to main menu
        this.game.reset();
        this.uiManager.showHomeScreen();
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    handleResize() {
        // Responsive adjustments if needed
    }

    destroy() {
        // Remove event listeners
        document.getElementById('respawn-button').removeEventListener('click', this.handleRespawn);
        document.getElementById('quit-button').removeEventListener('click', this.handleQuit);
        
        // Remove element from DOM
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}