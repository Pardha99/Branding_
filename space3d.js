import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';

class SpaceEnvironment {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.planets = [];
        this.stars = [];
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '-1';

        // Setup camera
        this.camera.position.z = 50;

        // Create stars
        this.createStars();

        // Create planets
        this.createPlanets();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Start animation
        this.animate();
    }

    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.1
        });

        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
        this.stars.push(stars);
    }

    createPlanets() {
        // Sun
        const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 1
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(sun);
        this.planets.push(sun);

        // Mercury
        this.createPlanet(2, 0x8c8c8c, 20, 0.02);

        // Venus
        this.createPlanet(3, 0xe6b800, 30, 0.015);

        // Earth
        this.createPlanet(4, 0x0066ff, 40, 0.01);

        // Mars
        this.createPlanet(3, 0xff3300, 50, 0.008);

        // Jupiter
        this.createPlanet(8, 0xff9933, 60, 0.005);

        // Saturn
        this.createPlanet(7, 0xffcc66, 70, 0.004);

        // Uranus
        this.createPlanet(5, 0x66ccff, 80, 0.003);

        // Neptune
        this.createPlanet(5, 0x0066cc, 90, 0.002);
    }

    createPlanet(radius, color, distance, speed) {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: color });
        const planet = new THREE.Mesh(geometry, material);
        
        planet.position.x = distance;
        this.scene.add(planet);
        this.planets.push({ mesh: planet, speed: speed, distance: distance });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Rotate planets
        this.planets.forEach((planet, index) => {
            if (index > 0) { // Skip sun
                planet.mesh.rotation.y += planet.speed;
                const time = Date.now() * 0.001;
                planet.mesh.position.x = Math.cos(time * planet.speed) * planet.distance;
                planet.mesh.position.z = Math.sin(time * planet.speed) * planet.distance;
            }
        });

        // Rotate stars
        this.stars.forEach(star => {
            star.rotation.y += 0.0001;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the space environment
const space = new SpaceEnvironment(); 