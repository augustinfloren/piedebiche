<!-- ========== AGENDA CONCERTS ========== -->
    
<!-- Récupération posts concerts -->
<?php
$query = new WP_Query([
    'post_type' => 'pdb_concert',
    'posts_per_page' => 10, // Nombre de publications à afficher
]);

// Récupération champs
if ($query->have_posts()) {
    echo "<div id='pdb-agenda'>";
    while ($query->have_posts()) {
        $query->the_post();
        $date = get_field('date');
        $heure = get_field('heure');
        $salle = get_field('salle');
        $ville = get_field('ville');
        $pays = get_field('pays');
        $lien = get_field('lien');
        // Affichage du contenu
        echo "<div class='pdb-concert'> 
                <div class='pdb-schedule-container'>
                    <h6 class='pdb-concert-date'>$date</h6>
                    <h6 class='pdb-concert-schedule'>$heure</h6>
                </div>
                <div class='pdb-place-container'>
                    <h5 class='pdb-concert-hall'>$salle</h5>
                    <p class='pdb-concert-place'>$ville</p>
                </div>
                <a class='pdb-concert-link' href='" . esc_url($lien) . "'>Infos</a>
              </div>";
    }
    echo "</div>";
    // Réinitialiser les données de la requête
    wp_reset_postdata();
} else {
    echo 'Aucun concert prévu pour le moment.';
}