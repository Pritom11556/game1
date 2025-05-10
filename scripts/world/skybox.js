// Handles the skybox and day/night cycle
export class Skybox {
    constructor(world) {
        this.world = world;
        this.scene = world.sceneManager.scene;
        this.game = world.sceneManager.game;
        
        // Sky settings
        this.timeOfDay = 12; // 0-24 hours
        this.dayLength = 120; // Seconds for a full day
        
        // Sky objects
        this.skybox = null;
        this.sun = null;
        this.moon = null;
    }

    async init() {
        // Create skybox (simplified for now)
        const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
        const skyMaterial = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,
            side: THREE.BackSide
        });
        
        this.skybox = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(this.skybox);
        
        // Create sun and moon (placeholder)
        this.createSun();
        this.createMoon();
    }

    createSun() {
        const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFF00,
            transparent: true,
            opacity: 0.9
        });
        
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);
    }

    createMoon() {
        const moonGeometry = new THREE.SphereGeometry(8, 32, 32);
        const moonMaterial = new THREE.MeshBasicMaterial({
            color: 0xDDDDFF,
            transparent: true,
            opacity: 0.8
        });
        
        this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
        this.scene.add(this.moon);
    }

    update(deltaTime) {
        // Update time of day
        this.timeOfDay += (deltaTime / this.dayLength) * 24;
        if (this.timeOfDay >= 24) this.timeOfDay -= 24;
        
        // Update sun and moon positions
        this.updateCelestialPositions();
        
        // Update sky color based on time of day
        this.updateSkyColor();
    }

    updateCelestialPositions() {
        // Calculate angles based on time of day
        const sunAngle = (this.timeOfDay / 24) * Math.PI * 2;
        const moonAngle = sunAngle + Math.PI; // Opposite of sun
        
        // Distance from world center
        const distance = 400;
        
        // Update sun position
        this.sun.position.x = Math.cos(sunAngle) * distance;
        this.sun.position.y = Math.sin(sunAngle) * distance;
        this.sun.position.z = 0;
        
        // Update moon position
        this.moon.position.x = Math.cos(moonAngle) * distance;
        this.moon.position.y = Math.sin(moonAngle) * distance;
        this.moon.position.z = 0;
    }

    updateSkyColor() {
        // Calculate sky color based on time of day
        let skyColor = new THREE.Color(0x87CEEB); // Default daylight
        
        // Night time (10pm - 5am)
        if (this.timeOfDay < 5 || this.timeOfDay > 22) {
            skyColor.setHex(0x000033); // Dark blue
        } 
        // Sunrise/sunset
        else if (this.timeOfDay > 19 || this.timeOfDay < 7) {
            const factor = this.timeOfDay < 7 ? 
                (this.timeOfDay - 5) / 2 : // Sunrise
                (23 - this.timeOfDay) / 4; // Sunset
            
            skyColor.setHex(0x87CEEB).lerp(new THREE.Color(0xFF4500), factor);
        }
        
        // Apply to skybox
        if (this.skybox.material) {
            this.skybox.material.color.copy(skyColor);
        }
    }

    destroy() {
        // Remove from scene
        if (this.skybox && this.skybox.parent) {
            this.skybox.parent.remove(this.skybox);
        }
        if (this.sun && this.sun.parent) {
            this.sun.parent.remove(this.sun);
        }
        if (this.moon && this.moon.parent) {
            this.moon.parent.remove(this.moon);
        }
        
        // Dispose of materials
        if (this.skybox) {
            this.skybox.geometry.dispose();
            this.skybox.material.dispose();
        }
        if (this.sun) {
            this.sun.geometry.dispose();
            this.sun.material.dispose();
        }
        if (this.moon) {
            this.moon.geometry.dispose();
            this.moon.material.dispose();
        }
    }
}