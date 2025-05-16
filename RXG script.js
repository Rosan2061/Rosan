document.addEventListener('DOMContentLoaded', function() {
    // Password configuration
    const CORRECT_PASSWORD = "Ro&@n2061";
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    // DOM elements
    const loginContainer = document.getElementById('login-container');
    const galleryContainer = document.getElementById('gallery-container');
    const passwordInput = document.getElementById('password-input');
    const loginBtn = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');
    const showPasswordBtn = document.getElementById('show-password');
    const logoutBtn = document.getElementById('logout-btn');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const galleryGrid = document.getElementById('gallery-grid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeLightbox = document.getElementById('close-lightbox');
    const downloadBtn = document.getElementById('download-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const filterSelect = document.getElementById('filter-select');
    
    // Gallery data
    let images = [
        { id: 1, src: 'asset/img/RXG/NCCF.jpg', title: 'RX NCCF', tags: ['National Citizenship Certificate Front'] },
        { id: 2, src: 'asset/img/RXG/NCCB.jpg', title: 'RX NCCB', tags: ['National Citizenship Certificate Back'] },
        { id: 3, src: 'asset/img/RXG/DCP.jpg', title: 'RX DCP', tags: ['DANDAPIDIT Certificate Photocopy'] },
        { id: 4, src: 'asset/img/RXG/MBBCD.jpg', title: 'RX MBBCD', tags: ['MUKTHINAT BIKAS BANK CHECK DETAIL'] },
        { id: 5, src: 'asset/img/RXG/MBBD.jpg', title: 'RX MBBD', tags: ['MUKTHINAT BIKAS BANK DETAIL'] },
        { id: 6, src: 'asset/img/RXG/NEB MC.jpg', title: 'RX NEB MC', tags: ['NEB Migration Certificate'] },
        { id: 7, src: 'asset/img/RXG/NBCD.jpg', title: 'RX NBCD', tags: ['NEPAL BANK CHECK DETAIL'] },
        { id: 8, src: 'asset/img/RXG/NBD.jpg', title: 'RX NBD', tags: ['NEPAL BANK DEATIL'] },
        { id: 9, src: 'asset/img/RXG/BLE GEAC.jpg', title: 'RX BLE GEAC', tags: ['BLE Grade Examination Admission Card'] },
        { id: 10, src: 'asset/img/RXG/G12 EGIF.jpg', title: 'RX G12 EGIF', tags: ['Grade 12 Exam Grade Improvement Farm'] },
        { id: 11, src: 'asset/img/RXG/G12 EF.jpg', title: 'RX G12 EF', tags: ['Grade 12 Exam Farm'] },
        { id: 12, src: 'asset/img/RXG/NEB SRC.jpg', title: 'RX NEB SRC', tags: ['NEB Student Registration Card'] },
        { id: 13, src: 'asset/img/RXG/RKC PD.jpg', title: 'RX RKC PD', tags: ['Rosan KC Passport Detail - 11NOV2024 , 10NOV2034'] },
        { id: 14, src: 'asset/img/RXG/SEE G9RC.jpg', title: 'RX SEE G9RC', tags: ['SEE Grade 9 Registration Certificate'] },
        { id: 15, src: 'asset/img/RXG/SEE G10EC.jpg', title: 'RX SEE G10EC', tags: ['SEE Grade 10 Entrance Card'] },
        { id: 16, src: 'asset/img/RXG/TU 4YR BBS 1ST EEC.jpg', title: 'RX TU 4YR BBS 1ST EEC', tags: ['TU 4yr BBS 1yr Exam Entry Card'] },
        { id: 17, src: 'asset/img/RXG/B.jpg', title: 'RX B', tags: ['Banganga'] },
        { id: 18, src: 'asset/img/RXG/BLE G8GS.jpg', title: 'RX BLE G8GS', tags: ['BLE Grade 8 Grade Sheet'] },
        { id: 19, src: 'asset/img/RXG/GTI CCC 6M.jpg', title: 'RX GTI CCC 6M', tags: ['GTI Computer Course Certificate Of 6 month'] },
        { id: 20, src: 'asset/img/RXG/LGNSS G11GS.jpg', title: 'RX LGNSS G11GS', tags: ['LGNSS Grade 11 Grade Sheet'] },
        { id: 21, src: 'asset/img/RXG/LGNSS T&CC NEB.jpg', title: 'RX LGNSS T&CC NEB', tags: ['LGNSS Transfer & Character Certificate Of NEB'] },
        { id: 22, src: 'asset/img/RXG/LGNSS T&CC SEE.jpg', title: 'RX LGNSS T&CC SEE', tags: ['LGNSS Transfer & Character Certificate Of SEE'] },
        { id: 23, src: 'asset/img/RXG/NIDF RKC.jpg', title: 'RX NIDF RKC', tags: ['National Identity Crad Farm Rosan KC'] },
        { id: 24, src: 'asset/img/RXG/NEB PC.jpg', title: 'RX NEB PC', tags: ['NEB  Provisional Certificate'] },
        { id: 25, src: 'asset/img/RXG/NEB GIEC.jpg', title: 'RX NEB GIEC', tags: ['NEB Grade Improvement Examination Certificate'] },
        { id: 26, src: 'asset/img/RXG/SEE G10C.jpg', title: 'RX SEE G10C', tags: ['SEE Grade 10 Certificate'] },
        { id: 27, src: 'asset/img/RXG/SEE G10GS.jpg', title: 'RX SEE G10GS', tags: ['SEE Grade 10 Grade Sheet'] },
        { id: 28, src: 'asset/img/RXG/SLC G12GS.jpg', title: 'RX SLC G12GS', tags: ['SLC Grade 12 Grade Sheet -  Academic Transcript'] }

    ];
    
    let currentImageIndex = 0;
    let sessionTimeout;
    let filteredImages = [];
    
    // Check if user is already logged in
    checkLoginStatus();
    
    // Event listeners
    loginBtn.addEventListener('click', handleLogin);
    showPasswordBtn.addEventListener('click', togglePasswordVisibility);
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleLogin();
    });
    
    logoutBtn.addEventListener('click', logout);
    searchBtn.addEventListener('click', searchImages);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchImages();
    });
    
    closeLightbox.addEventListener('click', closeLightboxView);
    downloadBtn.addEventListener('click', downloadImage);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    filterSelect.addEventListener('change', filterImagesByTag);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightboxView();
        }
    });
    
    // Functions
    function checkLoginStatus() {
        const loggedIn = localStorage.getItem('galleryLoggedIn');
        const loginTime = localStorage.getItem('galleryLoginTime');
        
        if (loggedIn === 'true') {
            const timeSinceLogin = new Date().getTime() - parseInt(loginTime);
            
            if (timeSinceLogin < SESSION_TIMEOUT) {
                // User is still within session timeout
                loginContainer.style.display = 'none';
                galleryContainer.style.display = 'block';
                loadGallery();
                startSessionTimer();
            } else {
                // Session expired
                localStorage.removeItem('galleryLoggedIn');
                localStorage.removeItem('galleryLoginTime');
            }
        }
    }
    
    function handleLogin() {
        const password = passwordInput.value.trim();
        
        if (password === CORRECT_PASSWORD) {
            // Successful login
            errorMessage.textContent = '';
            localStorage.setItem('galleryLoggedIn', 'true');
            localStorage.setItem('galleryLoginTime', new Date().getTime().toString());
            
            loginContainer.style.display = 'none';
            galleryContainer.style.display = 'block';
            
            loadGallery();
            startSessionTimer();
        } else {
            // Incorrect password
            errorMessage.textContent = 'Incorrect password. Please try again.';
            passwordInput.value = '';
            passwordInput.focus();
        }
    }
    
    function togglePasswordVisibility() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        showPasswordBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    }
    
    function startSessionTimer() {
        // Clear any existing timeout
        if (sessionTimeout) clearTimeout(sessionTimeout);
        
        // Set new timeout
        sessionTimeout = setTimeout(() => {
            alert('Your session has expired due to inactivity. Please log in again.');
            logout();
        }, SESSION_TIMEOUT);
    }
    
    function resetSessionTimer() {
        startSessionTimer();
    }
    
    function logout() {
        localStorage.removeItem('galleryLoggedIn');
        localStorage.removeItem('galleryLoginTime');
        
        if (sessionTimeout) clearTimeout(sessionTimeout);
        
        galleryContainer.style.display = 'none';
        loginContainer.style.display = 'flex';
        passwordInput.value = '';
        passwordInput.focus();
    }
    
    function loadGallery() {
        galleryGrid.innerHTML = '';
        filteredImages = [...images];
        
        // Populate tag filter
        populateTagFilter();
        
        filteredImages.forEach((image, index) => {
            createGalleryItem(image, index);
        });
    }
    
    function populateTagFilter() {
        const allTags = new Set();
        images.forEach(image => {
            image.tags.forEach(tag => allTags.add(tag));
        });
        
        filterSelect.innerHTML = '<option value="">All Categories</option>';
        allTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
            filterSelect.appendChild(option);
        });
    }
    
    function filterImagesByTag() {
        const selectedTag = filterSelect.value;
        
        if (!selectedTag) {
            filteredImages = [...images];
        } else {
            filteredImages = images.filter(image => 
                image.tags.includes(selectedTag)
            );
        }
        
        renderFilteredImages();
    }
    
    function createGalleryItem(image, index) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.title;
        img.loading = 'lazy';
        
        const downloadOverlay = document.createElement('div');
        downloadOverlay.className = 'download-overlay';
        
        const title = document.createElement('p');
        title.textContent = image.title;
        
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'tags-container';
        image.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'tag';
            tagElement.textContent = tag;
            tagsContainer.appendChild(tagElement);
        });
        
        const downloadButton = document.createElement('button');
        downloadButton.innerHTML = '<i class="fas fa-download"></i>';
        downloadButton.addEventListener('click', (e) => {
            e.stopPropagation();
            downloadImageFromGallery(image.src, image.title);
        });
        
        downloadOverlay.appendChild(title);
        downloadOverlay.appendChild(tagsContainer);
        downloadOverlay.appendChild(downloadButton);
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(downloadOverlay);
        
        galleryItem.addEventListener('click', () => openLightbox(index));
        
        galleryGrid.appendChild(galleryItem);
    }
    
    function searchImages() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            filteredImages = [...images];
        } else {
            filteredImages = images.filter(image => 
                image.title.toLowerCase().includes(searchTerm) || 
                image.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }
        
        renderFilteredImages();
    }
    
    function renderFilteredImages() {
        galleryGrid.innerHTML = '';
        
        if (filteredImages.length === 0) {
            galleryGrid.innerHTML = '<p class="no-results">No images found matching your search.</p>';
            return;
        }
        
        filteredImages.forEach((image, index) => {
            createGalleryItem(image, index);
        });
    }
    
    function openLightbox(index) {
        currentImageIndex = parseInt(index);
        lightboxImage.src = filteredImages[currentImageIndex].src;
        lightboxImage.alt = filteredImages[currentImageIndex].title;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update lightbox info
        updateLightboxInfo();
    }
    
    function updateLightboxInfo() {
        const infoElement = document.getElementById('lightbox-info');
        if (infoElement) {
            const image = filteredImages[currentImageIndex];
            infoElement.innerHTML = `
                <h3>${image.title}</h3>
                <div class="lightbox-tags">
                    ${image.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <p>Image ${currentImageIndex + 1} of ${filteredImages.length}</p>
            `;
        }
    }
    
    function closeLightboxView() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
        lightboxImage.src = filteredImages[currentImageIndex].src;
        lightboxImage.alt = filteredImages[currentImageIndex].title;
        updateLightboxInfo();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
        lightboxImage.src = filteredImages[currentImageIndex].src;
        lightboxImage.alt = filteredImages[currentImageIndex].title;
        updateLightboxInfo();
    }
    
    function downloadImage() {
        const imageSrc = filteredImages[currentImageIndex].src;
        const imageTitle = filteredImages[currentImageIndex].title;
        downloadImageFromGallery(imageSrc, imageTitle);
    }
    
    function downloadImageFromGallery(src, title) {
        // Create a temporary canvas to handle cross-origin issues
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        // Add timestamp to bypass cache
        const timestamp = new Date().getTime();
        const url = src.includes('?') ? `${src}&timestamp=${timestamp}` : `${src}?timestamp=${timestamp}`;
        
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            try {
                canvas.toBlob(function(blob) {
                    const link = document.createElement('a');
                    const filename = generateFilename(title, src);
                    
                    link.href = URL.createObjectURL(blob);
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Clean up
                    setTimeout(() => URL.revokeObjectURL(link.href), 100);
                }, 'image/jpeg', 0.95);
            } catch (error) {
                console.error('Error creating blob:', error);
                fallbackDownload(src, title);
            }
        };
        
        img.onerror = function() {
            console.error('Error loading image for download');
            fallbackDownload(src, title);
        };
        
        img.src = url;
    }
    
    function fallbackDownload(src, title) {
        const link = document.createElement('a');
        link.href = src;
        link.download = generateFilename(title, src);
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    function generateFilename(title, src) {
        // Extract extension from src if available
        let extension = 'jpg';
        const match = src.match(/\.([a-zA-Z0-9]+)(?:[\?#]|$)/);
        if (match && match[1]) {
            extension = match[1].toLowerCase();
        }
        
        // Clean up the title for filename
        const cleanTitle = title.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')  // Replace special chars with hyphens
            .replace(/-+/g, '-')         // Replace multiple hyphens with single
            .replace(/^-|-$/g, '');      // Remove leading/trailing hyphens
        
        return `${cleanTitle || 'image'}.${extension}`;
    }
    
    // Reset session timer on user activity
    document.addEventListener('mousemove', resetSessionTimer);
    document.addEventListener('keypress', resetSessionTimer);
    document.addEventListener('click', resetSessionTimer);
});