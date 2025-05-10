// Manages the player character including movement, controls, and animations
import * as THREE from 'three';
import { ThirdPersonController } from './thirdPersonController.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.scene = game.sceneManager.scene;
        this.camera = game.sceneManager.camera;
        this.input = game.inputManager;
        
        // Player properties
        this.mesh = null;
        this.controller = null;
        this.stats = {
            health: 100,
            stamina: 100,
            speed: 5,
            jumpForce: 7,
            isGrounded: false
        };
        
        // Movement state
        this.state = {
            isMoving: false,
            isRunning: false,
            isCrouching: false,
            isJumping: false,
            isSliding: false,
            isClimbing: false
        };
    }

    async init() {
        // Create player model (placeholder for now)
        this.mesh = this.createPlayerModel();
        this.scene.add(this.mesh);
        
        // Initialize controller
        this.controller = new ThirdPersonController(this);
        await this.controller.init();
        
        // Position player
        this.mesh.position.set(0, 5, 0);
    }

    createPlayerModel() {
        // Placeholder player model (will be replaced with actual model)
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Enable shadows
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        return mesh;
    }

    update(deltaTime) {
        // Update controller
        this.controller.update(deltaTime);
        
        // Update player state based on input
        this.handleInput();
        
        // Update animations
        this.updateAnimations();
    }

    handleInput() {
        // Movement
        if (this.input.keys.forward || this.input.keys.backward || 
            this.input.keys.left || this.input.keys.right) {
            this.state.isMoving = true;
            
            // Check for running (requires stamina)
            if (this.input.keys.run && this.stats.stamina > 0) {
                this.state.isRunning = true;
                this.stats.stamina -= 0.5; // Stamina drain
            } else {
                this.state.isRunning = false;
                // Stamina regeneration when not running
                if (this.stats.stamina < 100) {
                    this.stats.stamina += 0.2;
                }
            }
        } else {
            this.state.isMoving = false;
            this.state.isRunning = false;
        }
        
        // Jumping
        if (this.input.keys.jump && this.stats.isGrounded) {
            this.state.isJumping = true;
            this.stats.isGrounded = false;
        }
        
        // Crouching
        this.state.isCrouching = this.input.keys.crouch;
        
        // Update UI with player stats
        this.game.uiManager.updatePlayerStats(this.stats);
    }

    updateAnimations() {
        // Placeholder for animation logic
        // Will be replaced with actual animation system
    }

    takeDamage(amount) {
        this.stats.health -= amount;
        
        // Check for death
        if (this.stats.health <= 0) {
            this.die();
        }
        
        // Update UI
        this.game.uiManager.updatePlayerStats(this.stats);
    }

    die() {
        // Handle player death
        console.log('Player died');
        this.game.uiManager.showDeathScreen();
    }

    destroy() {
        // Cleanup player model
        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
        
        // Cleanup controller
        if (this.controller) {
            this.controller.destroy();
        }
    }
}