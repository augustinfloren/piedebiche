document.addEventListener('DOMContentLoaded', function() {
const section = document.getElementById("pdb-photos");
    const slider = document.createElement("div");
    slider.classList.add("swiper");
    slider.setAttribute("id", "carrousel-photo");
    const wrapper = document.createElement("div");
    wrapper.classList.add("swiper-wrapper");
    const prevBtn = document.createElement("div");
    prevBtn.classList.add("prev");
    const nextBtn = document.createElement("div");
    nextBtn.classList.add("next");
    section.appendChild(prevBtn);
    section.appendChild(nextBtn);
    slider.appendChild(wrapper);

    axios.get("http://localhost/piedebiche/wp-json/wp/v2/slide_photo")
        .then(response => { 
            const photos = response.data;
            photos.forEach((photo) => {
                const slide = document.createElement("div");
                slide.classList.add("swiper-slide");
                const imgContainer = document.createElement("div");
                imgContainer.classList.add("photo");
                imgContainer.style.backgroundImage = `url(${photo.featured_media_src_url})`;
                slide.appendChild(imgContainer);
                wrapper.appendChild(slide);
            });
            section.appendChild(slider);
            function initSwiper() {
                const swiper = new Swiper("#carrousel-photo", {
                    centeredSlides: true,
                    loop: true,
                    spaceBetween: 50,
                    slidesPerView: 1,
                    speed: 400,
                    navigation: false,
                    breakpoints: {
                        800: {
                        slidesPerView: 2.2,
                        }
                    }
                });

                function handleSlideChange() {
                    if (swiper.slides[swiper.previousIndex]) {
                        const previousSlide = swiper.slides[swiper.previousIndex];
                        const photo = previousSlide.querySelector(".photo");
                        photo.style.cursor = "initial";
                    }

                    if (swiper.slides[swiper.activeIndex]) {
                        const activeSlide = swiper.slides[swiper.activeIndex];
                        const photo = activeSlide.querySelector(".photo");
                        photo.style.cursor = "pointer";
                    }
                }

                function blowPhoto(event) {
                    const activeSlide = swiper.slides[swiper.activeIndex];
                    const photo = activeSlide.querySelector(".photo");
                }

                function handleFirstSlide() {
                    const activeSlide = swiper.slides[swiper.activeIndex];
                    const photo = activeSlide.querySelector(".photo");
                    photo.style.cursor = "pointer";
                    photo.addEventListener("click", blowPhoto);
                }

                nextBtn.addEventListener("click", () => {
                    swiper.slideNext();
                });
        
                prevBtn.addEventListener("click", () => {
                    swiper.slidePrev();
                });

                handleFirstSlide();
                swiper.on('slideChangeTransitionStart', handleSlideChange);
            }
            initSwiper();
        }) 
        .catch(error => {
            console.error('Erreur:', error);
        });

});