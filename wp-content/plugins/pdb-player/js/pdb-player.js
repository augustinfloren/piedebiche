document.addEventListener("DOMContentLoaded", function() {

    // Récupère les morceaux du plugin dans le dom
    const pdbTracks = document.querySelectorAll(".pdb-track");

    // const tracksArray = Array.from(pdbTracks); // Converti la NodeList en tableau
    
    // Récupère les elem du player du plugin dans le dom
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

    // Tableau des morceaux
    let tracksArray = [];

    // Compteur pour les fonctions forward et backward
    let trackCounter = 0;

    // Compteur pour vérifier que les metadonnées sont bein chargées
    let metadataLoadedCount = 0;

    // Formatage de la durée du morceau
    function buildDuration(duration) {
        let minutes = Math.floor(duration / 60);
        let seconds = Math.floor(duration %60);
        seconds = String(seconds).padStart(2, "0"); // Si moins de deux caractères, ajoute un zéro à la place
        return minutes + ":" + seconds;
    }

    pdbTracks.forEach((track) => {

        let audio = track.querySelector("audio");
        let duration;
        let trackObject = {};
        let trackTime = track.querySelector(".pdb-track-time");
        
        // Récupération et affichage de la durée d'un morceau Après le chargement des métadonnées
        audio.addEventListener('loadedmetadata', function() { 
            duration = audio.duration;
            trackObject.duration = duration;
            trackObject.durationBuilded = buildDuration(duration);
            metadataLoadedCount++; // Incrémente le compteur de métadonnées chargées

            // Vérifie si toutes les métadonnées sont chargées avant de mettre à jour l'affichage du lecteur
            if (metadataLoadedCount === pdbTracks.length) {
                updatePlayerDisplay();
            }

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

    });
    
    // Masquer le player si aucun morceau
    if (tracksArray.length <= 0) {
        player.style.display = "none";
    }

    // Etat initial du player
    function updatePlayerDisplay() {
        playerBar.max = tracksArray[trackCounter].duration;
        playerTitle.innerText = tracksArray[trackCounter].title;
        playerAlbumTitle.innerText = tracksArray[trackCounter].albumTitle;
        playerTime.innerText = tracksArray[trackCounter].durationBuilded;
        currentAudio.src = tracksArray[trackCounter].src;
    }

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

        // Bouton forward
        function forwardTrack() {
            if (trackCounter < tracksArray.length - 1) {
                trackCounter++;
                updatePlayerDisplay();
                backwardBtn.style.opacity = "initial"; 
                backwardBtn.addEventListener("click", backwardTrack); 

                currentAudio.play();
                pauseBtn.style.display = "initial";
                playBtn.style.display = "none";
            }
            if (trackCounter === tracksArray.length - 1) {
                forwardBtn.style.opacity = "0.5"; 
                forwardBtn.removeEventListener("click", forwardTrack); 
            }
        }

        // Bouton backward
        function backwardTrack() {
            if (trackCounter > 0) {
                trackCounter--;
                updatePlayerDisplay();
                forwardBtn.style.opacity = "initial"; 
                forwardBtn.addEventListener("click", forwardTrack); 

                currentAudio.play();
                pauseBtn.style.display = "initial";
                playBtn.style.display = "none";
            }
            if (trackCounter === 0) {
                backwardBtn.style.opacity = "0.5"; 
                backwardBtn.removeEventListener("click", backwardTrack);
            }
        }

        forwardBtn.addEventListener("click", forwardTrack);
        backwardBtn.addEventListener("click", backwardTrack);

        // Bouton play
        playBtn.addEventListener("click", () => {
            currentAudio.play();
            pauseBtn.style.display = "initial";
            playBtn.style.display = "none";
        })

        // Bouton pause
        pauseBtn.addEventListener("click", function() {
            currentAudio.pause();
            playBtn.style.display = "initial";
            this.style.display = "none";
        });

        // Volume 
        volumeBar.addEventListener("input", function() {
            currentAudio.volume = this.value;
        });

});