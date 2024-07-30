document.addEventListener("DOMContentLoaded", onYouTubeIframeAPIReady);
function onYouTubeIframeAPIReady() {
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
  const loadingIcon = document.createElement("span");
  loadingIcon.classList.add("slider-loader");
  section.appendChild(loadingIcon);
  const mask = document.createElement("div");
  slider.appendChild(wrapper);

  const apiKey = "AIzaSyCskvM3LEYsU69UNBf99o5MBCsc2YLjkLo";

  // Récupération des vidéos avec WP API
  axios.get("http://localhost/piedebiche/wp-json/wp/v2/slide_video")
    .then(response => {
      const videos = response.data;
      
      // Utilisation de Promise.all pour attendre toutes les requêtes fetch
      const videoPromises = videos.map((video) => {
        const videoId = getYoutubeVideoId(video._link);
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.setAttribute("video-id", videoId);
        wrapper.appendChild(slide);

        return fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`)
          .then(response => response.json())
          .then(data => {
            const thumbnails = data.items[0].snippet.thumbnails;
            createThumbnail(getBestThumbnail(thumbnails), slide);
          })
          .catch(error => console.error('Error fetching video details:', error));
      });

      // Attendre que toutes les vidéos soient traitées avant d'ajouter le slider
      Promise.all(videoPromises).then(() => {
        loadingIcon.remove();
        section.appendChild(slider);
        section.appendChild(prevBtn);
        section.appendChild(nextBtn);
        initSwiper(prevBtn, nextBtn);
      });
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
}

function createThumbnail(url, slide) {
  const thumbContainer = document.createElement("div");
  thumbContainer.classList.add("thumbnail");
  thumbContainer.style.backgroundImage = `radial-gradient(transparent 10%, black 100%), url(${url})`;
  const playBtn = document.createElement("div");
  playBtn.classList.add("pdb-video-play-btn");
  thumbContainer.appendChild(playBtn);
  slide.appendChild(thumbContainer);
}

function getBestThumbnail(thumbnails) {
  const priorities = ['maxres', 'standard', 'high', 'medium', 'default'];
  const bestThumbnail = priorities.find(priority => thumbnails[priority]);
  return thumbnails[bestThumbnail].url;
}

function initSwiper(prevBtn, nextBtn) {
  if (document.querySelector(".swiper")) {
    const swiper = new Swiper("#carrousel-video", {
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

    function loadVideo(event) {
      const loadingIcon = document.createElement("div");
      loadingIcon.classList.add("video-loader");
      const activeSlide = swiper.slides[swiper.activeIndex];
      const activeThumb = activeSlide.querySelector(".thumbnail");
      activeThumb.removeEventListener("click", loadVideo);
      activeThumb.style.display = "none";
      const videoId = activeSlide.getAttribute("video-id");
      const videoEl = document.createElement("div");
      videoEl.classList.add("video-container");
      videoEl.appendChild(loadingIcon);
      activeSlide.appendChild(videoEl);

      setTimeout(() => {
        loadingIcon.remove();
        let player = new YT.Player(videoEl, {
          videoId: videoId,
          playerVars: {
            'modestbranding': 1,
            'rel': 0,
            'controls': 1, // Pour afficher les contrôles
            'autoplay': 1, // Pour démarrer automatiquement la lecture
            'showinfo': 0, // Non supporté, mais laissé pour compatibilité descendante
          },
          events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError,
          },
          origin: 'https://piedebiche.fr',
        });
  
        function onPlayerReady(event) {
          const iframe = document.querySelector("iframe");
          iframe.style.opacity = 1;
          event.target.unMute();
        } 

        function onPlayerError() {
          const errorMessage = document.createElement("h3");
          errorMessage.textContent = "Une erreur est survenue lors du chargement de la vidéo, merci de réessayer plus tard.";
          videoEl.appendChild(errorMessage);
        }
      }, 200);
    }

    function onSlideHover(event) {
      event.currentTarget.style.cursor = "pointer";
      const button = event.currentTarget.querySelector(".pdb-video-play-btn");
      button.style.transform = 'scale(1.1)';
    }

    function onSlideOut(event) {
      event.currentTarget.style.cursor = "initial";
      const button = event.currentTarget.querySelector(".pdb-video-play-btn");
      button.style.transform = 'scale(1)';
    }

    function handleFirstSlide() {
      const activeSlide = swiper.slides[swiper.activeIndex];
      const activeThumb = activeSlide.querySelector(".thumbnail");
      activeThumb.addEventListener("click", loadVideo);
      activeThumb.addEventListener("mouseover", onSlideHover);
      activeThumb.addEventListener("mouseout", onSlideOut);
    }

    function handleSlideChange() {
      if (swiper.slides[swiper.previousIndex]) {
        const previousSlide = swiper.slides[swiper.previousIndex];
        const thumbnail = previousSlide.querySelector(".thumbnail");
        const video = previousSlide.querySelector("iframe");
        if (video) {
          video.remove();
          thumbnail.style.display = "flex";
        }

        thumbnail.removeEventListener("click", loadVideo);
        thumbnail.removeEventListener("mouseover", onSlideHover);
        thumbnail.removeEventListener("mouseout", onSlideOut);
      }

      if (swiper.slides[swiper.activeIndex]) {
        const activeSlide = swiper.slides[swiper.activeIndex];
        const thumbnail = activeSlide.querySelector(".thumbnail");
        thumbnail.addEventListener("click", loadVideo);
        thumbnail.addEventListener("mouseover", onSlideHover);
        thumbnail.addEventListener("mouseout", onSlideOut);
      }
    }

    handleFirstSlide();
    swiper.on('slideChangeTransitionStart', handleSlideChange);

    nextBtn.addEventListener("click", () => {
      swiper.slideNext();
    });

    prevBtn.addEventListener("click", () => {
      swiper.slidePrev();
    });
  }
}

function getYoutubeVideoId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
