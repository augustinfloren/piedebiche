let carrousel = document.getElementById("pdb-carrousel-photo");
let photos = document.querySelectorAll("#pdb-carrousel-photo img");

photos.forEach((photo) => {
    photo.addEventListener("click", () => {
        // carrousel.classList.add("fullscreen-carrousel");
    })
})