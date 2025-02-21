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
add_action("do_meta_boxes", "piedebiche_event_metaboxes_photo");
add_action('manage_edit-slide_photo_columns', 'piedebiche_carrousel_columnfilter');
add_action('manage_posts_custom_column', 'piedebiche_carrousel_column');
add_action('wp_enqueue_scripts', 'pdb_carrousel_register_assets');

function pdb_carrousel_register_assets () {
    // Charger l'API YouTube Player
    wp_enqueue_script( 'youtube-iframe-api', 'https://www.youtube.com/iframe_api');
    wp_enqueue_script( 'plyr', 'https://cdn.plyr.io/3.7.8/plyr.js'); 
    wp_enqueue_style('plyr', 'https://cdn.plyr.io/3.7.8/plyr.css');
    wp_enqueue_script('axios', 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js', array(), null, true);
    wp_enqueue_script('swiper', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js', array(), null, true);
    wp_enqueue_style('swiper', 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
    wp_register_script('pdb-merch', plugin_dir_url(__FILE__) . 'js/pdb-merch.js', array('jquery'), null, true);
    wp_register_script('pdb-photos', plugin_dir_url(__FILE__) . 'js/pdb-photos.js', array('jquery'), null, true);
    wp_register_script('pdb-custom-videos', plugin_dir_url(__FILE__) . 'js/pdb-custom-videos.js', array('jquery'), null, true);
    wp_localize_script('pdb-custom-videos', 'pluginUrl', array(
        'url' => plugin_dir_url(__FILE__)
    ));
    wp_enqueue_script('pdb-merch');
    wp_enqueue_script('pdb-photos');
    wp_enqueue_script('pdb-custom-videos');
    wp_enqueue_style('pdb-carrousel-style', plugins_url().'/pdb-carrousel/css/pdb-carrousel-style.css'); // Chargement CSS
    wp_enqueue_script('pdb-fullscreen-carrousel', plugins_url().'/pdb-carrousel/js/pdb-fullscreen-carrousel.js'); // Chargement JS 
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
        'show_in_rest' => true,
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
        'show_in_rest' => true,
    ));

    $merch_labels = array(
        'name' => 'Boutique',
        'singular_name' => 'Boutique',
        'add_new' => 'Ajouter un produit',
        'add_new_item' => 'Ajouter un produit',
        'edit_item' => 'modifier un produit',
        'new_item'=> 'Nouveau produit',
        'search_items' => 'Rechercher un produit',
        'not_found' => 'Aucun produit',
        'not_found_in_trash' => 'Aucun produit dans la corbeille',
        'menu_name' => 'Boutique',
    );

    register_post_type('slide_merch', array(
        'public'=> true,
        'publicity_queryable' => false,
        'labels' => $merch_labels,
        'menu_icon' => 'dashicons-cart',
        'capability_type' => 'post',
        'supports' => array('title', 'thumbnail', 'custom-fields'),
        'show_in_rest' => true,
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

// Fonction pour ajouter le champ personnalisé à l'API REST
function piedebiche_register_featured_image_field() {
    register_rest_field(
        'slide_photo', // Types de contenu auxquels ajouter le champ
        'featured_media_src_url', // Nom du champ
        array(
            'get_callback' => 'piedebiche_get_featured_image_src',
            'update_callback' => null,
            'schema' => null,
        )
    );
}

add_action('rest_api_init', 'piedebiche_register_featured_image_field');

function piedebiche_get_featured_image_src($object, $field_name, $request) {
    $featured_image_id = $object['featured_media']; // ID de l'image en vedette
    $featured_image_url = wp_get_attachment_image_url($featured_image_id, 'full'); // URL de l'image en taille 'full'
    return $featured_image_url;
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

// Fonction pour ajouter le champ personnalisé à l'API REST
function piedebiche_register_link_field() {
    register_rest_field('slide_video', // Type de contenu auquel ajouter le champ (article dans ce cas)
        '_link', // Nom du champ à ajouter
        array(
            'get_callback' => 'piedebiche_get_link_field', // Fonction de rappel pour récupérer la valeur du champ
            'update_callback' => null,
            'schema' => null,
        )
    );
}
add_action('rest_api_init', 'piedebiche_register_link_field');

// Fonction de rappel pour récupérer la valeur du champ personnalisé
function piedebiche_get_link_field($object, $field_name, $request) {
    return get_post_meta($object['id'], '_link', true);
}


// ========== Carrousel Merch ==========

function piedebiche_carrousel_merch_metabox() {
    add_meta_box(
        'piedebiche_merch_metabox',
        'Détails du Produit',
        'piedebiche_merch_metabox_callback',
        'slide_merch',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'piedebiche_carrousel_merch_metabox');

function piedebiche_merch_metabox_callback($post) {
    wp_nonce_field('piedebiche_merch_nonce_action', 'piedebiche_merch_nonce');
    $price = get_post_meta($post->ID, '_price', true);
    $link = get_post_meta($post->ID, '_buy_link', true);
    $thumbnail_id = get_post_thumbnail_id($post->ID);
    $thumbnail_url = $thumbnail_id ? wp_get_attachment_image_url($thumbnail_id, 'medium') : '';
    ?>
    <p>
        <label for="piedebiche_price">Prix (€) :</label>
        <input type="number" step="0.01" name="piedebiche_price" value="<?= esc_attr($price); ?>" style="width: 100%;">
    </p>
    <p>
        <label for="piedebiche_buy_link">Lien d'achat :</label>
        <input type="url" name="piedebiche_buy_link" value="<?= esc_attr($link); ?>" style="width: 100%;">
    </p>
    <p>
        <label>Image du produit :</label><br>
        <?php if ($thumbnail_url): ?>
            <img src="<?= esc_url($thumbnail_url); ?>" style="max-width: 100%; height: auto;">
        <?php else: ?>
            <p>Aucune image définie.</p>
        <?php endif; ?>
        <p>Utilise l'image mise en avant du post.</p>
    </p>
    <?php
}

function piedebiche_carrousel_merch_savepost($post_id) {
    if (!isset($_POST['piedebiche_merch_nonce']) || !wp_verify_nonce($_POST['piedebiche_merch_nonce'], 'piedebiche_merch_nonce_action')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['piedebiche_price'])) {
        update_post_meta($post_id, '_price', sanitize_text_field($_POST['piedebiche_price']));
    }

    if (isset($_POST['piedebiche_buy_link'])) {
        update_post_meta($post_id, '_buy_link', esc_url($_POST['piedebiche_buy_link']));
    }
}
add_action('save_post', 'piedebiche_carrousel_merch_savepost');

function piedebiche_register_merch_fields() {
    register_rest_field('slide_merch', '_price', array(
        'get_callback' => function($object) { return get_post_meta($object['id'], '_price', true); },
        'schema' => null,
    ));
    
    register_rest_field('slide_merch', '_buy_link', array(
        'get_callback' => function($object) { return get_post_meta($object['id'], '_buy_link', true); },
        'schema' => null,
    ));

    register_rest_field('slide_merch', 'thumbnail', array(
        'get_callback' => function($object) {
            $thumbnail_id = get_post_thumbnail_id($object['id']);
            return $thumbnail_id ? wp_get_attachment_image_url($thumbnail_id, 'medium') : null;
        },
        'schema' => null,
    ));
}
add_action('rest_api_init', 'piedebiche_register_merch_fields');



