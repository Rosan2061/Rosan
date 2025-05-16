document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.team-slider');
    const slides = document.querySelectorAll('.team-slide');
    const totalSlides = slides.length;
    let currentIndex = 0;
    const slideDuration = 5000; // 5 seconds per slide
    
    function goToSlide(index) {
        currentIndex = index;
        
        // Wrap around to first slide if at end
        if (currentIndex >= totalSlides) {
            // Jump to first slide without animation
            slider.style.transition = 'none';
            slider.style.transform = 'translateY(0%)';
            // Force reflow to apply the change
            void slider.offsetWidth;
            // Restore transition
            slider.style.transition = 'transform 0.8s ease-in-out';
            currentIndex = 0;
        }
        
        slider.style.transform = `translateY(-${currentIndex * 100}%)`;
    }
    
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Start auto-sliding
    let slideInterval = setInterval(nextSlide, slideDuration);
    
    // Initialize first slide
    goToSlide(0);
});