<!-- ========== AGENDA CONCERTS ========== -->

<!-- Récupération posts concerts -->
<?php
$query = new WP_Query([
    'post_type' => 'pdb_concert',
    'posts_per_page' => 10, // Nombre de publications à afficher
]);

// Récupération champs
if ($query->have_posts()) {
    ?>
    <div id='pdb-agenda'>
    <?php
    while ($query->have_posts()) {
        $query->the_post();
        $date = get_field('date');
        $heure = get_field('heure');
        $salle = get_field('salle');
        $ville = get_field('ville');
        $pays = get_field('pays');
        $lien = get_field('lien');

        // Conversion de la date au format timestamp
        $concert_date_timestamp = strtotime($date);
        $current_date_timestamp = time();

        // Vérification si la date du concert est dans le passé
        $is_past_concert = $concert_date_timestamp < $current_date_timestamp;

        // Ajout d'une classe CSS si le concert est passé
        $concert_class = $is_past_concert ? 'concert-passe' : '';

        // Affichage du contenu
        echo "<div class='pdb-concert $concert_class'> 
        <div class='pdb-schedule-container'>
            <h6 class='pdb-concert-date'>$date</h6>
            <h6 class='pdb-concert-schedule'>$heure</h6>
        </div>
        <div class='pdb-place-container'>
            <h5 class='pdb-concert-hall'>$salle</h5>
            <p class='pdb-concert-place'>$ville</p>
        </div>";

        // Conditionner la classe selon la présence du lien
        $link_class = !empty($lien) ? 'pdb-concert-link' : 'pdb-concert-link disabled';
        
        echo "<a class='$link_class' href='" . esc_url($lien) . "'>Infos</a>";

        echo "</div>";
    }
    // Réinitialiser les données de la requête
    wp_reset_postdata();
} else {
    echo 'Aucun concert prévu pour le moment.';
}
