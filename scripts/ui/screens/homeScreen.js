// Handles the home screen/main menu UI
export class HomeScreen {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
        this.element = null;
    }

    async init() {
        // Create home screen element
        this.element = document.createElement('div');
        this.element.id = 'home-screen';
        this.element.className = 'panel';
        this.element.style.display = 'none';
        
        // Home screen HTML
        this.element.innerHTML = `
            <div class="profile-section">
                <img src="assets/images/avatar-placeholder.png" alt="Avatar">
                <div class="profile-info">
                    <h3 id="player-name">Guest</h3>
                    <p id="player-level">Level 1</p>
                </div>
            </div>
            
            <div class="friend-list">
                <h4>Friends Online</h4>
                <div id="friends-container">
                    <p class="empty-message">No friends online</p>
                </div>
            </div>
            
            <div class="home-menu-options">
                <button id="start-game-button" class="button primary">Start Open World</button>
                <button id="solo-button">Solo Mission</button>
                <button id="team-button">Team Up</button>
                <button id="custom-button">Custom Room</button>
            </div>
            
            <div class="daily-rewards">
                <h4>Daily Rewards</h4>
                <div class="rewards-container">
                    <div class="reward-day">Day 1</div>
                    <div class="reward-day">Day 2</div>
                    <div class="reward-day active">Day 3</div>
                    <div class="reward-day">Day 4</div>
                    <div class="reward-day">Day 5</div>
                </div>
            </div>
            
            <div class="news-events">
                <h4>News & Events</h4>
                <div class="news-slider">
                    <div class="news-item">New map update available!</div>
                    <div class="news-item">Season 3 Battle Pass now live</div>
                </div>
            </div>
        `;
        
        // Add to UI container
        this.uiManager.container.appendChild(this.element);
        
        // Add event listeners
        document.getElementById('start-game-button').addEventListener('click', () => this.startGame());
        document.getElementById('solo-button').addEventListener('click', () => this.startSoloMission());
        document.getElementById('team-button').addEventListener('click', () => this.startTeamGame());
        document.getElementById('custom-button').addEventListener('click', () => this.startCustomRoom());
        // New: Setup dynamic UI
        this.updateFriendList();
        this.updateDailyRewards();
        this.initNewsSlider();
    }

    show() {
        this.element.style.display = 'flex';
        // Update player info
        const player = this.game.authManager.currentPlayer;
        if (player) {
            document.getElementById('player-name').textContent = player.name || 'Guest';
            document.getElementById('player-level').textContent = `Level ${player.level || 1}`;
        }
        // Update dynamic UI
        this.updateFriendList();
        this.updateDailyRewards();
    }

    hide() {
        this.element.style.display = 'none';
    }

    startGame() {
        // Hide home screen and show HUD
        this.uiManager.showHUD();
        
        // Start the game
        this.game.sceneManager.world.spawnPlayer();
    }

    startSoloMission() {
        // Start a solo mission
        console.log('Starting solo mission');
        // In a real game, this would load a specific mission
        this.startGame();
    }

    startTeamGame() {
        // Start a team game
        console.log('Starting team game');
        // In a real game, this would matchmake with other players
        this.startGame();
    }

    startCustomRoom() {
        // Start a custom room
        console.log('Starting custom room');
        // In a real game, this would show room creation options
        this.startGame();
    }

    update(deltaTime) {
        // Update any animations or dynamic elements
    }

    handleResize() {
        // Responsive adjustments if needed
    }

    destroy() {
        // Remove event listeners
        document.getElementById('start-game-button').removeEventListener('click', this.startGame);
        document.getElementById('solo-button').removeEventListener('click', this.startSoloMission);
        document.getElementById('team-button').removeEventListener('click', this.startTeamGame);
        document.getElementById('custom-button').removeEventListener('click', this.startCustomRoom);
        
        // Remove element from DOM
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }

    updateFriendList() {
        // Simulate real-time friend list (replace with backend integration)
        const friends = this.game.socialManager ? this.game.socialManager.getOnlineFriends() : [
            { name: 'Alex', status: 'Online' },
            { name: 'Sam', status: 'Online' }
        ];
        const container = document.getElementById('friends-container');
        container.innerHTML = '';
        if (!friends || friends.length === 0) {
            container.innerHTML = '<p class="empty-message">No friends online</p>';
        } else {
            friends.forEach(friend => {
                const div = document.createElement('div');
                div.className = 'friend-entry';
                div.textContent = `${friend.name} (${friend.status})`;
                container.appendChild(div);
            });
        }
    }

    updateDailyRewards() {
        // Simulate daily rewards logic (replace with backend integration)
        const today = 3; // e.g., Day 3 for demo
        const rewardDays = document.querySelectorAll('.reward-day');
        rewardDays.forEach((el, idx) => {
            el.classList.toggle('active', idx === today - 1);
        });
    }

    initNewsSlider() {
        // Simple auto-slider for news/events
        const slider = this.element.querySelector('.news-slider');
        if (!slider) return;
        const items = slider.querySelectorAll('.news-item');
        let idx = 0;
        setInterval(() => {
            items.forEach((el, i) => {
                el.style.display = i === idx ? 'block' : 'none';
            });
            idx = (idx + 1) % items.length;
        }, 3500);
    }
}