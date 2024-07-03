document.addEventListener("DOMContentLoaded", function() {
    
    // Player
    const player = document.getElementById("pdb-player");
    const playerControlsContainer = document.getElementById("pdb-player-controls-container");
    const currentAudio = document.getElementById("pdb-player-audio");
    // Infos du player
    let playerTitle = player.querySelector("#pdb-player-title");
    let playerAlbumTitle = player.querySelector("#pdb-player-album-title");
    let playerTime = player.querySelector("#pdb-player-time");
    let playerBar = player.querySelector("#pdb-player-time-bar");
    let elapsedTime = player.querySelector("#pdb-player-elapsed");
    let volumeBar = player.querySelector("#pdb-player-volume-bar");
    let volumeBtn = player.querySelector("#pdb-volume-btn");
    let muteBtn = player.querySelector("#pdb-mute-btn");
    let playlist = document.querySelector("#pdb-track-container");
    // Contrôles du player
    const playBtn = player.querySelector("#pdb-player-play-btn");
    const pauseBtn = player.querySelector("#pdb-player-pause-btn");
    const backwardBtn = player.querySelector("#pdb-player-backward-btn");
    const forwardBtn = player.querySelector("#pdb-player-forward-btn");

    function buildElement(tag, className) {
        const element = document.createElement(tag);
        element.classList.add(className);
        return element;
    };

    // Formatage de la durée du pistes
    function buildDuration(duration) {
        let minutes = Math.floor(duration / 60);
        let seconds = Math.floor(duration %60);
        seconds = String(seconds).padStart(2, "0"); // Si moins de deux caractères, ajoute un zéro à la place
        return minutes + ":" + seconds;
    };

    // ========== Initialisation du player ==========
    
    // Masquer le player si aucune pistes
    // if (tracksArray.length <= 0) {
    //     player.style.display = "none";
    // }

    // function updatePlayerDisplay() {
    //     // Changement des infos du player 
    //     playerBar.max = tracksArray[trackCounter].duration;
    //     playerTitle.innerText = tracksArray[trackCounter].title;
    //     playerAlbumTitle.innerText = tracksArray[trackCounter].albumTitle;
    //     playerTime.innerText = tracksArray[trackCounter].durationBuilded;
    //     currentAudio.src = tracksArray[trackCounter].src;

    //     // Désactivation backward btn si pas de piste avant
    //     if (trackCounter === 0) {
    //         backwardBtn.style.opacity = "0.5"; 
    //         backwardBtn.removeEventListener("click", backwardTrack);

    //     } else {
    //         backwardBtn.style.opacity = "initial"; 
    //         backwardBtn.addEventListener("click", backwardTrack); 
    //     }

    //     // Désactivation forward btn si pas de piste après
    //     if (trackCounter === tracksArray.length - 1) {
    //         forwardBtn.style.opacity = "0.5"; 
    //         forwardBtn.removeEventListener("click", forwardTrack); 
    //     } else {
    //         forwardBtn.style.opacity = "initial"; 
    //         forwardBtn.addEventListener("click", forwardTrack);
    //     }
    // }

    // ========== Contrôles lecture ==========
        
    // Bouton play
    function playTrack() {
        currentAudio.play();
        pauseBtn.style.display = "initial";
        playBtn.style.display = "none";
    }

    // Bouton pause
    function stopTrack() {
        currentAudio.pause();
        playBtn.style.display = "initial";
        pauseBtn.style.display = "none";
    }

    // Bouton forward
    function forwardTrack() {
        if (trackCounter < tracksArray.length - 1) {
            trackCounter++;
            updatePlayerDisplay();
            playTrack();
        }
    }

    // Bouton backward
    function backwardTrack() {
        if (trackCounter > 0) {
            trackCounter--;
            updatePlayerDisplay();
            playTrack();
        }
    }

    // Ajout des écouteurs sur les boutons
    forwardBtn.addEventListener("click", forwardTrack);
    backwardBtn.addEventListener("click", backwardTrack);
    playBtn.addEventListener("click", playTrack);
    pauseBtn.addEventListener("click", stopTrack);

    // ========== Volume ==========

    // Bouton Volume 
    let inputValue;
    let inputVolume = 100;
    let audioMuted = false;

    function muteAudio() {
        audioMuted === true;
        volumeBtn.style.display = "none";
        muteBtn.style.display = "initial";
        currentAudio.volume = 0;
    }

    volumeBar.style.background = `linear-gradient(to right, var(--mint-white) 100%, var(--dark-grey) 100%)`;

    volumeBar.addEventListener("input", function() {
        volumeBtn.style.display = "initial";
        muteBtn.style.display = "none";
        inputValue = this.value;
        currentAudio.volume = this.value;
        inputVolume = this.value / Math.round(volumeBar.max) * 100;
        volumeBar.style.background = `linear-gradient(to right, var(--mint-white) ${inputVolume}%, var(--dark-grey) ${inputVolume}%)`;

        if(inputVolume === 0) {
            muteAudio();
        }
    });

    volumeBtn.addEventListener("click", () => {
        if (audioMuted === false ) {
            volumeBar.style.background = `var(--dark-grey)`
            muteAudio();
        } else {
            volumeBar.style.background = `linear-gradient(to right, var(--mint-white) ${inputVolume}%, var(--grey) ${inputVolume}%)`
            volumeBtn.style.display = "initial";
            muteBtn.style.display = "none";
        }
    });

    muteBtn.addEventListener("click", () => {
        audioMuted === false;
        if (inputVolume === 0) {
            currentAudio.volume = 1.0;
            inputVolume = 100;
        } else {
            currentAudio.volume = inputValue;
        };
        volumeBar.style.background = `linear-gradient(to right, var(--mint-white) ${inputVolume}%, var(--dark-grey) ${inputVolume}%)`
        volumeBtn.style.display = "initial";
        muteBtn.style.display = "none";
    });

    // ========== Barre de lecture ==========

    // Temps écoulé
    currentAudio.addEventListener("timeupdate", function() {
        playerBar.value = this.currentTime;
        elapsedTime.textContent = buildDuration(this.currentTime);

        // Création de la barre de progression avec un dégradé appliqué au curseur de l'input range
        const progress = (this.currentTime / Math.round(playerBar.max)) * 100;
        playerBar.style.background = `linear-gradient(to right, var(--mint-white) ${progress}%, var(--dark-grey) ${progress}%)`;

        // Quand la barre de progression arrive au bout de la piste
        if (this.currentTime >= playerBar.max) {
            // Si la playlist et finie, stopper la lecture et retourner sur la piste 1
            if (trackCounter >= tracksArray.length - 1) {
                trackCounter = 0;
                stopTrack();
                updatePlayerDisplay();
            // Sinon, jouer la piste suivante
            } else {
                trackCounter ++;
                updatePlayerDisplay();
                playTrack();
            }
        }
    });

    // Déplacement curseur de la time bar
    playerBar.addEventListener("input", function() {
        currentAudio.currentTime = this.value;
        elapsedTime.textContent = buildDuration(this.value);
    });

    // ========== Fade in tracks ==========
    
    playlist.addEventListener("scroll", function() {

        let scrollPosition = playlist.scrollTop;

        var totalHeight = playlist.scrollHeight;
        var visibleHeight = playlist.clientHeight;

        if (scrollPosition > 0) {
            playlist.style.maskImage = "linear-gradient(to bottom, transparent 0%, rgb(0, 0, 0) 10%,  rgb(0, 0, 0) 70%, transparent 100%)";
        } else {
            playlist.style.maskImage = "linear-gradient(to bottom, rgb(0, 0, 0) 0%,  rgb(0, 0, 0) 70%, transparent 100%)";
        }

        if (scrollPosition + visibleHeight === totalHeight) {
            playlist.style.maskImage = "linear-gradient(to bottom, transparent 0%, rgb(0, 0, 0) 10%,  rgb(0, 0, 0) 100%)";
        }

    });

    axios.get('http://localhost/piedebiche/wp-json/wp/v2/pdb_track')
        .then(response => {
            const pdbTracks = response.data;

            // Ajout d'un padding entre la playlist et la barre de scroll
            if (pdbTracks.length >= 3) {
                playlist.style.paddingRight = "0.7rem";
            } else {
                playlist.style.paddingRight = "0rem";
            }

            // Tableau des pistes
            let tracksArray = [];

            // Numéro des pistes jouées dans la liste
            let trackCounter = 0;

            // ========== Récupération des pistes ==========

            pdbTracks.forEach((track, index) => {
                console.log(track)
                let trackElem = buildElement("div", "pdb-track");
                let audio = new Audio(track.link);
                audio.preload = 'metadata';
                let titleContainer = buildElement("div", "title-container");
                let title = buildElement("h6");
                let trackTime = buildElement("span", "pdb-track-time");
                let albumTitle = buildElement("small", "pdb-track-album-title");

                titleContainer.appendChild(title);
                titleContainer.appendChild(trackTime);
                trackElem.appendChild(audio);
                trackElem.appendChild(albumTitle);
                trackElem.appendChild(titleContainer);
                playlist.appendChild(trackElem);

                console.log(audio)
                
            // Récupération et affichage de la durée d'une piste Après le chargement des métadonnées
            audio.addEventListener('error', function(e) {
                console.log(audio.duration)
                console.error("Erreur lors du chargement de l'audio", e);
                if (audio.error) {
                    switch (audio.error.code) {
                        case audio.error.MEDIA_ERR_ABORTED:
                            console.error("Le téléchargement de l'audio a été interrompu.");
                            break;
                        case audio.error.MEDIA_ERR_NETWORK:
                            console.error("Une erreur réseau a empêché le téléchargement de l'audio.");
                            break;
                        case audio.error.MEDIA_ERR_DECODE:
                            console.error("L'audio est corrompu ou utilise un format non supporté.");
                            break;
                        case audio.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                            console.error("Le format de l'audio n'est pas supporté ou l'URL est incorrecte.");
                            break;
                        default:
                            console.error("Une erreur inconnue est survenue.");
                            break;
                    }
                }
            });

                audio.load();
            // Ajouts des pistes avec leurs infos dans le tableau
                // trackObject.src = track.link;
                // trackObject.title = title;
                // trackObject.albumTitle = albumTitle;
                // tracksArray.push(trackObject);

            //     // Au clic sur une track de la liste du player
            //     track.addEventListener("click", () => {
            //         trackCounter = index;
            //         // Mise à jour player et lecture
            //         updatePlayerDisplay();
            //         playTrack();
            //     });

            });
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    
});