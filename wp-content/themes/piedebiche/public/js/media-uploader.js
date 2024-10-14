jQuery(document).ready(function($){
    var file_frame;

    $('.pdb-upload-file-button').on('click', function(e) {
        e.preventDefault();

        // Si la fenêtre est déjà ouverte, on la réutilise
        if (file_frame) {
            file_frame.open();
            return;
        }

        // Créer la fenêtre de la médiathèque
        file_frame = wp.media.frames.file_frame = wp.media({
            title: 'Choisir un fichier',
            button: {
                text: 'Choisir'
            },
            multiple: false
        });

        // Quand un fichier est sélectionné, on récupère l'URL et on la met dans le champ de texte
        file_frame.on('select', function() {
            var attachment = file_frame.state().get('selection').first().toJSON();
            $(e.target).prev('input').val(attachment.url);
        });

        // Ouvrir la fenêtre
        file_frame.open();
    });
});
