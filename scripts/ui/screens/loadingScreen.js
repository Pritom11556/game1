// Handles the loading screen shown during asset loading
export class LoadingScreen {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
        this.element = null;
    }

    async init() {
        // Create loading screen element
        this.element = document.createElement('div');
        this.element.id = 'loading-screen';
        this.element.className = 'panel';
        this.element.style.display = 'none';
        
        // Loading screen HTML
        this.element.innerHTML = `
            <h2>Loading Future World</h2>
            <div class="loading-container">
                <div class="loading-bar">
                    <div class="loading-progress" id="loading-progress"></div>
                </div>
                <div class="loading-text" id="loading-text">Initializing...</div>
                <div class="loading-tip" id="loading-tip">Tip: Complete daily challenges for extra rewards!</div>
            </div>
            
            <div class="branding">
                <img src="assets/images/logo.png" alt="Game Logo">
            </div>
        `;
        
        // Add to UI container
        this.uiManager.container.appendChild(this.element);
    }

    show() {
        this.element.style.display = 'flex';
    }

    hide() {
        this.element.style.display = 'none';
    }

    updateProgress(progress) {
        const progressPercent = Math.min(100, Math.max(0, progress * 100));
        document.getElementById('loading-progress').style.width = `${progressPercent}%`;
        
        // Update loading text based on progress
        let loadingText = 'Initializing...';
        if (progress > 0.3) loadingText = 'Loading models...';
        if (progress > 0.6) loadingText = 'Loading textures...';
        if (progress > 0.8) loadingText = 'Almost there...';
        
        document.getElementById('loading-text').textContent = loadingText;
    }

    updateTip(tip) {
        document.getElementById('loading-tip').textContent = tip;
    }

    handleResize() {
        // Responsive adjustments if needed
    }

    destroy() {
        // Remove element from DOM
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}