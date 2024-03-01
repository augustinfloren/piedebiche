document.addEventListener("DOMContentLoaded", function() {
    
    // Player
    const player = document.getElementById("pdb-player");
    const playerControlsContainer = document.getElementById("pdb-player-controls-container");
    const currentAudio = document.getElementById("pdb-player-audio");
    // Infos du player
    let playerTitle = document.querySelector("#pdb-player-title");
    let playerAlbumTitle = document.querySelector("#pdb-player-album-title");
    let playerTime = player.querySelector("#pdb-player-time");
    let playerBar = player.querySelector("#pdb-player-time-bar");
    let elapsedTime = player.querySelector("#pdb-player-elapsed");
    let volumeBar = player.querySelector("#pdb-player-volume-bar");
    // Contrôles du player
    const playBtn = player.querySelector("#pdb-player-play-btn");
    const pauseBtn = player.querySelector("#pdb-player-pause-btn");
    const backwardBtn = player.querySelector("#pdb-player-backward-btn");
    const forwardBtn = player.querySelector("#pdb-player-forward-btn");

    // Tracks
    const pdbTracks = document.querySelectorAll(".pdb-track");

    // Tableau des morceaux
    let tracksArray = [];

    // Compteur pour les fonctions forward et backward
    let trackCounter = 0;

    // Formatage de la durée du morceau
    function buildDuration(duration) {
        let minutes = Math.floor(duration / 60);
        let seconds = Math.floor(duration %60);
        seconds = String(seconds).padStart(2, "0"); // Si moins de deux caractères, ajoute un zéro à la place
        return minutes + ":" + seconds;
    }

    pdbTracks.forEach((track, index) => {

        let audio = track.querySelector("audio");
        let duration;
        let trackObject = {};
        let trackTime = track.querySelector(".pdb-track-time");
        
        // Récupération et affichage de la durée d'un morceau Après le chargement des métadonnées
        audio.addEventListener('loadedmetadata', function() { 
            duration = audio.duration;
            trackObject.duration = duration;
            trackObject.durationBuilded = buildDuration(duration);
            trackTime.innerText = buildDuration(duration);
            updatePlayerDisplay();
        });
        
        // Extraction des infos et de l'audio du morceau
        let titleElem = track.querySelector(".pdb-track-title");
        let albumTitleElem = track.querySelector(".pdb-track-album-title");
        
        // Suppression de potentiels espaces avant et après
        let title = titleElem.textContent.trim();
        let albumTitle = albumTitleElem.textContent.trim();

        // Ajouts des morceaux avec leurs infos dans le tableau
        trackObject.src = audio.src;
        trackObject.title = title;
        trackObject.albumTitle = albumTitle;
        tracksArray.push(trackObject);

        // Au clic sur une track de la liste du player
        track.addEventListener("click", () => {
            trackCounter = index;
            // Mise à jour player et lecture
            updatePlayerDisplay();
            playTrack();
        });

    });
    
    // Masquer le player si aucun morceau
    if (tracksArray.length <= 0) {
        player.style.display = "none";
    }

    // Initialisation du player
    function updatePlayerDisplay() {
        playerBar.max = tracksArray[trackCounter].duration;
        playerTitle.innerText = tracksArray[trackCounter].title;
        playerAlbumTitle.innerText = tracksArray[trackCounter].albumTitle;
        playerTime.innerText = tracksArray[trackCounter].durationBuilded;
        currentAudio.src = tracksArray[trackCounter].src;

        // backward btn
        if (trackCounter === 0) {
            backwardBtn.style.opacity = "0.5"; 
            backwardBtn.removeEventListener("click", backwardTrack);
        } else {
            backwardBtn.style.opacity = "initial"; 
            backwardBtn.addEventListener("click", backwardTrack); 
        }

        // forward btn
        if (trackCounter === tracksArray.length - 1) {
            forwardBtn.style.opacity = "0.5"; 
            forwardBtn.removeEventListener("click", forwardTrack); 
        } else {
            forwardBtn.style.opacity = "initial"; 
            forwardBtn.addEventListener("click", forwardTrack);
        }
    }
        
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
        this.style.display = "none";
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

    // Bouton Volume 
    volumeBar.addEventListener("input", function() {
        currentAudio.volume = this.value;
    });
    
    // Ajout des écouteurs sur les boutons
    forwardBtn.addEventListener("click", forwardTrack);
    backwardBtn.addEventListener("click", backwardTrack);
    playBtn.addEventListener("click", playTrack);
    pauseBtn.addEventListener("click", stopTrack);

    // Player Bar 
    // Temps écoulé
    currentAudio.addEventListener("timeupdate", function() {
        playerBar.value = this.currentTime;
        elapsedTime.textContent = buildDuration(this.currentTime);
    });

    // Déplacement curseur de la time bar
    playerBar.addEventListener("input", function() {
        currentAudio.currentTime = this.value;
        elapsedTime.textContent = buildDuration(this.value);
    });

});