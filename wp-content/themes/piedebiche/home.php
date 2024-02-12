<?php 
get_header();

piedebiche_player_show();
piedebiche_carrousel_photo_show();
piedebiche_carrousel_video_show();


// ========== AGENDA CONCERTS ==========

// Récupération posts concerts
$query = new WP_Query([
    'post_type' => 'pdb_concert',
    'posts_per_page' => 10, // Nombre de publications à afficher
]);

// Récupération champs
if ($query->have_posts()) {
    while ($query->have_posts()) {
        $query->the_post();
        $date = get_field('date');
        $heure = get_field('heure');
        $salle = get_field('salle');
        $ville = get_field('ville');
        $pays = get_field('pays');
        $lien = get_field('lien');
        // Affichage du contenu
        echo "<div> 
                <h3>$date</h3>
                <h3>$heure</h3>
                <h3>$salle</h3>
                <h3>$pays</h3>
                <a href='" . esc_url($lien) . "'>Infos</a>
              </div>";
    }
    // Réinitialiser les données de la requête
    wp_reset_postdata();
} else {
    echo 'Aucun concert trouvé.';
}

get_footer(); 
