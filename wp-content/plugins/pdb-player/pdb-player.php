<?php
/*
Plugin Name: Player pdb
Description: Audio Player
Version: 0.1
Author: Augustin Floren
*/

add_action('add_meta_boxes', 'piedebiche_player_metaboxes');
add_action('init', 'piedebiche_player_init');
add_action('save_post', 'piedebiche_register_player_metaboxes', 10 ,2);

// ========== Paramètres Player administration ==========
function piedebiche_player_init() {

    $pdb_player_labels = array(
        'name' => 'Player',
        'singular_name' => 'Player',
        'add_new' => 'Ajouter un morceau',
        'add_new_item' => 'Ajouter un morceau',
        'edit_item' => 'Editer un morceau',
        'new_item'=> 'Nouveau morceau',
        'search_items' => 'Rechercher un morceau',
        'not_found' => 'Aucun morceau',
        'not_found_in_trash' => 'Aucun morceau dans la corbeille',
        'menu_name' => 'Player',
        'featured_image' => 'Morceau',
 	    'set_featured_image' => 'Ajouter un morceau',
 	    'remove_featured_image' => 'Supprimer ce morceau',
    );

    register_post_type('pdb_track', array(
        'public'=> true,
        'publicity_queryable' => false,
        'labels' => $pdb_player_labels,
        'menu_icon' => 'dashicons-format-audio',
        'capability_type' => 'post',
        'supports' => array('title'),
    ));
}

// ========== Metaboxes Player ==========
function piedebiche_player_metaboxes() {
    add_meta_box('piedebiche_player', 'Morceau', 'piedebiche_player_metabox', 'pdb_track', 'normal', 'high') ;
}

function piedebiche_player_metabox($object) {
    wp_nonce_field('piedebiche_player', 'piedebiche_player_nonce'); // Token pour éviter XSS
    ?>
    <div class="meta-box-item-content">
        <input type="text" id="piedebiche_audio_file" name="piedebiche_audio_file" value="<?php echo esc_attr(get_post_meta($object->ID, '_audio_file', true)); ?>">
        <button type="button" id="piedebiche_upload_audio_button" class="button">Sélectionner un fichier audio</button>
    </div>

    <script>
        jQuery(document).ready(function($){
            $('#piedebiche_upload_audio_button').click(function(e) {
                e.preventDefault();

                // Ouvrir la fenêtre de média de WordPress
                var custom_uploader = wp.media({
                    title: 'Sélectionner un fichier audio',
                    button: {
                        text: 'Utiliser ce fichier audio'
                    },
                    multiple: false // Seulement un fichier audio
                });

                // Quand un fichier audio est sélectionné, récupérer son URL et l'afficher dans le champ de texte
                custom_uploader.on('select', function() {
                    var attachment = custom_uploader.state().get('selection').first().toJSON();
                    $('#piedebiche_audio_file').val(attachment.url);
                });

                // Ouvrir la fenêtre de média
                custom_uploader.open();
            });
        });
    </script>
    <?php
}

function piedebiche_register_player_metaboxes($post_id, $post) {
    if (!isset($_POST['piedebiche_audio_file']) || !wp_verify_nonce($_POST['piedebiche_player_nonce'], 'piedebiche_player')) {
        return $post_id;
    }

    $type = get_post_type_object($post->post_type);
    if(current_user_can($type->cap->edit_post)) {
        return $post_id;
    }

    update_post_meta($post_id,'_audio_file', $_POST['piedebiche_audio_file']);
}

$pdb_tracks = array(); // Création du tableau contenant les morceaux

// ========== Affichage du Player ==========
function piedebiche_player_show($limit = 10) {

    wp_enqueue_script('pdb-player', plugins_url().'/pdb-player/js/pdb-player.js'); // Chargement JS
    include(plugin_dir_path(__FILE__) . 'pdb-player-template.php'); // Chargement HTML

    $tracks = new WP_Query(array(
        'post_type' => 'pdb_track',
        'posts_per_page' => $limit,
    )); 
    
    // Création d'un tableau d'objet avec contenant les morceaux 
    class AudioTrack { // Création d'une classe
        public $title;
        public $url;
        
        function __construct($prop1, $prop2) {
            $this->title = $prop1;
            $this->url = $prop2;
        }
    }


    while($tracks->have_posts()) { // Récupération des données des morceaux 
        $tracks->the_post();
        $track_title = get_the_title();
        $track_url = esc_url(get_post_meta(get_the_ID(), '_audio_file', true));
        
        $pdb_track = new AudioTrack($track_title, $track_url); // Création de l'objet 
        
        $pdb_tracks[] = $pdb_track; // Ajout de l'objet dans le tableau 
    }

    // Template HTML d'un morceau
    function generate_track($url) {
        ?>

        <div class="pdb-track">
            <div class="time-bar">
                <input type="range" class="pdb-track-bar" min="0" value="0">
                <span class="elapsed">0:00</span> <span class="track-time">1:00</span>
            </div> 
            <div>
                <audio src="<?= $url ?>"></audio>
                <img class="pdb-track-play-btn" src="<?= plugin_dir_url(__FILE__) . 'public/images/play-btn.png'?>" alt="play button">

                <img class="pdb-track-pause-btn" src="/public/images/pause-btn.png" alt="pause button">
            </div>
            <div class="volume-bar">
                <img src="/public/images/sound-btn.png" alt="volume button" class="volume-btn">
                <input type="range" class="track-volume" min="0" max="1" value ="1" step="0.1"> 
            </div>
        </div>
        
        <?php
    }
        
    // Générer les morceaux
    echo '<div id="pdb-player">';
    foreach ($pdb_tracks as $pdb_track) {
        generate_track($pdb_track->url);
    }
    echo '</div>';


    wp_localize_script('pdb-player', 'audio_tracks', $audio_tracks); // Envoie des données au fichier js

}