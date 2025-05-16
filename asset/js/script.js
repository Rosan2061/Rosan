       

        // Animate elements when they come into view
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.service-card, .team-member, .review-card');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        // Set initial state for animation
        document.querySelectorAll('.service-card, .team-member, .review-card').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        // Add scroll event listener
        window.addEventListener('scroll', animateOnScroll);
        // Trigger once on page load
        animateOnScroll();
