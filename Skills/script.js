document.addEventListener('DOMContentLoaded', () => {
    // Animate skill bars
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const level = skillItem.getAttribute('data-level');
                const progressBar = skillItem.querySelector('.skill-progress');
                
                progressBar.style.width = `${level}%`;
                
                // Add percentage text
                const percentage = document.createElement('span');
                percentage.className = 'skill-percentage';
                percentage.textContent = `${level}%`;
                percentage.style.cssText = `
                    position: absolute;
                    right: 0;
                    top: 0;
                    color: #4a9eff;
                    font-size: 0.8rem;
                    opacity: 0;
                    transform: translateY(-20px);
                    transition: all 0.3s ease;
                `;
                skillItem.appendChild(percentage);
                
                // Animate percentage
                setTimeout(() => {
                    percentage.style.opacity = '1';
                    percentage.style.transform = 'translateY(0)';
                }, 1500);
                
                // Stop observing after animation
                observer.unobserve(skillItem);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillItems.forEach(item => observer.observe(item));
    
    // Add hover effect for skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', () => {
            const icon = category.querySelector('h2 i');
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        category.addEventListener('mouseleave', () => {
            const icon = category.querySelector('h2 i');
            icon.style.transform = 'scale(1) rotate(0)';
        });
    });
    
    // Add particle effect on skill category hover
    skillCategories.forEach(category => {
        category.addEventListener('mousemove', (e) => {
            const rect = category.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            createParticle(category, x, y);
        });
    });
});

function createParticle(parent, x, y) {
    const particle = document.createElement('div');
    particle.className = 'skill-particle';
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: #4a9eff;
        border-radius: 50%;
        pointer-events: none;
        left: ${x}px;
        top: ${y}px;
        opacity: 1;
        transform: scale(1);
        transition: all 0.6s ease;
    `;
    
    parent.appendChild(particle);
    
    // Animate and remove particle
    requestAnimationFrame(() => {
        particle.style.opacity = '0';
        particle.style.transform = `scale(0) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
        
        setTimeout(() => {
            particle.remove();
        }, 600);
    });
} 