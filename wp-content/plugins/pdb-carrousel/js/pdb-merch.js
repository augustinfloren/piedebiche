document.addEventListener('DOMContentLoaded', function() {
    const section = document.getElementById("pdb-merch");
    const slider = document.createElement("div");
    slider.classList.add("swiper");
    slider.classList.add("normal");
    slider.setAttribute("id", "carrousel-merch");
    const wrapper = document.createElement("div");
    wrapper.classList.add("swiper-wrapper");
    const prevBtn = document.createElement("div");
    prevBtn.classList.add("prev");
    const nextBtn = document.createElement("div");
    nextBtn.classList.add("next");
    const arrowsContainer = document.createElement("div");
    arrowsContainer.classList.add("arrows-container");
    arrowsContainer.appendChild(prevBtn);
    arrowsContainer.appendChild(nextBtn);
    arrowsContainer.style.visibility = "hidden";
    section.appendChild(arrowsContainer);
    slider.appendChild(wrapper);
    // Loader
    const loadingIcon = document.createElement("span");
    loadingIcon.classList.add("slider-loader");
    section.appendChild(loadingIcon);

    function initSwiper() {
        let swiper;
        swiper = new Swiper(slider, {
            centeredSlides: true,
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

    axios.get("https://piedebiche.fr/wp-json/wp/v2/slide_merch")
        .then(response => {
            const products = response.data;
            if (Array.isArray(products) && products.length > 0) {
                arrowsContainer.style.visibility = "visible";
            }
            
            const productsPromises  = products.map((product) => {
                const slide = document.createElement("div");
                slide.classList.add("swiper-slide");
                
                const productContainer = document.createElement("div");
                productContainer.classList.add("product");

                const imgContainer = document.createElement("div");
                const img = document.createElement("img");
                img.src = product.thumbnail || "chemin/vers/image-par-defaut.jpg";
                imgContainer.classList.add("product-img");
                imgContainer.appendChild(img);

                const infoContainer = document.createElement("div");

                const titleContainer = document.createElement("div");
                titleContainer.classList.add("title-container");

                const price = document.createElement("h6");
                price.classList.add("price");
                price.textContent = product._price ? `${product._price} €` : "Prix indisponible";

                const titleData = product.title.rendered;
                const decodedTitle = document.createElement('textarea');
                decodedTitle.innerHTML = titleData;
                const title = document.createElement("h5");
                title.textContent = decodedTitle.value;

                const btn = document.createElement("a");
                btn.textContent = "Acheter";
                btn.href = product._buy_link || "#";

                infoContainer.classList.add("product-infos");

                titleContainer.appendChild(title);
                infoContainer.appendChild(titleContainer);
                infoContainer.appendChild(price);
                infoContainer.appendChild(btn);
                productContainer.appendChild(imgContainer);
                productContainer.appendChild(infoContainer);
                slide.appendChild(productContainer);
                wrapper.appendChild(slide);
            });

            Promise.all(productsPromises).then(() => {
                loadingIcon.remove();
                section.appendChild(slider);
                initSwiper();
            });
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
});