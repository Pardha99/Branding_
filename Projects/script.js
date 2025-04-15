document.addEventListener('DOMContentLoaded', () => {
    // Add staggered animation to project cards
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Add click event to Learn More buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectTitle = e.target.closest('.project-card').querySelector('h2').textContent;
            alert(`Detailed information about ${projectTitle} coming soon!`);
        });
    });

    // Add hover effect for project tech tags
    const techTags = document.querySelectorAll('.project-tech span');
    techTags.forEach(tag => {
        tag.addEventListener('mouseover', () => {
            tag.style.transform = 'scale(1.1)';
            tag.style.transition = 'transform 0.3s ease';
        });
        
        tag.addEventListener('mouseout', () => {
            tag.style.transform = 'scale(1)';
        });
    });
}); 