document.addEventListener('DOMContentLoaded', function() {
    const reviewCards = document.querySelectorAll('.review-card');
    const reviewsContainer = document.querySelector('.reviews-container');
    let currentIndex = 0;
    let rotationInterval;
    let isAnimating = false;

    // Initialize cards with proper transitions
    function initializeCards() {
        reviewCards.forEach((card, index) => {
            // Set card dimensions to 4:4 aspect ratio
            card.style.aspectRatio = '1/1';
            card.style.display = 'flex';
            card.style.position = 'absolute';
            card.style.top = '0';
            card.style.left = '0';
            card.style.width = '100%';
            card.style.height = '100%';
            card.style.opacity = index === 0 ? '1' : '0';
            card.style.transform = index === 0 ? 'translateY(0)' : 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background-image 0.5s ease';
            card.style.pointerEvents = 'auto';
            
            // Set background image properties
            const imageUrl = card.getAttribute('data-image');
            card.style.setProperty('--bg-image', `url(${imageUrl})`);
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center center';
            card.style.backgroundRepeat = 'no-repeat';
            
            if (index === 0) {
                card.classList.add('current');
            } else {
                card.classList.remove('current');
            }
        });
    }

    // Rotate to next review with smooth animation
    function rotateReviews() {
        if (isAnimating) return;
        
        isAnimating = true;
        const currentCard = reviewCards[currentIndex];
        const nextIndex = (currentIndex + 1) % reviewCards.length;
        const nextCard = reviewCards[nextIndex];
        
        // Prepare next card
        nextCard.style.display = 'flex';
        nextCard.style.opacity = '0';
        nextCard.style.transform = 'translateY(20px)';
        
        // Animate out current card
        currentCard.style.opacity = '0';
        currentCard.style.transform = 'translateY(-20px)';
        currentCard.classList.remove('current');
        
        // Animate in next card
        setTimeout(() => {
            nextCard.style.opacity = '1';
            nextCard.style.transform = 'translateY(0)';
            nextCard.classList.add('current');
            
            // Hide previous card after animation
            setTimeout(() => {
                currentCard.style.display = 'none';
                currentIndex = nextIndex;
                isAnimating = false;
            }, 50);
        }, 50);
    }

    // Start auto-rotation
    function startRotation() {
        clearInterval(rotationInterval);
        rotationInterval = setInterval(rotateReviews, 5000);
    }

    // Toggle image background without affecting rotation
    function toggleReviewImage(card) {
        if (isAnimating) return;
        
        // Close other active cards
        document.querySelectorAll('.review-card.active').forEach(el => {
            if (el !== card) {
                el.classList.remove('active');
                el.style.backgroundImage = 'none';
                el.style.backgroundColor = 'rgba(6, 0, 10, 0.7)';
            }
        });
        
        // Toggle current card
        const isActivating = !card.classList.contains('active');
        card.classList.toggle('active');
        
        if (isActivating) {
            const imageUrl = card.getAttribute('data-image');
            card.style.backgroundImage = `linear-gradient(rgba(0, 0, 2, 0.7), rgba(6, 0, 10, 0.7)), url(${imageUrl})`;
        } else {
            card.style.backgroundImage = 'none';
            card.style.backgroundColor = 'rgba(6, 0, 10, 0.7)';
        }
    }

    // Initialize and start rotation
    initializeCards();
    startRotation();

    // Attach click handlers
    reviewsContainer.addEventListener('click', function(e) {
        const card = e.target.closest('.review-card');
        if (card && !isAnimating) {
            toggleReviewImage(card);
        }
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (!isAnimating) {
                reviewCards.forEach(card => {
                    card.style.transition = 'none';
                    card.style.opacity = card.classList.contains('current') ? '1' : '0';
                    card.style.transform = card.classList.contains('current') ? 'translateY(0)' : 'translateY(20px)';
                    
                    // Force reflow
                    void card.offsetHeight;
                    
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, background-image 0.5s ease';
                });
            }
        }, 100);
    });
});