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
  // const overlay = document.createElement("div");
  // overlay.classList.add("overlay");
  // section.appendChild(overlay);
  slider.appendChild(prevBtn);
  slider.appendChild(nextBtn);
  slider.appendChild(wrapper);

  // Récupération des vidéos avec WP API
  axios.get("http://localhost/piedebiche/wp-json/wp/v2/slide_video")
    .then(response => {
        function getYoutubeVideoId(url) {
          const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
          const match = url.match(regex);
          return match ? match[1] : null;
        }
        const videos = response.data;

      videos.forEach((video, i) => {
        const videoId = getYoutubeVideoId(video._link);
        const apiKey = "AIzaSyCskvM3LEYsU69UNBf99o5MBCsc2YLjkLo";
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");
        slide.setAttribute("video-id", videoId);
        wrapper.appendChild(slide);

        function createThumbnail(url) {
          const thumbContainer = document.createElement("div");
          thumbContainer.classList.add("thumbnail");
          thumbContainer.style.backgroundImage = `radial-gradient(transparent 10%, black 100%), url(${url})`;
          const playBtn = document.createElement("div");
          playBtn.classList.add("pdb-video-play-btn");
          thumbContainer.appendChild(playBtn);
          slide.appendChild(thumbContainer);
        }

        function getBestThumbnail(thumbnails) {
          // Taille d'images possibles
          const priorities = ['maxres', 'standard', 'high', 'medium', 'default'];
          const bestThumbnail = priorities.find(priority => thumbnails[priority]);
          return thumbnails[bestThumbnail].url;
        }
        
        // API Youtube data
        fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`)
          .then(response => response.json())
          .then(data => {
              const thumbnails = data.items[0].snippet.thumbnails;
              createThumbnail(getBestThumbnail(thumbnails));
          })
          .catch(error => console.error('Error fetching video details:', error));
      });

      section.appendChild(slider);
      function initSwiper() {
        // if (document.querySelector(".swiper")) {
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
            // overlay.style.display = "block";
            // overlay.offsetHeight;
            // overlay.style.opacity = "1";
            // overlay.addEventListener("click", resetVideo);
            const thumbnail = event.currentTarget.querySelector(".thumbnail");
            thumbnail.style.display = "none";
            const videoId = event.currentTarget.getAttribute("video-id");
            const videoEl = document.createElement("div");
            event.currentTarget.appendChild(videoEl);

            let player = new YT.Player(videoEl, {
              videoId: videoId,
              events: {
                'onReady': onPlayerReady,
              },
              origin: 'http://localhost/piedebiche',
            });

            function onPlayerReady(event) {
              event.target.playVideo();
            } 
          }

          function onSlideHover(event) {
            const thumbnail = event.currentTarget.querySelector(".thumbnail");
            thumbnail.style.cursor = "pointer";
            const button = thumbnail.querySelector(".pdb-video-play-btn");
            button.style.transform = 'scale(1.1)';
          }

          function onSlideOut(event) {
            const thumbnail = event.currentTarget.querySelector(".thumbnail");
            thumbnail.style.cursor = "initial";
            const button = thumbnail.querySelector(".pdb-video-play-btn");
            button.style.transform = 'scale(1)';
          }

          function handleFirstSlide() {
            const activeSlide = swiper.slides[swiper.activeIndex];
            activeSlide.addEventListener("click", loadVideo);
            activeSlide.addEventListener("mouseover", onSlideHover);
            activeSlide.addEventListener("mouseout", onSlideOut);
          }
  
          function handleSlideChange() {
            // Traitement slide précédent
            if (swiper.slides[swiper.previousIndex]) {
              const previousSlide = swiper.slides[swiper.previousIndex];
              const thumbnail = previousSlide.querySelector(".thumbnail");
              const video = previousSlide.querySelector("iframe");
              if (video) {
                video.remove();
                thumbnail.style.display = "flex";
              }
              
              previousSlide.removeEventListener("click", loadVideo);
              previousSlide.removeEventListener("mouseover", onSlideHover);
              previousSlide.removeEventListener("mouseout", onSlideOut);
            }
  
            // Traitement slide actif
            if (swiper.slides[swiper.activeIndex]) {
              const activeSlide = swiper.slides[swiper.activeIndex];
              activeSlide.addEventListener("click", loadVideo);
              activeSlide.addEventListener("mouseover", onSlideHover);
              activeSlide.addEventListener("mouseout", onSlideOut);
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
        // }
      }
      initSwiper();
    }) 
    .catch(error => {
        console.error('Erreur:', error);
    });
};
