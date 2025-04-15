document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item:not(.active)');
    const pages = document.querySelectorAll('.page');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.querySelector('a')) return;
            e.preventDefault();
            
            menuItems.forEach(i => i.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            item.classList.add('active');
            const pageId = item.getAttribute('data-page');
            document.getElementById(pageId).classList.add('active');
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Skip processing for anchor tags
            if (item.querySelector('a')) return;
            
            e.preventDefault();
            
            // Remove active states
            menuItems.forEach(i => i.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            
            // Set new active states
            item.classList.add('active');
            const pageId = item.getAttribute('data-page');
            if (pageId) document.getElementById(pageId).classList.add('active');
        });
    });

    // Initialize stellar background
    const bg = document.createElement('div');
    bg.className = 'stellar-particles';
    document.body.prepend(bg);

    // Generate animated particles
    for (let i = 0; i < 200; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${Math.random() * 3}px;
            height: ${Math.random() * 3}px;
            animation-delay: ${Math.random() * 5}s;
        `;
        particle.className = 'cosmic-particle';
        bg.appendChild(particle);
    }

    const quoteCards = document.querySelectorAll('.quote-card');
    
    // Add staggered animation on page load
    quoteCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Add hover effects
    quoteCards.forEach(card => {
        card.addEventListener('mouseover', () => {
            const icon = card.querySelector('.quote-icon i');
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseout', () => {
            const icon = card.querySelector('.quote-icon i');
            icon.style.transform = 'scale(1) rotate(0deg)';
        });

        // Add click effect
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Add parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        quoteCards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            const angleX = (cardCenterY - e.clientY) * 0.01;
            const angleY = (e.clientX - cardCenterX) * 0.01;

            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
    });
});