document.addEventListener('DOMContentLoaded', function() {

    const menuLinks = document.querySelectorAll('#pdb-main-menu ul li a');
    
    // Changement état liens au défilement
    const sectionsToWatch = document.querySelectorAll('.sections');

    let anySectionIntersecting = false;

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
            }
        });

        if (!anySectionIntersecting) {
            menuLinks.forEach(link => link.classList.remove('active'));
        }
    }, {
        threshold: 0.5 // la moitié de la cible doit être visible
    });

    sectionsToWatch.forEach(section => {
        if (observer.observe(section)) {
            console.log('ok')
        }
    });

});