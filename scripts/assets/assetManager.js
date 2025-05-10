// Manages loading and caching of all game assets (models, textures, sounds, etc.)
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextureLoader } from 'three';
import { AudioLoader } from 'three';

export class AssetManager {
    constructor(game) {
        this.game = game;
        
        // Asset loaders
        this.gltfLoader = new GLTFLoader();
        this.textureLoader = new TextureLoader();
        this.audioLoader = new AudioLoader();
        
        // Asset caches
        this.models = {};
        this.textures = {};
        this.sounds = {};
        this.animations = {};
        
        // Progress tracking
        this.loadProgress = {
            total: 0,
            loaded: 0
        };
    }

    async loadAll() {
        // Define all assets to load
        const assetsToLoad = [
            // Models
            { type: 'model', key: 'player', path: 'assets/models/player.glb' },
            { type: 'model', key: 'vehicle', path: 'assets/models/vehicle.glb' },
            { type: 'model', key: 'weapon', path: 'assets/models/weapon.glb' },
            
            // Textures
            { type: 'texture', key: 'terrain', path: 'assets/textures/terrain.jpg' },
            { type: 'texture', key: 'skybox', path: 'assets/textures/skybox.png' },
            { type: 'texture', key: 'ui', path: 'assets/textures/ui.png' },
            
            // Sounds
            { type: 'sound', key: 'gunshot', path: 'assets/sounds/gunshot.mp3' },
            { type: 'sound', key: 'ambient', path: 'assets/sounds/ambient.mp3' },
            { type: 'sound', key: 'vehicle', path: 'assets/sounds/vehicle.mp3' }
        ];
        
        // Set total assets to load
        this.loadProgress.total = assetsToLoad.length;
        this.loadProgress.loaded = 0;
        
        // Update loading screen with progress
        this.game.uiManager.updateLoadingProgress(0);
        
        // Load all assets
        const loadPromises = assetsToLoad.map(asset => {
            return this.loadAsset(asset.type, asset.key, asset.path)
                .then(() => {
                    this.loadProgress.loaded++;
                    const progress = this.loadProgress.loaded / this.loadProgress.total;
                    this.game.uiManager.updateLoadingProgress(progress);
                });
        });
        
        // Wait for all assets to load
        await Promise.all(loadPromises);
    }

    loadAsset(type, key, path) {
        return new Promise((resolve, reject) => {
            switch (type) {
                case 'model':
                    this.gltfLoader.load(
                        path,
                        (gltf) => {
                            this.models[key] = gltf;
                            resolve();
                        },
                        undefined,
                        (error) => {
                            console.error(`Error loading model ${key}:`, error);
                            reject(error);
                        }
                    );
                    break;
                
                case 'texture':
                    this.textureLoader.load(
                        path,
                        (texture) => {
                            this.textures[key] = texture;
                            resolve();
                        },
                        undefined,
                        (error) => {
                            console.error(`Error loading texture ${key}:`, error);
                            reject(error);
                        }
                    );
                    break;
                
                case 'sound':
                    this.audioLoader.load(
                        path,
                        (buffer) => {
                            this.sounds[key] = buffer;
                            resolve();
                        },
                        undefined,
                        (error) => {
                            console.error(`Error loading sound ${key}:`, error);
                            reject(error);
                        }
                    );
                    break;
                
                default:
                    reject(new Error(`Unknown asset type: ${type}`));
            }
        });
    }

    getModel(key) {
        if (!this.models[key]) {
            console.warn(`Model ${key} not found in cache`);
            return null;
        }
        return this.models[key];
    }

    getTexture(key) {
        if (!this.textures[key]) {
            console.warn(`Texture ${key} not found in cache`);
            return null;
        }
        return this.textures[key];
    }

    getSound(key) {
        if (!this.sounds[key]) {
            console.warn(`Sound ${key} not found in cache`);
            return null;
        }
        return this.sounds[key];
    }

    getAnimation(key) {
        if (!this.animations[key]) {
            console.warn(`Animation ${key} not found in cache`);
            return null;
        }
        return this.animations[key];
    }

    destroy() {
        // Dispose of all loaded assets
        Object.values(this.models).forEach(model => {
            model.scene.traverse(child => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        });
        
        Object.values(this.textures).forEach(texture => texture.dispose());
        
        // Clear caches
        this.models = {};
        this.textures = {};
        this.sounds = {};
        this.animations = {};
        
        // Reset progress
        this.loadProgress = {
            total: 0,
            loaded: 0
        };
    }
}