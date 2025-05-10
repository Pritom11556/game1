// AI System: Handles NPCs, civilians, police, and enemy drones
// Modular, ES6-compliant, future-ready for multiplayer
import * as THREE from 'three';

export class AIManager {
    constructor(world) {
        this.world = world;
        this.scene = world.sceneManager.scene;
        this.npcs = [];
        this.civilians = [];
        this.policeUnits = [];
        this.drones = [];
        this.threatLevel = 0;
    }

    async init() {
        // Placeholder: spawn a few NPCs and civilians
        this.spawnNPC({ type: 'enemy', position: { x: 20, y: 0, z: 20 } });
        this.spawnCivilian({ position: { x: -10, y: 0, z: 15 } });
    }

    update(deltaTime) {
        this.npcs.forEach(npc => npc.update(deltaTime));
        this.civilians.forEach(civ => civ.update(deltaTime));
        this.policeUnits.forEach(police => police.update(deltaTime));
        this.drones.forEach(drone => drone.update(deltaTime));
        this.updateThreatLevel();
    }

    spawnNPC({ type, position }) {
        const npc = new NPC(type, position, this);
        this.npcs.push(npc);
        this.scene.add(npc.mesh);
        return npc;
    }

    spawnCivilian({ position }) {
        const civ = new Civilian(position, this);
        this.civilians.push(civ);
        this.scene.add(civ.mesh);
        return civ;
    }

    spawnPolice({ position }) {
        const police = new PoliceUnit(position, this);
        this.policeUnits.push(police);
        this.scene.add(police.mesh);
        return police;
    }

    spawnDrone({ position }) {
        const drone = new DroneEnemy(position, this);
        this.drones.push(drone);
        this.scene.add(drone.mesh);
        return drone;
    }

    escalatePoliceResponse() {
        // Increase threat and spawn more police
        this.threatLevel++;
        this.spawnPolice({ position: { x: Math.random() * 40 - 20, y: 0, z: Math.random() * 40 - 20 } });
    }

    updateThreatLevel() {
        // Placeholder: escalate if too many NPCs defeated
        if (this.npcs.length < 2 && this.threatLevel < 3) {
            this.escalatePoliceResponse();
        }
    }
}

export class NPC {
    constructor(type = 'enemy', position = { x: 0, y: 0, z: 0 }, aiManager) {
        this.type = type;
        this.position = position;
        this.aiManager = aiManager;
        this.mesh = this.createMesh();
        this.state = 'patrol'; // patrol, attack, flee
        this.health = 100;
    }
    createMesh() {
        // Placeholder: colored sphere
        const geometry = new THREE.SphereGeometry(1.2, 16, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0xff3333 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.position.x, this.position.y + 1.2, this.position.z);
        return mesh;
    }
    update(deltaTime) {
        // Simple state-driven behavior
        if (this.state === 'patrol') {
            this.mesh.position.x += Math.sin(Date.now() * 0.001) * 0.01;
        } else if (this.state === 'attack') {
            // Move toward player (placeholder)
        } else if (this.state === 'flee') {
            // Move away from player (placeholder)
        }
    }
}

export class Civilian {
    constructor(position = { x: 0, y: 0, z: 0 }, aiManager) {
        this.position = position;
        this.aiManager = aiManager;
        this.mesh = this.createMesh();
        this.state = 'idle'; // idle, panic, flee
    }
    createMesh() {
        // Placeholder: colored sphere
        const geometry = new THREE.SphereGeometry(1, 12, 12);
        const material = new THREE.MeshStandardMaterial({ color: 0x33ffcc });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.position.x, this.position.y + 1, this.position.z);
        return mesh;
    }
    update(deltaTime) {
        // React to chaos (placeholder)
        if (this.state === 'panic') {
            this.mesh.position.x += Math.random() * 0.1 - 0.05;
        }
    }
}

export class PoliceUnit {
    constructor(position = { x: 0, y: 0, z: 0 }, aiManager) {
        this.position = position;
        this.aiManager = aiManager;
        this.mesh = this.createMesh();
        this.state = 'respond'; // respond, pursue, attack
    }
    createMesh() {
        // Placeholder: colored box
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({ color: 0x3333ff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.position.x, this.position.y + 1, this.position.z);
        return mesh;
    }
    update(deltaTime) {
        // Escalating threat logic (placeholder)
        if (this.state === 'pursue') {
            // Move toward player (placeholder)
        }
    }
}

export class DroneEnemy {
    constructor(position = { x: 0, y: 0, z: 0 }, aiManager) {
        this.position = position;
        this.aiManager = aiManager;
        this.mesh = this.createMesh();
        this.state = 'patrol'; // patrol, attack
    }
    createMesh() {
        // Placeholder: colored cylinder
        const geometry = new THREE.CylinderGeometry(0.7, 0.7, 0.4, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.position.x, this.position.y + 2, this.position.z);
        return mesh;
    }
    update(deltaTime) {
        // Patrol or attack logic (placeholder)
        if (this.state === 'patrol') {
            this.mesh.position.x += Math.cos(Date.now() * 0.001) * 0.01;
        }
    }
}