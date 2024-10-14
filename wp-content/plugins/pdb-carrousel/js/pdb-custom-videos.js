document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("pdb-videos");
  const slider = document.createElement("div");
  slider.classList.add("swiper");
  slider.setAttribute("id", "carrousel-video");
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
  const loadingIcon = document.createElement("span");
  loadingIcon.classList.add("slider-loader");
  section.appendChild(loadingIcon);
  slider.appendChild(wrapper);

  const apiKey = "AIzaSyCskvM3LEYsU69UNBf99o5MBCsc2YLjkLo";

  function getYoutubeVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  // Init Slider
  function initSwiper(prevBtn, nextBtn) {
    if (document.querySelector(".swiper")) {
      const swiper = new Swiper(slider, {
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

      const videos = document.querySelectorAll(".slider-player");
      const mainEl = document.querySelector("main");
        videos.forEach((video) => {
          const player = new Plyr(video, {
            hideControls: false,
            controls: [
              'play', // Bouton de lecture
              'progress', // Barre de progression
              'current-time', // Affichage du temps actuel
              'mute', // Bouton de sourdine
              'volume', // Contrôle du volume
            ]
          });
          player.toggleControls(false);
          // Bouton Play
          const playerContainer = player.elements.container;
          const playerWrapper = player.elements.wrapper;
          const playBtnContainer = document.createElement("div");
          playBtnContainer.classList.add("play-btn-container");
          const playBtn = document.createElement("img");
          playBtn.classList.add("play-btn");
          playBtn.src = `${pluginUrl.url}images/play-btn.png`;
          // On ready
          player.on("ready" , () => {
            playBtnContainer.addEventListener("click", () => {
              player.play();
              playBtnContainer.style.display = "none";
            });
            playBtnContainer.addEventListener("mouseenter", () => {
              playBtn.style.transform = "scale(1.2)";
              playBtn.classList.add("play-blur");
            });
            playBtnContainer.addEventListener("mouseleave", () => {
              playBtn.style.transform = "scale(1)";
              playBtn.classList.remove("play-blur");
            });
            playBtnContainer.appendChild(playBtn);
            playerContainer.appendChild(playBtnContainer);
          });
          player.on('play', (event) => {
            mainEl.style.scrollSnapType = "none"; // Réglage du décalage scroll sur moz
            player.toggleControls(true);
            player.fullscreen.enter();
          });
          let firstClick = true;
          // Gestion du plein écran
          player.on('click', (event) => {
            // Sortie du plein ecran
            if (!firstClick & !event.target.closest('.plyr__controls')) {
                resetPlayer();
                setTimeout(() => {
                  mainEl.style.scrollSnapType = "y mandatory"; // Réglage du décalage scroll sur moz
                  playBtnContainer.style.display = "flex"; // rétablissement du bouton play 
                }, "1000");
            } else {
              firstClick = false;
            }
          });
          // Fonction pour réinitialiser le player
          function resetPlayer() {
            player.fullscreen.exit();
            // Obtenir la source actuelle (URL YouTube)
            const videoSource = player.source;
            // Réinitialiser en rechargeant la même vidéo
            player.elements.wrapper.style.opacity = "0";
            player.source = {
              type: 'video',
              sources: [
                {
                  src: videoSource, // Recharger la même source pour réinitialiser
                  provider: 'youtube'
                }
              ]
            };
          player.restart();
          player.toggleControls(false);
          firstClick = true;
          setTimeout(() => {
            playerContainer.style.opacity = "1";
          }, 3000)
        };
      });

      nextBtn.addEventListener("click", () => {
        swiper.slideNext();
      });

      prevBtn.addEventListener("click", () => {
        swiper.slidePrev();
      });
    }
  }

  // Récupération des vidéos avec WP API
  axios.get("https://piedebiche.fr/wp-json/wp/v2/slide_video")
    .then(response => {
      const videos = response.data;
      
      // Utilisation de Promise.all pour attendre toutes les requêtes fetch
      const videoPromises = videos.map((video) => {
        const videoId = getYoutubeVideoId(video._link);
        const slide = document.createElement("div");
        const player = document.createElement("div");
        slide.classList.add("swiper-slide");
        player.setAttribute("class", "slider-player");
        player.setAttribute("data-plyr-provider", "youtube");
        player.setAttribute("data-plyr-embed-id", videoId);
        slide.appendChild(player);
        wrapper.appendChild(slide);
      });

      // Attendre que toutes les vidéos soient traitées avant d'ajouter le slider
      Promise.all(videoPromises).then(() => {
        loadingIcon.remove();
        section.appendChild(arrowsContainer);
        section.appendChild(slider);
        initSwiper(prevBtn, nextBtn);
      });
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
});