document.addEventListener('DOMContentLoaded', function() {


    // ========== Activation onglets nav ========== //

    const menuLinks = document.querySelectorAll('#pdb-main-menu ul li a');
    
    const sectionsToWatch = document.querySelectorAll('.sections');

    let anySectionIntersecting = false;

    // Observation : si une section est visible au minimum à moitié, récupération du lien de la section et activation de l'onglet du menu.
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const section = entry.target;
            if (entry.isIntersecting) {
                anySectionIntersecting = true;
                const targetId = '#' + section.getAttribute('id');
                const correspondingLink = document.querySelector('a[href="' + targetId + '"]');
                if (!correspondingLink.classList.contains('active')) {
                    // Supprimer la classe active de tous les liens du menu
                    menuLinks.forEach(link => link.classList.remove('active'));
                    // Ajouter la classe active uniquement au lien du menu correspondant à la section visible
                    correspondingLink.classList.add('active');
                }
            } else {
                anySectionIntersecting = false;
            }
        });
        
        // Si aucune section n'est visible alors désactivation des liens
        if (!anySectionIntersecting) {
            menuLinks.forEach(link => link.classList.remove('active'));
        }
    }, {
        threshold: 0.8 // la moitié de la cible doit être visible
    });

    sectionsToWatch.forEach(section => {
        observer.observe(section)
    });

});