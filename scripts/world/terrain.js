// Handles terrain generation and management
export class Terrain {
    constructor(world) {
        this.world = world;
        this.scene = world.sceneManager.scene;
        this.game = world.sceneManager.game;
        
        // Terrain settings
        this.size = 1000;
        this.segments = 100;
        this.heightVariation = 50;
        
        // Terrain objects
        this.mesh = null;
        this.heightmap = null;
    }

    async init() {
        // Create terrain geometry
        const geometry = new THREE.PlaneGeometry(
            this.size, 
            this.size, 
            this.segments, 
            this.segments
        );
        
        // Generate heightmap (procedural for now)
        this.generateHeightmap(geometry);
        
        // Create material
        const material = new THREE.MeshStandardMaterial({
            color: 0x3d9970,
            wireframe: false,
            flatShading: true
        });
        
        // Create mesh
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.receiveShadow = true;
        
        // Add to scene
        this.scene.add(this.mesh);
    }

    generateHeightmap(geometry) {
        // Create a simple procedural heightmap
        const vertices = geometry.attributes.position;
        
        // Use Perlin noise for more natural terrain
        const noise = new SimplexNoise();
        
        for (let i = 0; i < vertices.count; i++) {
            const x = vertices.getX(i);
            const z = vertices.getZ(i);
            
            // Base noise
            let height = noise.noise2D(x / 100, z / 100) * this.heightVariation;
            
            // Add some smaller details
            height += noise.noise2D(x / 30, z / 30) * (this.heightVariation * 0.3);
            
            // Flatten the center area (for player spawn)
            const distanceToCenter = Math.sqrt(x * x + z * z);
            if (distanceToCenter < 50) {
                height *= distanceToCenter / 50;
            }
            
            vertices.setY(i, height);
        }
        
        // Update normals for proper lighting
        geometry.computeVertexNormals();
    }

    getHeightAtPosition(x, z) {
        // Simple height lookup (would be more optimized in a real game)
        if (!this.mesh) return 0;
        
        // Convert world position to local terrain coordinates
        const localX = x + this.size / 2;
        const localZ = z + this.size / 2;
        
        // Get the closest vertex height
        const geometry = this.mesh.geometry;
        const vertices = geometry.attributes.position;
        
        const gridSize = this.size / this.segments;
        const gridX = Math.floor(localX / gridSize);
        const gridZ = Math.floor(localZ / gridSize);
        
        const index = gridZ * (this.segments + 1) + gridX;
        
        if (index >= 0 && index < vertices.count) {
            return vertices.getY(index);
        }
        
        return 0;
    }

    update(deltaTime) {
        // Update any dynamic terrain elements
    }

    destroy() {
        // Remove from scene
        if (this.mesh && this.mesh.parent) {
            this.mesh.parent.remove(this.mesh);
        }
        
        // Dispose of geometry and material
        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }
    }
}