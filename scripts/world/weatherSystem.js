// Handles dynamic weather effects (rain, fog, lightning, etc.)
import * as THREE from 'three';

export class WeatherSystem {
    constructor(world) {
        this.world = world;
        this.scene = world.sceneManager.scene;
        this.activeWeather = null; // 'clear', 'rain', 'fog', 'storm', etc.
        this.weatherIntensity = 0;
        this.rainParticles = null;
        this.fog = null;
        this.lightning = null;
        this.weatherTimer = 0;
        this.weatherDuration = 0;
    }

    async init() {
        this.setWeather('clear');
    }

    setWeather(type, intensity = 1) {
        this.clearWeather();
        this.activeWeather = type;
        this.weatherIntensity = intensity;
        if (type === 'rain') {
            this.createRain(intensity);
        } else if (type === 'fog') {
            this.createFog(intensity);
        } else if (type === 'storm') {
            this.createRain(intensity * 1.5);
            this.createFog(intensity * 0.7);
            this.createLightning();
        } else {
            this.clearWeather();
        }
    }

    createRain(intensity) {
        const rainCount = Math.floor(10000 * intensity);
        const rainGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(rainCount * 3);
        for (let i = 0; i < rainCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 800;
            positions[i * 3 + 1] = Math.random() * 400 + 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
        }
        rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const rainMaterial = new THREE.PointsMaterial({ color: 0xaaaaee, size: 1.5, transparent: true, opacity: 0.6 });
        this.rainParticles = new THREE.Points(rainGeometry, rainMaterial);
        this.scene.add(this.rainParticles);
    }

    createFog(intensity) {
        this.scene.fog = new THREE.FogExp2(0x888899, 0.002 * intensity);
        this.fog = this.scene.fog;
    }

    createLightning() {
        // Placeholder: flash ambient light
        this.lightning = new THREE.AmbientLight(0xffffff, 0);
        this.scene.add(this.lightning);
    }

    update(deltaTime) {
        // Weather timer for random changes
        this.weatherTimer += deltaTime;
        if (this.weatherTimer > this.weatherDuration) {
            this.randomizeWeather();
            this.weatherTimer = 0;
            this.weatherDuration = 30 + Math.random() * 60;
        }
        // Animate rain
        if (this.rainParticles) {
            const positions = this.rainParticles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= 200 * deltaTime * this.weatherIntensity;
                if (positions[i + 1] < 0) positions[i + 1] = Math.random() * 400 + 100;
            }
            this.rainParticles.geometry.attributes.position.needsUpdate = true;
        }
        // Animate lightning
        if (this.lightning) {
            if (Math.random() < 0.002 * this.weatherIntensity) {
                this.lightning.intensity = 2 + Math.random() * 2;
                setTimeout(() => { if (this.lightning) this.lightning.intensity = 0; }, 100 + Math.random() * 200);
            }
        }
    }

    randomizeWeather() {
        const rand = Math.random();
        if (rand < 0.5) {
            this.setWeather('clear');
        } else if (rand < 0.75) {
            this.setWeather('rain', 0.7 + Math.random() * 0.6);
        } else if (rand < 0.9) {
            this.setWeather('fog', 0.5 + Math.random() * 0.7);
        } else {
            this.setWeather('storm', 1);
        }
    }

    clearWeather() {
        if (this.rainParticles) {
            this.scene.remove(this.rainParticles);
            this.rainParticles.geometry.dispose();
            this.rainParticles.material.dispose();
            this.rainParticles = null;
        }
        if (this.fog) {
            this.scene.fog = null;
            this.fog = null;
        }
        if (this.lightning) {
            this.scene.remove(this.lightning);
            this.lightning = null;
        }
    }

    destroy() {
        this.clearWeather();
    }
}