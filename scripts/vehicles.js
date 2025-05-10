// Vehicle System: Handles vehicle logic, physics, and player interaction
// Modular, ES6-compliant, future-ready for multiplayer
import * as THREE from 'three';

export class VehicleManager {
    constructor(world) {
        this.world = world;
        this.scene = world.sceneManager.scene;
        this.vehicles = [];
        this.activeVehicle = null;
    }

    async init() {
        // Placeholder: spawn a demo hovercar and bike
        this.spawnVehicle({ type: 'hovercar', position: { x: 0, y: 0, z: 20 } });
        this.spawnVehicle({ type: 'bike', position: { x: 10, y: 0, z: 25 } });
    }

    spawnVehicle({ type, position }) {
        let vehicle;
        if (type === 'hovercar') {
            vehicle = new HoverCar(position);
        } else if (type === 'bike') {
            vehicle = new Bike(position);
        } else {
            vehicle = new Vehicle(position);
        }
        this.vehicles.push(vehicle);
        this.scene.add(vehicle.mesh);
        return vehicle;
    }

    update(deltaTime) {
        this.vehicles.forEach(v => v.update(deltaTime));
    }

    enterVehicle(player, vehicle) {
        if (vehicle && !vehicle.occupied) {
            vehicle.occupied = true;
            player.enterVehicle(vehicle);
            this.activeVehicle = vehicle;
        }
    }

    exitVehicle(player) {
        if (this.activeVehicle) {
            this.activeVehicle.occupied = false;
            player.exitVehicle();
            this.activeVehicle = null;
        }
    }
}

export class Vehicle {
    constructor(position = { x: 0, y: 0, z: 0 }) {
        this.position = position;
        this.occupied = false;
        this.mesh = this.createMesh();
        this.speed = 0;
        this.maxSpeed = 30;
        this.acceleration = 10;
        this.turnSpeed = 1.5;
    }

    createMesh() {
        // Placeholder: simple box
        const geometry = new THREE.BoxGeometry(6, 2, 12);
        const material = new THREE.MeshStandardMaterial({ color: 0x4444ff, metalness: 0.7 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.position.x, this.position.y + 1, this.position.z);
        return mesh;
    }

    update(deltaTime) {
        // Basic physics placeholder
        if (this.occupied) {
            // Move forward
            this.mesh.position.z -= this.speed * deltaTime;
        }
    }
}

export class HoverCar extends Vehicle {
    constructor(position) {
        super(position);
        this.maxSpeed = 60;
        this.hoverHeight = 2.5;
        this.mesh.material.color.set(0x00ffff);
    }
    update(deltaTime) {
        super.update(deltaTime);
        // Hover effect
        this.mesh.position.y = this.hoverHeight + Math.sin(Date.now() * 0.002) * 0.2;
    }
}

export class Bike extends Vehicle {
    constructor(position) {
        super(position);
        this.maxSpeed = 40;
        this.mesh.material.color.set(0xff8800);
        this.mesh.scale.set(0.5, 0.5, 1);
    }
}