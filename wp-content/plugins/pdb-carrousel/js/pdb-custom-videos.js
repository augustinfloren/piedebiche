function onYouTubeIframeAPIReady() {
  let regex = /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/; // Regex pour récupérer l'id youtube de la vidéo
  let videoContainers = document.querySelectorAll('.pdb-carrousel-video-container');

  videoContainers.forEach((container) => {
    let youtubeLink = container.getAttribute('data-yt-link');
    let match = youtubeLink.match(regex)
    let videoId = match[1];
    let itemContent = container.parentNode; // Récupération de la div parente de l'iframe "pdb-carrousel-item-content"
    let itemContainer = itemContent.parentNode; // Récupération de la div container "pdb-carrousel-item"

    container.setAttribute("loading", "lazy");

    // Construire l'URL de la vignette en utilisant l'ID de la vidéo
    let thumbnailUrl = 'https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg';

    let player = new YT.Player(container, {
      // height: '315',
      // width: '560',
      enableJsApi: 1,
      videoId: videoId, // ID de la vidéo YouTube
      playerVars: {
        'autoplay': 0,
        'controls': 1,
        'rel': 0,
        'showinfo': 0,
        'modestbranding': 1,
        'iv_load_policy': 3,
        'fs': 1,
        'disablekb': 1,
      }, 
        events: {
          'onReady': function(event) {
            onPlayerReady(event, itemContent, itemContainer, thumbnailUrl, videoId, container)
        }
      }     
    });
  });
}

function onPlayerReady(event, itemContent, itemContainer, thumbnailUrl, videoId, container) {
  // Création de la vignette pour contrôler sa largeur (pas d'insertion dans le dom)
  let thumbnailImg = document.createElement("img");
  thumbnailImg.setAttribute("src", thumbnailUrl);
  
  let thumbnail = document.createElement("div");
  
  let playBtn = document.createElement("div");
  playBtn.classList.add("pdb-video-play-btn");

  // Si la vignette fait 120 de largeur, c'est qu'il n'existe pas de vignette HD
  // Donc remplacer le lien de la vignette par la SD
  thumbnailImg.onload = function() {
    if (thumbnailImg.naturalWidth == 120) {
        thumbnailUrl = 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg';
    } 

    // Ajout du style et de l'url à la div contenant la vignette
    thumbnail.classList.add("pdb-carrousel-thumb-container");
    thumbnail.style.backgroundImage = `radial-gradient(transparent 10%, black 100%), url(${thumbnailUrl})`;
    thumbnail.style.width = "calc(" + itemContainer.style.width + " - 80px)"; // Calcul de la largeur en soustrayant les marges (40px de chaque côtés)
    
    playBtn.style.opacity = 1;
    itemContent.style.opacity = 1;
  };

  // Au survol sur la vignette
  thumbnail.addEventListener("mouseover", () => {
    playBtn.style.transform = 'scale(1.1)';
  })
  
  thumbnail.addEventListener("mouseout", () => {
    playBtn.style.transform = 'scale(1)';
  })

  thumbnail.addEventListener('click', () => {
    event.target.playVideo();
    // Cacher la vignette
    thumbnail.style.opacity = "0";
    setTimeout(() => {
      thumbnail.style.display = "none";
    }, 200);
  });

  // Au changement de vidéo, arrêt de la vidéo 
  let nextButton = document.querySelector("#pdb-carrousel-video .pdb-carrousel-next");
  let prevButton = document.querySelector("#pdb-carrousel-video .pdb-carrousel-prev");
  
  nextButton.addEventListener("click", stopVideo);
  prevButton.addEventListener("click", stopVideo);

  function stopVideo() {
    event.target.stopVideo();
    thumbnail.style.display = "flex";
    thumbnail.style.opacity = "1";
  }

  // Au changement de section, arrêt de la vidéo 
  let mainContainer = document.getElementById("pdb-container");
  mainContainer.addEventListener("scroll", stopVideo);

  thumbnail.appendChild(playBtn);
  itemContent.appendChild(thumbnail);
  
}

