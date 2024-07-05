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

    // Tableau des pistes
    let tracksArray = [];

    // Numéro des pistes jouées dans la liste
    let trackCounter = 0;

    function buildElement(tag, className) {
        const element = document.createElement(tag);
        if (className) {
            element.classList.add(className);
        }
        return element;
    };

    // Formatage de la durée du pistes
    function buildDuration(duration) {
        let minutes = Math.floor(duration / 60);
        let seconds = Math.floor(duration % 60);
        seconds = String(seconds).padStart(2, "0"); // Si moins de deux caractères, ajoute un zéro à la place
        return minutes + ":" + seconds;
    };

    // ========== Initialisation du player ==========
    
    function updatePlayerDisplay() {
        // Masquer le player si aucune pistes
        if (tracksArray.length <= 0) {
            player.style.display = "none";
        } else {
            player.style.display = "grid";
        }

        // Changement des infos du player 
        playerBar.max = tracksArray[trackCounter].duration;
        playerTitle.textContent = tracksArray[trackCounter].title;
        playerAlbumTitle.textContent = tracksArray[trackCounter].albumTitle;
        playerTime.textContent = tracksArray[trackCounter].durationBuilded;
        currentAudio.src = tracksArray[trackCounter].src;

        // Désactivation backward btn si pas de piste avant
        if (trackCounter === 0) {
            backwardBtn.style.opacity = "0.5"; 
            backwardBtn.removeEventListener("click", backwardTrack);

        } else {
            backwardBtn.style.opacity = "initial"; 
            backwardBtn.addEventListener("click", backwardTrack); 
        }

        // Désactivation forward btn si pas de piste après
        if (trackCounter === tracksArray.length - 1) {
            forwardBtn.style.opacity = "0.5"; 
            forwardBtn.removeEventListener("click", forwardTrack); 
        } else {
            forwardBtn.style.opacity = "initial"; 
            forwardBtn.addEventListener("click", forwardTrack);
        }
    }

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
        audioMuted = true;
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
        audioMuted = false;
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
            // Si la playlist est finie, stopper la lecture et retourner sur la piste 1
            if (trackCounter >= tracksArray.length - 1) {
                trackCounter = 0;
                stopTrack();
                updatePlayerDisplay();
            // Sinon, jouer la piste suivante
            } else {
                trackCounter++;
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
        let totalHeight = playlist.scrollHeight;
        let visibleHeight = playlist.clientHeight;

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

            // ========== Récupération des pistes ==========

            async function loadTrackMetadata(track, index) {
                return new Promise((resolve) => {
                    let audio = new Audio(track.audio_file);
                    audio.preload = 'metadata';
                    audio.addEventListener("loadedmetadata", () => {
                        const durationBuilded = buildDuration(audio.duration);
                        const trackObj = {
                            title: track.track_title,
                            albumTitle: track.album_title,
                            src: track.audio_file,
                            duration: audio.duration,
                            durationBuilded: durationBuilded,
                        }
    
                        resolve({
                            index: index,
                            trackObj: trackObj,
                            audio: audio,
                            durationBuilded: durationBuilded,
                        });
                    });
                    audio.load();
                })
            }

            (async () => {
                const tracks = await Promise.all(pdbTracks.map((track, index) => loadTrackMetadata(track, index)));

                tracks.forEach(({ trackObj, audio, durationBuilded }, index) => {
                    tracksArray.push(trackObj);

                    let trackElem = buildElement("div", "pdb-track");
                    let titleContainer = buildElement("div", "pdb-track-title-container");
                    let title = buildElement("h6", "pdb-track-title");
                    let trackTime = buildElement("span", "pdb-track-time");
                    let albumTitle = buildElement("small", "pdb-track-album-title");

                    title.textContent = trackObj.title;
                    trackTime.textContent = durationBuilded;
                    albumTitle.textContent = trackObj.albumTitle;

                    titleContainer.appendChild(title);
                    titleContainer.appendChild(trackTime);
                    trackElem.appendChild(audio);
                    trackElem.appendChild(titleContainer);
                    trackElem.appendChild(albumTitle);
                    playlist.appendChild(trackElem);
                    
                    // Au clic sur une track de la liste du player
                    trackElem.addEventListener("click", () => {
                        trackCounter = index;
                        // Mise à jour player et lecture
                        updatePlayerDisplay();
                        playTrack();
                    });
                });

                updatePlayerDisplay();
            })();
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
});
