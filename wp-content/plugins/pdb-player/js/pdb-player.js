document.addEventListener("DOMContentLoaded", function() {

    const pdbTracks = document.querySelectorAll(".pdb-track");

    pdbTracks.forEach((track) => {

        let audio = track.querySelector("audio");
        let trackTime = track.querySelector(".pdb-track-time");
        let trackBar = track.querySelector(".pdb-track-time-bar");
        let elapsed = track.querySelector(".pdb-track-elapsed");
        let playBtn = track.querySelector(".pdb-track-play-btn");
        let pauseBtn = track.querySelector(".pdb-track-pause-btn");
        let volumeBar = track.querySelector(".pdb-track-volume-bar");
        
        function buildDuration(duration) {
            let minutes = Math.floor(duration / 60);
            let seconds = Math.floor(duration %60);
            seconds = String(seconds).padStart(2, "0"); // Si moins de deux caractères, ajoute un zéro à la place
            return minutes + ":" + seconds;
        }

        // Récupération et affichage de la durée d'un morceau 
        audio.addEventListener('loadedmetadata', function() { // Après le chargement des métadonnées
            let duration = audio.duration;
            trackTime.textContent = buildDuration(duration);
            trackBar.max = duration;
        });
        
        // Bouton play
        playBtn.addEventListener("click", function() {
            audio.play();
            // audio.volume = volumeBar.value;
            pauseBtn.style.display = "initial";
            this.style.display = "none";
        });
        
        // Bouton pause
        pauseBtn.addEventListener("click", function() {
            audio.pause();
            playBtn.style.display = "initial";
            this.style.display = "none";
        });
        
        // Temps écoulé
        audio.addEventListener("timeupdate", function() {
            console.log(this.currentTime)
            console.log(audio.duration)
            trackBar.value = this.currentTime;
            elapsed.textContent = buildDuration(this.currentTime);
        });

        // Déplacement curseur de la time bar
        trackBar.addEventListener("input", function() {
            elapsed.textContent = buildDuration(this.value);
            audio.currentTime = this.value;
        });

        // Volume 
        volumeBar.addEventListener("input", function() {
            audio.volume = this.value;
        });

    });

});