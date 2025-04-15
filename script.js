document.addEventListener('DOMContentLoaded', () => {
    // Set active menu item based on current page
    setActiveMenuItem();
    
    // Create star background
    createStars();
});

function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            const href = link.getAttribute('href');
            // Remove leading slash if present for consistency
            const cleanCurrentPath = currentPath.replace(/^\//, '');
            const cleanHref = href.replace(/^\//, '');
            
            if (cleanCurrentPath.includes(cleanHref)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
}

function createStars() {
    const stars = document.querySelector('.stars');
    if (!stars) return;
    
    const count = 200;
    
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3}px;
            height: ${Math.random() * 3}px;
            background: white;
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random()};
            animation: twinkle ${Math.random() * 5 + 3}s infinite;
        `;
        stars.appendChild(star);
    }
}

// Add CSS animation for twinkling stars
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);
