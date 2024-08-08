document.addEventListener('DOMContentLoaded', function() {
const section = document.getElementById("pdb-photos");
    const slider = document.createElement("div");
    slider.classList.add("swiper");
    slider.classList.add("normal");
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
    // Loader
    const loadingIcon = document.createElement("span");
    loadingIcon.classList.add("slider-loader");
    section.appendChild(loadingIcon);

    axios.get("https://piedebiche.fr/wp-json/wp/v2/slide_photo")
        .then(response => { 
            const photos = response.data;
            photos.forEach((photo) => {
                const slide = document.createElement("div");
                slide.classList.add("swiper-slide");
                slide.setAttribute("lazy", "true");
                const imgContainer = document.createElement("div");
                imgContainer.setAttribute("loading", "lazy");
                imgContainer.classList.add("photo");
                imgContainer.style.backgroundImage = `url(${photo.featured_media_src_url})`;
                slide.appendChild(imgContainer);
                wrapper.appendChild(slide);
            });
            loadingIcon.remove();
            section.appendChild(slider);
            function initSwiper() {
                let fsSwiper;
                let swiper;
                swiper = new Swiper("#carrousel-photo", {
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

                let fs = false;

                function handleFirstSlide(slider) {
                    const activeSlide = slider.slides[slider.activeIndex];
                    const activePhoto = activeSlide.querySelector(".photo");
                    activePhoto.style.cursor = "pointer";
                    activePhoto.addEventListener("click", enterFsMode);
                }

                function handleSlideChange(slider) {
                    if (slider.slides[slider.previousIndex]) {
                        const previousSlide = slider.slides[slider.previousIndex];
                        const previousPhoto = previousSlide.querySelector(".photo");
                        previousPhoto.style.cursor = "initial";
                        if (!fs) {
                            previousPhoto.removeEventListener("click", enterFsMode);
                        } else {
                            previousPhoto.removeEventListener("click", quitFsMode);
                        }
                    }

                    if (slider.slides[slider.activeIndex]) {
                        const activeSlide = slider.slides[slider.activeIndex];
                        const activePhoto = activeSlide.querySelector(".photo");
                        activePhoto.style.cursor = "pointer";
                        if (!fs) {
                            activePhoto.addEventListener("click", enterFsMode);
                        } else {
                            activePhoto.addEventListener("click", quitFsMode);
                        }
                    }
                }

                function enterFsMode(event) {
                    const currentIndex = swiper.realIndex;
                    swiper.destroy(true, true);
                    fsSwiper = new Swiper("#carrousel-photo", {
                        centeredSlides: true,
                        loop: true,
                        spaceBetween: 50,
                        slidesPerView: 1,
                        initialSlide: currentIndex,
                        speed: 400,
                        navigation: false,
                    });
                    nextBtn.addEventListener("click", () => {
                        fsSwiper.slideNext();
                    });
                    prevBtn.addEventListener("click", () => {
                        fsSwiper.slidePrev();
                    });

                    handleFirstSlide(fsSwiper);
                    fsSwiper.on('slideChangeTransitionStart', () => {
                        handleSlideChange(fsSwiper)
                    });
                    fs = true;
                    event.currentTarget.removeEventListener("click", enterFsMode);
                    event.currentTarget.addEventListener("click", quitFsMode);
                    const photos = document.querySelectorAll(".photo");
                    photos.forEach((photo) => {
                        photo.style.height = "100%";
                        photo.style.width = "100%";
                    });
                    const main = document.querySelector("main");
                    main.style.overflowY = "hidden";
                    const logo = document.getElementById("pdb-logo-container");
                    const burger = document.getElementById("pdb-burger");
                    burger.style.zIndex = "unset";
                    logo.style.zIndex = "unset";
                    slider.classList.remove("normal");
                    slider.classList.add("full-screen");
                }

                function quitFsMode(event) {
                    // swiper.params.breakpoints[800].slidesPerView = 2.2;
                    const currentIndex = fsSwiper.realIndex;
                    fsSwiper.destroy(true, true);
                    swiper = new Swiper("#carrousel-photo", {
                        centeredSlides: true,
                        loop: true,
                        spaceBetween: 50,
                        slidesPerView: 1,
                        initialSlide: currentIndex,
                        speed: 400,
                        navigation: false,
                        breakpoints: {
                            800: {
                            slidesPerView: 2.2,
                            }
                        }
                    });
                    nextBtn.addEventListener("click", () => {
                        swiper.slideNext();
                    });
                    prevBtn.addEventListener("click", () => {
                        swiper.slidePrev();
                    });
                    handleFirstSlide(swiper);
                    swiper.on('slideChangeTransitionStart', () => {
                        handleSlideChange(swiper)
                    });
                    fs = false;
                    event.currentTarget.removeEventListener("click", quitFsMode);
                    event.currentTarget.addEventListener("click", enterFsMode);
                    const photos = document.querySelectorAll(".photo");
                    photos.forEach((photo) => {
                        photo.style.height = "";
                        photo.style.width = "";
                    });
                    const main = document.querySelector("main");
                    main.style.overflowY = "";
                    const logo = document.getElementById("pdb-logo-container");
                    const burger = document.getElementById("pdb-burger");
                    burger.style.zIndex = "98";
                    logo.style.zIndex = "98";
                    slider.classList.remove("full-screen");
                    slider.classList.add("normal");
                }

                nextBtn.addEventListener("click", () => {
                    swiper.slideNext();
                });
        
                prevBtn.addEventListener("click", () => {
                    swiper.slidePrev();
                });

                handleFirstSlide(swiper);
                swiper.on('slideChangeTransitionStart', () => {
                    handleSlideChange(swiper)
                });
            }
            initSwiper();
        }) 
        .catch(error => {
            console.error('Erreur:', error);
        });

});