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
// Enregistrement scripts ou styles
add_action('wp_enqueue_scripts', 'pdb_player_register_assets');

function pdb_player_register_assets () {
    // Enregistrement du style principal
    wp_enqueue_style('pdb-player-style', plugin_dir_url(__FILE__) . 'public/pdb-player-style.css');
    wp_enqueue_style('animate-css', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
    
    // Enregistrement du JS
    wp_enqueue_script('axios', 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js', array(), null, true);
    wp_register_script('pdb-player', plugin_dir_url(__FILE__) . 'js/pdb-player.js', array('jquery'), null, true); 
    wp_enqueue_script('pdb-player');
}

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
        'show_in_rest' => true,
    ));
}

// ========== Metaboxes Player ==========

function piedebiche_player_metaboxes() {
    // metabox titre
    add_meta_box('piedebiche_player_track_title', 'Titre', 'piedebiche_player_track_title_metabox', 'pdb_track', 'normal', 'high') ;
    // metabox ajout de morceau
    add_meta_box('piedebiche_player_track', 'Morceau', 'piedebiche_player_track_metabox', 'pdb_track', 'normal', 'high') ; 
    // metabox titre de l'album
    add_meta_box('piedebiche_player_album_title', 'Album', 'piedebiche_player_album_title_metabox', 'pdb_track', 'normal', 'high') ;
}

// Paramètres de la metabox Ajout de morceau 
function piedebiche_player_track_metabox($object) {
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

// Paramètres de la metabox Titre du morceau
function piedebiche_player_track_title_metabox($object) {
    $track_title = get_post_meta($object->ID, 'track_title', true);
    ?>
    <label for="track_title">Titre du morceau :</label>
    <input type="text" id="track_title" name="track_title" value="<?php echo esc_attr($track_title); ?>" />
    <?php
}

// Paramètres de la metabox Titre de l'album
function piedebiche_player_album_title_metabox($object) {
    $album_title = get_post_meta($object->ID, 'album_title', true);
    ?>
    <label for="album_title">Titre de l'album :</label>
    <input type="text" id="album_title" name="album_title" value="<?php echo esc_attr($album_title); ?>" />
    <?php
}

// Enregistrement des metaboxes
function piedebiche_register_player_metaboxes($post_id, $post) {
    // Vérifier le nonce pour éviter les attaques CSRF
    if (!isset($_POST['piedebiche_player_nonce']) || !wp_verify_nonce($_POST['piedebiche_player_nonce'], 'piedebiche_player')) {
        return $post_id;
    }

    // Vérifier les autorisations de l'utilisateur
    if (!current_user_can('edit_post', $post_id)) {
        return $post_id;
    }

    // Sauvegarde des données pour la metabox "Titre du morceau"
    if (isset($_POST['track_title'])) {
        update_post_meta($post_id, 'track_title', sanitize_text_field($_POST['track_title']));
    }

    // Sauvegarde des données pour la metabox "Morceau"
    if (isset($_POST['piedebiche_audio_file'])) {
        update_post_meta($post_id, '_audio_file', sanitize_text_field($_POST['piedebiche_audio_file']));
    }

    // Sauvegarde des données pour la metabox "Titre de l'album"
    if (isset($_POST['album_title'])) {
        update_post_meta($post_id, 'album_title', sanitize_text_field($_POST['album_title']));
    }
}

// Fonction pour ajouter le champ personnalisé à l'API REST
function piedebiche_register_fields() {
    register_rest_field('pdb_track', // Type de contenu auquel ajouter le champ (article dans ce cas)
        'audio_file', // Nom du champ à ajouter
        array(
            'get_callback' => 'piedebiche_get_audio_file_field', // Fonction de rappel pour récupérer la valeur du champ
            'update_callback' => null,
            'schema' => null,
        )
    );
    register_rest_field('pdb_track', // Ajouter également le champ album_title
        'track_title',
        array(
            'get_callback' => 'piedebiche_get_track_title_field',
            'update_callback' => null,
            'schema' => null,
        )
    );
    register_rest_field('pdb_track', // Ajouter également le champ album_title
        'album_title',
        array(
            'get_callback' => 'piedebiche_get_album_title_field',
            'update_callback' => null,
            'schema' => null,
        )
    );
}
add_action('rest_api_init', 'piedebiche_register_fields');

// Fonction de rappel pour récupérer la valeur du champ track_title
function piedebiche_get_track_title_field($object, $field_name, $request) {
    return get_post_meta($object['id'], 'track_title', true);
}

// Fonction de rappel pour récupérer la valeur du champ personnalisé
function piedebiche_get_audio_file_field($object, $field_name, $request) {
    return get_post_meta($object['id'], '_audio_file', true);
}

// Fonction de rappel pour récupérer la valeur du champ album_title
function piedebiche_get_album_title_field($object, $field_name, $request) {
    return get_post_meta($object['id'], 'album_title', true);
}

// ========== Affichage du Player ==========

$pdb_tracks = array(); // Création du tableau contenant les morceaux

function piedebiche_player_show($limit = 10) {

    $tracks = new WP_Query(array(
        'post_type' => 'pdb_track',
        'posts_per_page' => $limit,
    )); 
    
    // Création d'un tableau d'objet avec contenant les morceaux 
    class AudioTrack { // Création d'une classe
        public $title;
        public $url;
        public $album_title;
        
        function __construct($prop1, $prop2, $prop3) {
            $this->title = $prop1;
            $this->url = $prop2;
            $this->album_title = $prop3;
        }
    }

    while($tracks->have_posts()) { // Récupération des données des morceaux 
        $tracks->the_post();
        $track_title = get_the_title();
        $track_url = esc_url(get_post_meta(get_the_ID(), '_audio_file', true));
        $album_title = get_post_meta(get_the_ID(), 'album_title', true);
        
        $pdb_track = new AudioTrack($track_title, $track_url, $album_title); // Création de l'objet 
        
        $pdb_tracks[] = $pdb_track; // Ajout de l'objet dans le tableau 
    }

    function generate_player() {
        ?>

        <div id="pdb-player-controls-container">

            <audio id="pdb-player-audio" src="#"></audio>

            <h5 id="pdb-player-title"></h5>
            <p id="pdb-player-album-title"></p>

            <div id="pdb-player-time-bar-container">
                <div id="pdb-player-time-container">
                    <span id="pdb-player-elapsed">0:00</span> 
                    <span id="pdb-player-time">0:00</span>
                </div>
                <input type="range" id="pdb-player-time-bar" min="0" value="0">
            </div>

            <div id="pdb-player-controls">
                <div id="pdb-player-play-controls">
                    <img id="pdb-player-backward-btn" class="pdb-player-btn" src="<?= plugin_dir_url(__FILE__) . 'public/images/backward-btn.png'?>" alt="backward button">
                    <img id="pdb-player-play-btn" class="pdb-player-btn" src="<?= plugin_dir_url(__FILE__) . 'public/images/play-btn.png'?>" alt="play button">
                    <img id="pdb-player-pause-btn" class="pdb-player-btn" src="<?= plugin_dir_url(__FILE__) . 'public/images/pause-btn.png'?>" alt="pause button">
                    <img id="pdb-player-forward-btn" class="pdb-player-btn" src="<?= plugin_dir_url(__FILE__) . 'public/images/forward-btn.png'?>" alt="forward button">
                </div>
    
                <div id="pdb-player-volume">
                    <img src="<?= plugin_dir_url(__FILE__) . 'public/images/sound-btn.png'?>" alt="volume button" id="pdb-volume-btn" class=" pdb-player-btn">
                    <img src="<?= plugin_dir_url(__FILE__) . 'public/images/mute-btn.png'?>" alt="volume button" id="pdb-mute-btn" class=" pdb-player-btn">
                    <input type="range" id="pdb-player-volume-bar" min="0" max="1" value ="1" step="0.1"> 
                </div>
            </div>
        </div>

        <?php
    }
        
    echo '<div id="pdb-player">';
    generate_player();
    echo '<div id="pdb-track-container">';
    echo '</div>';
    echo '</div>';
}