// Vista Cenit - Main Scripts
document.addEventListener('DOMContentLoaded', () => {
    // 1. Reveal animations on load
    const reveals = document.querySelectorAll('.fade-in');
    setTimeout(() => {
        reveals.forEach((element) => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }, 100);

    // 2. Hero Background Carousel Logic (index.html)
    const heroSliderImgs = document.querySelectorAll('#hero-slider .hero-img');
    if (heroSliderImgs.length > 1) {
        let currentHeroIndex = 0;

        setInterval(() => {
            // Remove active class from current
            heroSliderImgs[currentHeroIndex].classList.remove('active');

            // Move to next image
            currentHeroIndex = (currentHeroIndex + 1) % heroSliderImgs.length;

            // Add active class to new
            heroSliderImgs[currentHeroIndex].classList.add('active');
        }, 5000); // 5 seconds interval
    }

    // 3. Lightbox functionality for Series page (global across all galleries)
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');

    const gptMap = {
        "DJI_0382.JPG": "0382.png",
        "DJI_0383.JPG": "0383.png",
        "DJI_0453.JPG": "0453.png",
        "DJI_0455.JPG": "0455.png",
        "DJI_0472.JPG": "0472.png",
        "DJI_0503.JPG": "0503.png",
        "DJI_0506.JPG": "0506 centrado.png",
        "DJI_0522.JPG": "0522.png",
        "DJI_0541.JPG": "0541.png",
        "DJI_0464.JPG": "0464.png",
        "DJI_0466.JPG": "0466.png",
        "DJI_0615.JPG": "0615.png",
        "DJI_0634.JPG": "0634.png",
        "DJI_0409.JPG": "0409.png",
        "DJI_0414.JPG": "0414.png",
        "IMG_8626.JPG": "8626.jpg"
    };

    if (galleryItems.length > 0 && lightbox) {
        const lightboxContainer = document.getElementById('lightbox-scroll-container');
        const lightboxDots = document.getElementById('lightbox-dots');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');

        let currentIndex = 0;
        // Collect all image sources from all sections
        const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

        // Open Lightbox
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                updateLightboxContent();
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });

        // Close Lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeLightbox);

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content') || e.target.classList.contains('lightbox-scroll-item')) {
                closeLightbox();
            }
        });

        // Navigation
        const navigateLightbox = (direction) => {
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % images.length;
            } else {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
            }
            updateLightboxContent();
        };

        nextBtn.addEventListener('click', () => navigateLightbox('next'));
        prevBtn.addEventListener('click', () => navigateLightbox('prev'));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigateLightbox('next');
            if (e.key === 'ArrowLeft') navigateLightbox('prev');
        });

        function updateLightboxContent() {
            // Add a small fade effect when changing items inside lightbox
            lightboxContainer.style.opacity = 0;

            setTimeout(() => {
                lightboxContainer.innerHTML = '';
                lightboxDots.innerHTML = '';

                const imgSrc = images[currentIndex];
                // Extract filename
                const filenameMatch = imgSrc.match(/\/([^\/]+\.(?:jpg|JPG|jpeg|png))$/);
                const filename = filenameMatch ? filenameMatch[1] : '';

                let slides = [imgSrc];
                if (filename && gptMap[filename]) {
                    slides.push("../gpt/" + gptMap[filename]);
                }

                slides.forEach((src, idx) => {
                    // Create scroll item
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'lightbox-scroll-item';
                    const img = document.createElement('img');
                    img.className = 'lightbox-img';
                    img.src = src;
                    img.alt = `Vista ${idx + 1}`;
                    itemDiv.appendChild(img);
                    lightboxContainer.appendChild(itemDiv);

                    // Create thumb if more than one slide
                    if (slides.length > 1) {
                        const thumb = document.createElement('div');
                        thumb.className = `lightbox-thumb ${idx === 0 ? 'active' : ''}`;

                        const thumbImg = document.createElement('img');
                        thumbImg.src = src;
                        thumbImg.alt = `Miniatura ${idx + 1}`;
                        thumb.appendChild(thumbImg);

                        thumb.addEventListener('click', () => {
                            lightboxContainer.scrollTo({
                                left: idx * lightboxContainer.clientWidth,
                                behavior: 'smooth'
                            });
                        });
                        lightboxDots.appendChild(thumb);
                    }
                });

                // Scroll listener to update dots
                if (slides.length > 1) {
                    lightboxContainer.onscroll = () => {
                        const scrollIndex = Math.round(lightboxContainer.scrollLeft / lightboxContainer.clientWidth);
                        Array.from(lightboxDots.children).forEach((dot, idx) => {
                            dot.classList.toggle('active', idx === scrollIndex);
                        });
                    };
                }

                // Reset scroll to 0
                lightboxContainer.scrollLeft = 0;
                lightboxContainer.style.opacity = 1;
            }, 150);
        }

        lightboxContainer.style.transition = "opacity 0.2s ease";
    }
});
