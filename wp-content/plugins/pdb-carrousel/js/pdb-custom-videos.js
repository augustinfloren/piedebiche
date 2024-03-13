function onYouTubeIframeAPIReady() {
  let regex = /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/;
  let videoContainers = document.querySelectorAll('.pdb-carrousel-video-container');

  videoContainers.forEach(function(container) {
    let youtubeLink = container.getAttribute('data-yt-link');
    let match = youtubeLink.match(regex)
    let videoId = match[1];

    // Construire l'URL de la vignette en utilisant l'ID de la vidéo
    let thumbnailUrl = 'https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg';

    let player = new YT.Player(container, {
      // height: '315',
      // width: '560',
      videoId: videoId, // ID de la vidéo YouTube
      playerVars: {
        'autoplay': 0,
        'controls': 1,
        'rel': 0,
        'showinfo': 0,
        'modestbranding': 1,
        'iv_load_policy': 3,
        'fs': 0,
        'disablekb': 1
      }, 
        events: {
          'onReady': onPlayerReady(container, thumbnailUrl, videoId)
        }
    });
  });
}

function onPlayerReady(container, thumbnailUrl, videoId) {
  // Création de la vignette pour contrôler sa largeur
  let thumbnailImg = document.createElement("img");
  thumbnailImg.setAttribute("src", thumbnailUrl);
  
  // Récupération de item container
  let itemContainer = container.parentNode;
  let thumbnail = document.createElement("div");

  // Si la vignette fait 120 de largeur, c'est qu'il n'existe pas de vignette HD
  // Donc remplacer le lien de la vignette par la SD
  thumbnailImg.onload = function() {
    if (thumbnailImg.naturalWidth == 120) {
        thumbnailUrl = 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg';
    } 

    // Ajout du style et de l'url à la div contenant la vignette
    thumbnail.classList.add("pdb-carrousel-thumb-container");
    thumbnail.style.backgroundImage = `url(${thumbnailUrl})`;
    thumbnail.style.width = `${itemContainer.style.width}`;
  };

  itemContainer.appendChild(thumbnail);

}


