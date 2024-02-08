<?php 
get_header();

// ========== CARROUSEL PHOTOS ==========

piedebiche_carrousel_photo_show();
piedebiche_carrousel_video_show();

// ========== AGENDA CONCERTS ==========

// Récupérer les publications de type 'concerts'
$query = new WP_Query([
    'post_type' => 'pdb_concert',
    'posts_per_page' => 10, // Nombre de publications à afficher
]);

// Vérifier si des publications ont été trouvées
if ($query->have_posts()) {
    while ($query->have_posts()) {
        $query->the_post();
        $Date = get_field('Date');
        // Afficher le contenu de la publication
        the_title('<h2>', '</h2>'); // Affiche le titre de la publication
        echo "<p>$Date</p>"; // Affiche la date
    }
    // Réinitialiser les données de la requête
    wp_reset_postdata();
} else {
    echo 'Aucun concert trouvé.';
}

get_footer(); 
