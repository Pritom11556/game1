// Handles the in-game heads-up display (HUD)
export class HUD {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
        this.element = null;
    }

    async init() {
        // Create HUD element
        this.element = document.createElement('div');
        this.element.id = 'hud';
        this.element.style.display = 'none';
        
        // HUD HTML
        this.element.innerHTML = `
            <div id="health-bar" class="hud-element">
                <div class="hud-label">HEALTH</div>
                <div class="hud-value" id="health-value">100%</div>
                <div class="hud-bar-container">
                    <div class="hud-bar" id="health-bar-fill"></div>
                </div>
            </div>
            
            <div id="ammo-display" class="hud-element">
                <div class="hud-label">AMMO</div>
                <div class="hud-value" id="ammo-value">30/90</div>
                <div class="hud-bar-container">
                    <div class="hud-bar" id="ammo-bar-fill"></div>
                </div>
            </div>
            
            <div id="mini-map" class="hud-element">
                <canvas id="mini-map-canvas"></canvas>
            </div>
            
            <div id="weapon-display" class="hud-element">
                <img id="weapon-icon" src="assets/icons/weapon-placeholder.png" alt="Weapon">
                <div id="weapon-name">Assault Rifle</div>
            </div>
            
            <div id="objective-display" class="hud-element">
                <div class="hud-label">OBJECTIVE</div>
                <div id="objective-text">Explore the open world</div>
            </div>
            
            <div id="interaction-prompt" class="hud-element">
                <div id="interaction-text">Press [E] to interact</div>
            </div>
            
            <div id="mobile-controls" class="hud-element">
                <div id="virtual-joystick-container">
                    <div id="joystick-base"></div>
                    <div id="joystick-stick"></div>
                </div>
                <button id="jump-button" class="mobile-button">JUMP</button>
                <button id="shoot-button" class="mobile-button">SHOOT</button>
            </div>
        `;
        
        // Add to UI container
        this.uiManager.container.appendChild(this.element);
        
        // Initialize mini-map canvas
        this.initMiniMap();
    }

    show() {
        this.element.style.display = 'block';
        
        // Show mobile controls if on mobile
        if (this.game.inputManager.isMobile()) {
            document.getElementById('mobile-controls').style.display = 'block';
            document.getElementById('virtual-joystick-container').style.display = 'block';
        }
    }

    hide() {
        this.element.style.display = 'none';
    }

    initMiniMap() {
        const canvas = document.getElementById('mini-map-canvas');
        canvas.width = 150;
        canvas.height = 150;
        
        // In a real game, this would render the mini-map
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0, 150, 255, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.7)';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    updateStats(stats) {
        // Update health display
        const healthPercent = Math.max(0, Math.min(100, stats.health));
        document.getElementById('health-value').textContent = `${healthPercent}%`;
        document.getElementById('health-bar-fill').style.width = `${healthPercent}%`;
        
        // Change color based on health level
        if (healthPercent < 30) {
            document.getElementById('health-bar-fill').style.backgroundColor = '#ff0000';
        } else if (healthPercent < 60) {
            document.getElementById('health-bar-fill').style.backgroundColor = '#ff9900';
        } else {
            document.getElementById('health-bar-fill').style.backgroundColor = '#00ff00';
        }
        
        // Update stamina (could be shown in a separate bar)
        // In a real game, you might show stamina for running, etc.
    }

    updateWeapon(weapon) {
        // Update weapon display
        if (weapon) {
            document.getElementById('weapon-icon').src = weapon.icon;
            document.getElementById('weapon-name').textContent = weapon.name;
            document.getElementById('ammo-value').textContent = `${weapon.ammo.current}/${weapon.ammo.max}`;
            
            // Update ammo bar
            const ammoPercent = (weapon.ammo.current / weapon.ammo.max) * 100;
            document.getElementById('ammo-bar-fill').style.width = `${ammoPercent}%`;
        }
    }

    showInteractionPrompt(text) {
        const prompt = document.getElementById('interaction-prompt');
        prompt.style.display = 'block';
        document.getElementById('interaction-text').textContent = text;
    }

    hideInteractionPrompt() {
        document.getElementById('interaction-prompt').style.display = 'none';
    }

    updateObjective(text) {
        document.getElementById('objective-text').textContent = text;
    }

    update(deltaTime) {
        // Update mini-map (would track player position in a real game)
        // Update any animations or dynamic elements
    }

    handleResize() {
        // Adjust HUD elements for different screen sizes
    }

    destroy() {
        // Clean up mini-map
        const canvas = document.getElementById('mini-map-canvas');
        if (canvas) {
            canvas.width = 0;
            canvas.height = 0;
        }
        
        // Remove element from DOM
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}