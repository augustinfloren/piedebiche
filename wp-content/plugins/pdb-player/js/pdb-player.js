document.addEventListener("DOMContentLoaded", function() {

    // Faire un compteur qui s'implémente ou se décrémente selon qu'on clique sur back ou fordward, si compteur sur 0 charger le premier morceau 
    // si compteur +1 charger deuxième morceau etc.
    // si compteur sur -1 ne rien charger 
    // fonctionnalité desactivée au dernier morceau 

    const pdbTracks = document.querySelectorAll(".pdb-track");

    const tracksArray = Array.from(pdbTracks); // Converti la NodeList en tableau
    
    let player = document.getElementById("pdb-player");
    let playerControlsContainer = document.getElementById("pdb-player-controls-container");
    let currentAudio = document.getElementById("pdb-player-audio");

    let playBtn = player.querySelector("#pdb-player-play-btn");
    let pauseBtn = player.querySelector("#pdb-player-pause-btn");
    let backwardBtn = player.querySelector("#pdb-player-backward-btn");
    let forwardBtn = player.querySelector("#pdb-player-forward-btn");

    let trackTime = player.querySelector("#pdb-player-time");
    let trackBar = player.querySelector("#pdb-player-time-bar");
    let elapsed = player.querySelector("#pdb-player-elapsed");
    let volumeBar = player.querySelector("#pdb-player-volume-bar");

    let tracksAudioSrc = [];
    
    let trackCounter = 0;

    pdbTracks.forEach((track) => {

        let audio = track.querySelector("audio");
        // let trackTime = track.querySelector(".pdb-track-time");
        // let trackBar = track.querySelector(".pdb-track-time-bar");
        // let elapsed = track.querySelector(".pdb-track-elapsed");
        // let volumeBar = track.querySelector(".pdb-track-volume-bar");
        
        function buildDuration(duration) {
            let minutes = Math.floor(duration / 60);
            let seconds = Math.floor(duration %60);
            seconds = String(seconds).padStart(2, "0"); // Si moins de deux caractères, ajoute un zéro à la place
            return minutes + ":" + seconds;
        }
        
        // Récupération et affichage de la durée d'un morceau 
        // Après le chargement des métadonnées
        audio.addEventListener('loadedmetadata', function() { 
            let duration = audio.duration;
            trackTime.textContent = buildDuration(duration);
            trackBar.max = duration;
        });
        
        tracksAudioSrc.push(audio.src);
            
        // Bouton play
        // playBtn.addEventListener("click", function() {
        //     audio.play();
            // audio.volume = volumeBar.value;
        //     pauseBtn.style.display = "initial";
        //     this.style.display = "none";
        // });
        
        // Bouton pause
        // pauseBtn.addEventListener("click", function() {
        //     audio.pause();
        //     playBtn.style.display = "initial";
        //     this.style.display = "none";
        // });

        // Bouton forward
        // forwardBtn.addEventListener("click", function() {
        // });
        
        // Temps écoulé
        // audio.addEventListener("timeupdate", function() {
        //     trackBar.value = this.currentTime;
        //     elapsed.textContent = buildDuration(this.currentTime);
        // });

        // Déplacement curseur de la time bar
        // trackBar.addEventListener("input", function() {
        //     elapsed.textContent = buildDuration(this.value);
        //     audio.currentTime = this.value;
        // });

        // Volume 
        // volumeBar.addEventListener("input", function() {
        //     audio.volume = this.value;
        // });

    });
    
    // Masquer le player si aucun morceau
    if (tracksAudioSrc.length <= 0) {
        player.style.display = "none";
    } else {
        currentAudio.src = tracksAudioSrc[trackCounter];
        backwardBtn.style.opacity = "0.5"; 
        backwardBtn.removeEventListener("click", backwardTrack); 
    }

    // Bouton forward
    function forwardTrack() {
        if (trackCounter < tracksAudioSrc.length - 1) {
            trackCounter++;
            currentAudio.src = tracksAudioSrc[trackCounter];
            backwardBtn.style.opacity = "initial"; 
            backwardBtn.addEventListener("click", backwardTrack); 

            currentAudio.play();
            pauseBtn.style.display = "initial";
            playBtn.style.display = "none";
        }
        if (trackCounter === tracksAudioSrc.length - 1) {
            forwardBtn.style.opacity = "0.5"; 
            forwardBtn.removeEventListener("click", forwardTrack); 
        }
    }

    // Bouton backward
    function backwardTrack() {
        if (trackCounter > 0) {
            trackCounter--;
            currentAudio.src = tracksAudioSrc[trackCounter];
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

});