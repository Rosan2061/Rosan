
    document.addEventListener('DOMContentLoaded', function() {
        const textElement = document.getElementById('auto-writer');
        const texts = [
            "Hello Everyone !",
            "I Am Rosan Khattri Chettri.",
            "Welcome To My Website.",
            "I Am A Graphic Designer. ",
            "I Am A Website Developer .",
            "For More Services and Update's ",
            "Contact or Follow US."
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isEnd = false;
        
        function typeWriter() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                // Deleting text
                textElement.innerHTML = currentText.substring(0, charIndex - 1) + '<span class="auto-writer-cursor"></span>';
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(typeWriter, 500);
                } else {
                    setTimeout(typeWriter, 50);
                }
            } else {
                // Writing text
                textElement.innerHTML = currentText.substring(0, charIndex + 1) + '<span class="auto-writer-cursor"></span>';
                charIndex++;
                
                if (charIndex === currentText.length) {
                    isEnd = true;
                    setTimeout(typeWriter, 2000); // Pause at end of sentence
                } else {
                    setTimeout(typeWriter, 100);
                }
                
                // Switch to deleting mode when text is complete
                if (charIndex === currentText.length && !isDeleting && !isEnd) {
                    setTimeout(() => {
                        isDeleting = true;
                        typeWriter();
                    }, 2000);
                }
            }
            
            // After showing full sentence, prepare to delete and show next
            if (charIndex === currentText.length && isEnd) {
                setTimeout(() => {
                    isDeleting = true;
                    isEnd = false;
                    typeWriter();
                }, 2000);
            }
        }
        
        // Start the typing effect
        setTimeout(typeWriter, 1000);
    });
