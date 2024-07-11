function onYouTubeIframeAPIReady() {
  const section = document.getElementById("pdb-videos");
  const slider = document.createElement("swiper-container");
  slider.style.width = "100vw";
  slider.setAttribute("id", "carrousel-video");
  let slidesCounter = 0;

  // Récupération des vidéos avec WP API
  axios.get("http://localhost/piedebiche/wp-json/wp/v2/slide_video")
    .then(response => {
        function getYoutubeVideoId(url) {
          const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
          const match = url.match(regex);
          return match ? match[1] : null;
        }
      
      const videos = response.data;

      videos.forEach((video) => {
        const iframe = document.createElement("div");
        const videoId = getYoutubeVideoId(video._link);
        const apiKey = "AIzaSyCskvM3LEYsU69UNBf99o5MBCsc2YLjkLo";
        const slide = document.createElement("swiper-slide");
        slide.appendChild(iframe);
        slider.appendChild(slide);

        function getBestThumbnail(thumbnails) {
          // Taille d'images possibles
          const priorities = ['maxres', 'standard', 'high', 'medium', 'default'];
          const bestThumbnail = priorities.find(priority => thumbnails[priority]);
          return thumbnails[bestThumbnail].url;
        }

        // Récupération des data des vidéos avec l'API Youtube data
        fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`)
          .then(response => response.json())
          .then(data => {
              const thumbnails = data.items[0].snippet.thumbnails;
              createThumbnail(getBestThumbnail(thumbnails));
          })
          .catch(error => console.error('Error fetching video details:', error));

        async function createThumbnail(url) {
          const thumbContainer = document.createElement("div");
          thumbContainer.classList.add("thumbnail");
          thumbContainer.style.backgroundImage = `radial-gradient(transparent 10%, black 100%), url(${url})`;
          slide.appendChild(thumbContainer);
        }

          player = new YT.Player(iframe, {
            height: '360',
            width: '640',
            videoId: videoId,
            events: {
              'onReady': onPlayerReady,
            },
            origin: 'http://localhost/piedebiche',
          });

        function onPlayerReady() {
        }

        slidesCounter ++;

        if (slidesCounter === videos.length) {
          section.appendChild(slider);
        }

      });
    }) 
    .catch(error => {
        console.error('Erreur:', error);
    });
};
