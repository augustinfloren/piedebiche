<?php
/*
Plugin Name: Carrousel pdb
Description: Slider homepage
Version: 0.1
Author: Augustin Floren
*/

add_action("init","piedebiche_carrousels_init");
add_action("add_meta_boxes","piedebiche_carrousel_metaboxes");
add_action("save_post","piedebiche_carrousel_savepost", 10, 2);
add_action("add_meta_boxes","piedebiche_carrousel_metaboxes_photo");
add_action("do_meta_boxes", "piedebiche_event_metaboxes_photo");
add_action('manage_edit-slide_photo_columns', 'piedebiche_carrousel_columnfilter');
add_action('manage_posts_custom_column', 'piedebiche_carrousel_column');
add_action('wp_enqueue_scripts', 'pdb_carrousel_register_assets');

function pdb_carrousel_register_assets () {

    // Charger l'API YouTube Player
    wp_enqueue_script( 'youtube-iframe-api', 'https://www.youtube.com/iframe_api');
    wp_enqueue_script('pdb-carrousel', plugins_url().'/pdb-carrousel/js/pdb-carrousel.js'); // Chargement JS
    wp_enqueue_style('pdb-carrousel-style', plugins_url().'/pdb-carrousel/css/pdb-carrousel-style.css'); // Chargement CSS
    wp_enqueue_script('pdb-custom-videos', plugins_url().'/pdb-carrousel/js/pdb-custom-videos.js'); // Chargement JS 

}
 
// ========== Paramètres carrousels photo et video administration ==========

function piedebiche_carrousels_init() {

    $photo_labels = array(
        'name' => 'Carrousel photo',
        'singular_name' => 'Carrousel photo',
        'add_new' => 'Ajouter une photo',
        'add_new_item' => 'Ajouter une photo',
        'edit_item' => 'Editer une photo',
        'new_item'=> 'Nouvelle photo',
        'search_items' => 'Rechercher une photo',
        'not_found' => 'Aucune photo',
        'not_found_in_trash' => 'Aucune photo dans la corbeille',
        'menu_name' => 'Carrousel photo',
        'featured_image' => 'Photo',
 	    'set_featured_image' => 'Ajouter une photo',
 	    'remove_featured_image' => 'Supprimer cette photo',
    );

    register_post_type('slide_photo', array(
        'public'=> true,
        'publicity_queryable' => false,
        'labels' => $photo_labels,
        'menu_icon' => 'dashicons-format-gallery',
        'capability_type' => 'post',
        'supports' => array('title', 'thumbnail'),
    ));

    add_image_size('slider', 0, 0, true);

    $video_labels = array(
        'name' => 'Carrousel vidéo',
        'singular_name' => 'Carrousel vidéo',
        'add_new' => 'Ajouter une video',
        'add_new_item' => 'Ajouter une vidéo',
        'edit_item' => 'Editer une video',
        'new_item'=> 'Nouvelle video',
        'search_items' => 'Rechercher une video',
        'not_found' => 'Aucune video',
        'not_found_in_trash' => 'Aucune video dans la corbeille',
        'menu_name' => 'Carrousel vidéo',
    );

    register_post_type('slide_video', array(
        'public'=> true,
        'publicity_queryable' => false,
        'labels' => $video_labels,
        'menu_icon' => 'dashicons-format-video',
        'capability_type' => 'post',
        'supports' => array('title'),
    ));
}

// ========== Carrousel Photo ==========

// Vignette administration Carrousel photo
function piedebiche_carrousel_columnfilter($columns) {
    $thumb = array('thumbnail' => 'Image');
    $columns = array_slice($columns, 0, 1) + $thumb + array_slice($columns, 1, null);
    return $columns;
}

function piedebiche_carrousel_column($column) {
    global $post;
    if ($column == 'thumbnail') {
        echo edit_post_link(get_the_post_thumbnail($post->ID, 'thumbnail'), null, null, $post->ID);
    } 
}

// Modification de la metabox image mis en avant
function piedebiche_event_metaboxes_photo() {
 
	remove_meta_box('postimagediv', 'slide_photo', 'side');
 
	add_meta_box(
		'postimagediv',
		'Photo',
		'post_thumbnail_meta_box',
		'slide_photo', // votre slug de custom-post-type
		'normal', // 'normal', 'side', 'advanced'
		'high' // 'high', 'core', 'default', 'low'
	);
}

// ========== Carrousel Vidéo ==========

// Hook Metabox lien vidéo
function piedebiche_carrousel_metaboxes() {
    add_meta_box('piedebiche_carrousel', 'Lien', 'piedebiche_carrousel_metabox', 'slide_video', 'normal', 'high') ;
}

// Metabox pour gérer le lien vidéo
function piedebiche_carrousel_metabox($object) {
    wp_nonce_field('piedebiche_carrousel', 'piedebiche_carrousel_nonce'); // Token pour éviter XSS
    ?>
    <div class="meta-box-item-content">
        <input type="text" name="piedebiche_carrousel_link" style="width:100%;" value="<?= esc_attr(get_post_meta($object->ID, '_link', true)); ?>">
    </div>
    <?php
}

// Sauvegarde de la metabox lien vidéo
function piedebiche_carrousel_savepost($post_id, $post) {
    
    if(!isset($_POST['piedebiche_carrousel_link']) || !wp_verify_nonce($_POST['piedebiche_carrousel_nonce'], 'piedebiche_carrousel')) {
        return $post_id;
    }

    $type = get_post_type_object($post->post_type);
    if(current_user_can($type->cap->edit_post)) {
        return $post_id;
    }

    update_post_meta($post_id,'_link', $_POST['piedebiche_carrousel_link']);
}
 
// ========== Affichage du Carrousel ==========
function piedebiche_carrousel_photo_show($limit = 10) {
    $slides = new WP_query("post_type=slide_photo&posts_per_page=$limit"); 
    echo '<div id="pdb-carrousel-photo">'; 
    while($slides->have_posts()) {
        $slides->the_post();
        global $post;
        $alt_text = get_the_title();
        echo '<div class="pdb-carrousel-item-content">';
        the_post_thumbnail('full', array('alt' => $alt_text));
        echo '</div>';
    }
    echo '</div>';
}

function piedebiche_carrousel_video_show($limit = 10) {
    $slides = new WP_query("post_type=slide_video&posts_per_page=$limit"); 
    echo '<div id="pdb-carrousel-video">';  
        while($slides->have_posts()) {
            echo '<div class="pdb-carrousel-item-content">';
                $slides->the_post();
                global $post;
                $video_link = get_post_meta($post->ID, '_link', true);
                echo '<div class="pdb-carrousel-video" data-yt-link="' . esc_attr($video_link) . '"></div>';
            echo '</div>';
        }
    echo '</div>';
}



