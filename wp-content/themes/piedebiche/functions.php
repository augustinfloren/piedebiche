<?php 

// Barre de contrôle WP
function piedebiche_support () {
    add_theme_support('title-tag');
}

// Images à la une
add_theme_support('post-thumbnails');

// Style
function piedebiche_register_assets () {
  // Enregistrement du style de réinitialisation en premier
  wp_enqueue_style('reset', get_template_directory_uri() . '/public/css/reset.css', array(), '1.0.0', 'all');
  // Enregistrement du style principal avec comme dépendance le style de réinitialisation
  wp_enqueue_style('style', get_stylesheet_uri(), array('reset'), '1.0.0', 'all');
  // Enregistrement du style du lecteur audio avec comme dépendance le style de réinitialisation
  wp_enqueue_style('player', get_template_directory_uri() . '/public/css/player.css', array('reset'), '1.0.0', 'all');
}

// Scripts
function piedebiche_scripts() {
  wp_enqueue_script('piedebiche', get_template_directory_uri() . '/assets/js/piedebiche.js', array('jquery'), '1.0.0', true);
}

// ========== INCLUDES ==========

// Page d'administration
require_once get_template_directory() . '/includes-functions/administration-page.php';
// Concerts
require_once get_template_directory() . '/includes-functions/concerts-posts.php';

// ========== ACTIONS ==========

// Barre WP
add_action('after_setup_theme', 'piedebiche_support');

// Enregistrement paramètres d'administration
add_action('admin_init', 'piedebiche_settings_register');

// Enregistrement scripts ou styles
add_action('wp_enqueue_scripts', 'piedebiche_register_assets', 999);

// Ajout page administration
add_action('admin_menu', 'piedebiche_add_admin_pages');

// Ajout des concerts
add_action('init', 'piedebiche_register_custom_post_types', 11);
