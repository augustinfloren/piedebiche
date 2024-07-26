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
    slider.appendChild(prevBtn);
    slider.appendChild(nextBtn);
    slider.appendChild(wrapper);

    axios.get("http://localhost/piedebiche/wp-json/wp/v2/slide_photo")
        .then(response => { 
            const photos = response.data;
            photos.forEach((photo) => {
                const slide = document.createElement("div");
                slide.classList.add("swiper-slide");
                const img = document.createElement("img");
                img.setAttribute("src", photo.featured_media_src_url);
                slide.appendChild(img);
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
                nextBtn.addEventListener("click", () => {
                    swiper.slideNext();
                });
        
                prevBtn.addEventListener("click", () => {
                swiper.slidePrev();
                });
            }
            initSwiper();
        }) 
        .catch(error => {
            console.error('Erreur:', error);
        });

});