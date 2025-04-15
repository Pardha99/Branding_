document.addEventListener('DOMContentLoaded', () => {
    initSolarSystem();
});

function initSolarSystem() {
    const solarSystem = document.querySelector('.solar-system');
    const centerX = solarSystem.offsetWidth / 2;
    const centerY = solarSystem.offsetHeight / 2;

    // Planet data: name, size, distance from sun, orbit period
    const planets = [
        { name: 'sun', size: 50, distance: 0, period: 0 },
        { name: 'mercury', size: 10, distance: 70, period: 88 },
        { name: 'venus', size: 15, distance: 100, period: 225 },
        { name: 'earth', size: 16, distance: 140, period: 365 },
        { name: 'mars', size: 12, distance: 180, period: 687 },
        { name: 'jupiter', size: 35, distance: 240, period: 4333 },
        { name: 'saturn', size: 30, distance: 300, period: 10759 },
        { name: 'uranus', size: 25, distance: 350, period: 30687 },
        { name: 'neptune', size: 24, distance: 400, period: 60190 }
    ];

    // Create planets and their orbits
    planets.forEach(planet => {
        if (planet.name !== 'sun') {
            // Create orbit
            const orbit = document.createElement('div');
            orbit.className = 'orbit';
            orbit.style.width = `${planet.distance * 2}px`;
            orbit.style.height = `${planet.distance * 2}px`;
            orbit.style.left = `${centerX - planet.distance}px`;
            orbit.style.top = `${centerY - planet.distance}px`;
            solarSystem.appendChild(orbit);
        }

        // Create planet
        const planetEl = document.createElement('div');
        planetEl.className = `planet ${planet.name}`;
        planetEl.style.width = `${planet.size}px`;
        planetEl.style.height = `${planet.size}px`;
        
        if (planet.name === 'sun') {
            planetEl.style.left = `${centerX - planet.size / 2}px`;
            planetEl.style.top = `${centerY - planet.size / 2}px`;
        } else {
            // Position planet on orbit
            const orbitEl = document.createElement('div');
            orbitEl.className = 'orbit-container';
            orbitEl.style.width = `${planet.distance * 2}px`;
            orbitEl.style.height = `${planet.distance * 2}px`;
            orbitEl.style.left = `${centerX - planet.distance}px`;
            orbitEl.style.top = `${centerY - planet.distance}px`;
            orbitEl.style.position = 'absolute';
            orbitEl.style.animation = `orbit ${planet.period / 30}s linear infinite`;
            
            planetEl.style.left = `${planet.distance * 2 - planet.size / 2}px`;
            planetEl.style.top = `${planet.distance - planet.size / 2}px`;
            
            orbitEl.appendChild(planetEl);
            solarSystem.appendChild(orbitEl);
        }

        if (planet.name === 'sun') {
            solarSystem.appendChild(planetEl);
        }
    });

    // Add hover effect for planets
    const planetElements = document.querySelectorAll('.planet');
    planetElements.forEach(planet => {
        planet.addEventListener('mouseover', () => {
            planet.style.transform = 'scale(1.2)';
            planet.style.transition = 'transform 0.3s ease';
        });
        
        planet.addEventListener('mouseout', () => {
            planet.style.transform = 'scale(1)';
        });
    });
}

// Add resize handler to keep solar system centered
window.addEventListener('resize', () => {
    const solarSystem = document.querySelector('.solar-system');
    if (solarSystem) {
        const centerX = solarSystem.offsetWidth / 2;
        const centerY = solarSystem.offsetHeight / 2;

        document.querySelectorAll('.orbit').forEach(orbit => {
            const size = parseInt(orbit.style.width) / 2;
            orbit.style.left = `${centerX - size}px`;
            orbit.style.top = `${centerY - size}px`;
        });

        document.querySelectorAll('.orbit-container').forEach(container => {
            const size = parseInt(container.style.width) / 2;
            container.style.left = `${centerX - size}px`;
            container.style.top = `${centerY - size}px`;
        });

        const sun = document.querySelector('.sun');
        if (sun) {
            const size = parseInt(sun.style.width) / 2;
            sun.style.left = `${centerX - size}px`;
            sun.style.top = `${centerY - size}px`;
        }
    }
});