document.addEventListener('DOMContentLoaded', () => {
    // Add any interactive elements or animations here
    const progressBar = document.querySelector('.progress');
    
    // Random progress animation
    setInterval(() => {
        const randomWidth = Math.floor(Math.random() * 30) + 20;
        progressBar.style.width = `${randomWidth}%`;
    }, 2000);
}); 