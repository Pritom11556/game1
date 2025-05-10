// Handles the login screen UI and authentication logic
export class LoginScreen {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.game = uiManager.game;
        this.element = null;
    }

    async init() {
        // Create login screen element
        this.element = document.createElement('div');
        this.element.id = 'login-screen';
        this.element.className = 'panel';
        this.element.style.display = 'none';
        
        // Login form HTML
        this.element.innerHTML = `
            <h2>Welcome to Future World</h2>
            
            <div class="form-group">
                <input type="email" id="login-email" class="input-field" placeholder="Email" required>
            </div>
            
            <div class="form-group">
                <input type="password" id="login-password" class="input-field" placeholder="Password" required>
            </div>
            
            <div class="form-options">
                <button id="login-button" class="button">Login</button>
                <button id="guest-button" class="button secondary">Play as Guest</button>
                <button id="register-button" class="button link">Create Account</button>
            </div>
            
            <div id="login-error" class="error-message"></div>
        `;
        
        // Add to UI container
        this.uiManager.container.appendChild(this.element);
        
        // Add event listeners
        document.getElementById('login-button').addEventListener('click', () => this.handleLogin());
        document.getElementById('guest-button').addEventListener('click', () => this.handleGuestLogin());
        document.getElementById('register-button').addEventListener('click', () => this.showRegisterScreen());
    }

    show() {
        this.element.style.display = 'flex';
    }

    hide() {
        this.element.style.display = 'none';
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorElement = document.getElementById('login-error');
        
        // Simple validation
        if (!email || !password) {
            errorElement.textContent = 'Please enter both email and password';
            return;
        }
        
        // Show loading state
        errorElement.textContent = '';
        const loginButton = document.getElementById('login-button');
        loginButton.textContent = 'Logging in...';
        loginButton.disabled = true;
        
        // In a real game, this would call Firebase or your backend
        // For now, we'll simulate a successful login after a delay
        setTimeout(() => {
            this.game.authManager.loginWithEmail(email, password)
                .then(() => {
                    // Login successful - proceed to home screen
                    this.uiManager.showHomeScreen();
                })
                .catch(error => {
                    // Show error message
                    errorElement.textContent = error.message;
                    loginButton.textContent = 'Login';
                    loginButton.disabled = false;
                });
        }, 1000);
    }

    handleGuestLogin() {
        // Show loading state
        const guestButton = document.getElementById('guest-button');
        guestButton.textContent = 'Loading...';
        guestButton.disabled = true;
        
        // Simulate guest login
        setTimeout(() => {
            this.game.authManager.loginAsGuest()
                .then(() => {
                    // Guest login successful - proceed to home screen
                    this.uiManager.showHomeScreen();
                })
                .catch(error => {
                    console.error('Guest login failed:', error);
                    document.getElementById('login-error').textContent = 'Guest login failed';
                    guestButton.textContent = 'Play as Guest';
                    guestButton.disabled = false;
                });
        }, 800);
    }

    showRegisterScreen() {
        // In a real implementation, this would show a registration form
        // For now, we'll just show an alert
        alert('Registration would be implemented here');
    }

    handleResize() {
        // Responsive adjustments if needed
    }

    destroy() {
        // Remove event listeners
        document.getElementById('login-button').removeEventListener('click', this.handleLogin);
        document.getElementById('guest-button').removeEventListener('click', this.handleGuestLogin);
        document.getElementById('register-button').removeEventListener('click', this.showRegisterScreen);
        
        // Remove element from DOM
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}