// Handles third-person camera and character movement
export class ThirdPersonController {
    constructor(player) {
        this.player = player;
        this.game = player.game;
        
        // Camera settings
        this.cameraDistance = 5;
        this.cameraHeight = 2;
        this.cameraAngle = 0;
        
        // Movement settings
        this.moveSpeed = 5;
        this.runSpeed = 8;
        this.rotationSpeed = 0.1;
        this.jumpForce = 7;
        
        // Physics
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.rotation = new THREE.Vector3();
        
        // Input state
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.isRunning = false;
        
        // Initialize
        this.initCamera();
        this.initInput();
    }

    async init() {
        // Set up physics body (placeholder)
        // In a real game, you'd use a physics engine like Cannon.js
        this.physicsBody = {
            position: this.player.mesh.position.clone(),
            velocity: new THREE.Vector3(),
            onGround: false
        };
    }

    initCamera() {
        // Create camera rig
        this.cameraPivot = new THREE.Group();
        this.cameraPivot.position.copy(this.player.mesh.position);
        this.game.sceneManager.scene.add(this.cameraPivot);
        
        // Position camera behind player
        this.updateCameraPosition();
    }

    initInput() {
        // Listen to input events
        this.game.inputManager.on('move', (direction) => {
            this.moveForward = direction.forward;
            this.moveBackward = direction.backward;
            this.moveLeft = direction.left;
            this.moveRight = direction.right;
            this.isRunning = direction.run;
        });
        
        this.game.inputManager.on('look', (delta) => {
            this.handleLookInput(delta);
        });
        
        this.game.inputManager.on('jump', () => {
            if (this.physicsBody.onGround) {
                this.physicsBody.velocity.y = this.jumpForce;
                this.physicsBody.onGround = false;
            }
        });
    }

    update(deltaTime) {
        // Handle movement
        this.handleMovement(deltaTime);
        
        // Update physics (simplified)
        this.updatePhysics(deltaTime);
        
        // Update camera position
        this.updateCameraPosition();
    }

    handleMovement(deltaTime) {
        // Reset direction
        this.direction.set(0, 0, 0);
        
        // Calculate movement speed
        const speed = this.isRunning ? this.runSpeed : this.moveSpeed;
        
        // Forward/backward movement
        if (this.moveForward) this.direction.z -= 1;
        if (this.moveBackward) this.direction.z += 1;
        
        // Left/right movement
        if (this.moveLeft) this.direction.x -= 1;
        if (this.moveRight) this.direction.x += 1;
        
        // Normalize direction vector
        if (this.direction.length() > 0) {
            this.direction.normalize();
        }
        
        // Apply movement speed
        this.direction.multiplyScalar(speed * deltaTime);
        
        // Rotate direction to match camera angle
        this.direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.cameraAngle);
        
        // Apply to velocity (ignoring y-axis for now)
        this.velocity.x = this.direction.x;
        this.velocity.z = this.direction.z;
    }

    handleLookInput(delta) {
        // Rotate camera around player
        this.cameraAngle -= delta.x * 0.002;
        
        // Update player rotation to face movement direction
        if (this.direction.length() > 0) {
            const targetAngle = Math.atan2(this.direction.x, this.direction.z);
            this.player.mesh.rotation.y = targetAngle;
        }
    }

    updatePhysics(deltaTime) {
        // Apply gravity
        this.physicsBody.velocity.y -= 9.8 * deltaTime;
        
        // Update position
        this.physicsBody.position.x += this.velocity.x;
        this.physicsBody.position.y += this.physicsBody.velocity.y * deltaTime;
        this.physicsBody.position.z += this.velocity.z;
        
        // Simple ground collision (placeholder)
        if (this.physicsBody.position.y <= 0) {
            this.physicsBody.position.y = 0;
            this.physicsBody.velocity.y = 0;
            this.physicsBody.onGround = true;
        }
        
        // Update player mesh position
        this.player.mesh.position.copy(this.physicsBody.position);
        
        // Update camera pivot position
        this.cameraPivot.position.copy(this.player.mesh.position);
    }

    updateCameraPosition() {
        // Calculate camera position
        const camera = this.game.sceneManager.camera;
        const angle = this.cameraAngle;
        
        const offsetX = Math.sin(angle) * this.cameraDistance;
        const offsetZ = Math.cos(angle) * this.cameraDistance;
        
        camera.position.x = this.cameraPivot.position.x + offsetX;
        camera.position.y = this.cameraPivot.position.y + this.cameraHeight;
        camera.position.z = this.cameraPivot.position.z + offsetZ;
        
        // Make camera look at player
        camera.lookAt(this.cameraPivot.position);
    }

    destroy() {
        // Clean up camera rig
        if (this.cameraPivot && this.cameraPivot.parent) {
            this.cameraPivot.parent.remove(this.cameraPivot);
        }
    }
}