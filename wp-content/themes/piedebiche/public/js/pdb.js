document.addEventListener('DOMContentLoaded', function() {
    // ========== Activation onglets nav ========== //
    const menuLinks = document.querySelectorAll('#pdb-main-menu ul li a');
    const sectionsToWatch = document.querySelectorAll('.sections');
    let anySectionIntersecting = false;
    const container = document.querySelector('main'); 
    const proSection = document.getElementById("pdb-pro");

    let menuActivated = false;
    let timeoutId;

    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            if (link.innerText.trim().toLowerCase() === "pro") {
                proSection.style.display = "flex";
                proSection.addEventListener("click", () => {
                    proSection.style.display = "none";
                });
            };
            // Désactivation scroll mandatory
            e.preventDefault();
            container.style.scrollSnapType = 'none';
            const target = document.querySelector(link.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Si un timeout existe déjà, on l'annule
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            // Créer un nouveau timeout pour réactiver le scroll-snap
            timeoutId = setTimeout(() => {
                container.style.scrollSnapType = 'y mandatory';
            }, 1000); // Ajuster selon la durée du scroll
            
            // Fermeture menu responsive au clic sur un lien 
            if (window.matchMedia("(max-width: 1250px)").matches) {
                mobile_menu.classList.toggle('active');
                menu_btn.classList.toggle('active');
                overlay.style.display = "none";
                menuActivated = false;
            };
        });
    });

    // Récupération du lien de la section et activation de l'onglet du menu.
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const section = entry.target;
            if (entry.isIntersecting) {
                anySectionIntersecting = true;
                const targetId = '#' + section.getAttribute('id');
                const correspondingLink = document.querySelector('a[href="' + targetId + '"]');
                if (!correspondingLink.classList.contains('active')) {
                    // Ajouter la classe active uniquement au lien du menu correspondant à la section visible
                    correspondingLink.classList.add('active');
                }
            } else {
                anySectionIntersecting = false;
            }
        });
        
        // Si aucune section n'est visible alors désactivation des liens
        if (!anySectionIntersecting) {
            menuLinks.forEach(link => {
                link.classList.remove('active');
            });
        }
    }, {
        threshold: 0.8 // plus de la moitié de la cible doit être visible
    });

    sectionsToWatch.forEach(section => {
        observer.observe(section)
    });

    // ========== Menu responsive ========== //

    const menu_btn = document.getElementById("pdb-burger");
    const mobile_menu = document.querySelector("#pdb-main-menu ul");
    const overlay = document.getElementById("pdb-menu-overlay");

    menu_btn.addEventListener("click", () => {
        if (!menuActivated) {
            menu_btn.classList.add('active');
            mobile_menu.classList.add('active');
            menuActivated = true;
            overlay.style.display = "initial";
        } else {
            menu_btn.classList.remove('active');
            mobile_menu.classList.remove('active');
            overlay.style.display = "none";
            menuActivated = false;
        };
    });

    // ========== Aspect vidéo sur mobile ========== //

    const homeVideo = document.getElementById("pdb-video");

    function detectWindowSize() {
        if (window.innerWidth < 700) {
            homeVideo.classList.add("pdb-faded-image");
        } else if (window.innerWidth > 700) {
            homeVideo.classList.remove("pdb-faded-image");
        }
    }

    window.onload = detectWindowSize;

    window.addEventListener("resize", detectWindowSize);

    // ========== Fade in agenda concerts ========== //
    
    let agenda = document.getElementById("pdb-agenda");
    
    agenda.addEventListener("scroll", function() {

        let scrollPosition = agenda.scrollTop;

        var totalHeight = agenda.scrollHeight;
        var visibleHeight = agenda.clientHeight;

        if (scrollPosition > 0) {
            agenda.style.maskImage = "linear-gradient(to bottom, transparent 0%, rgb(0, 0, 0) 10%,  rgb(0, 0, 0) 70%, transparent 100%)";
        } else {
            agenda.style.maskImage = "linear-gradient(to bottom, rgb(0, 0, 0) 0%,  rgb(0, 0, 0) 70%, transparent 100%)";
        }

        if (scrollPosition + visibleHeight === totalHeight) {
            agenda.style.maskImage = "linear-gradient(to bottom, transparent 0%, rgb(0, 0, 0) 10%,  rgb(0, 0, 0) 100%)";
        }

    });
    
});