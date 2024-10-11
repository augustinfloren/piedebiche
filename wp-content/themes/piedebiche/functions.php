<?php 

// Barre de contrôle WP
function piedebiche_support () {
    add_theme_support('title-tag');
}

// Images à la une
add_theme_support('post-thumbnails');

// Styles et Scripts
function piedebiche_register_assets () {
  // Enregistrement du style de réinitialisation
  wp_enqueue_style('reset', get_template_directory_uri() . '/public/css/reset.css', array(), '1.0.0', 'all');
  // Enregistrement du style principal
  wp_enqueue_style('style', get_stylesheet_uri(), array('reset'), '1.0.0', 'all');
  // Enregistrement du style du lecteur audio
  wp_enqueue_style('player', get_template_directory_uri() . '/public/css/player.css', array('reset'), '1.0.0', 'all');
  // Enregistrement du script principal
  wp_enqueue_script('piedebiche', get_template_directory_uri() . '/public/js/pdb.js', array(), '1.0.0', true);
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

// Ajouter une page de réglages pour le menu
function pdb_add_settings_page() {
  add_options_page(
      'Réglages Merch',
      'Réglages Merch',
      'manage_options',
      'pdb-settings',
      'pdb_render_settings_page'
  );
}
add_action('admin_menu', 'pdb_add_settings_page');

// ========== PAGE CONCERT ==========

// Afficher la page de réglages
function pdb_render_settings_page() {
  ?>
  <div class="wrap">
      <h1>Réglages Merch</h1>
      <form method="post" action="options.php">
          <?php
          settings_fields('pdb_options_group');
          do_settings_sections('pdb_options_group');
          ?>
          <table class="form-table">
              <tr valign="top">
                  <th scope="row">URL du Merch</th>
                  <td><input type="text" name="pdb_merch_url" value="<?php echo esc_attr(get_option('pdb_merch_url')); ?>" /></td>
              </tr>
              <tr valign="top">
                  <th scope="row">Activer le bouton Merch</th>
                  <td><input type="checkbox" name="pdb_merch_enabled" value="1" <?php checked(1, get_option('pdb_merch_enabled'), true); ?> /></td>
              </tr>
          </table>
          <?php submit_button(); ?>
      </form>
  </div>
  <?php
}

// Enregistrer les options
function pdb_register_settings() {
  register_setting('pdb_options_group', 'pdb_merch_url');
  register_setting('pdb_options_group', 'pdb_merch_enabled');
}
add_action('admin_init', 'pdb_register_settings');

// ========== VIDEO FOND ==========

// Ajouter une page de réglages pour la vidéo de fond
function pdb_add_video_settings_page() {
    add_options_page(
        'Réglages Vidéo de Fond',
        'Vidéo de Fond',
        'manage_options',
        'pdb-video-settings',
        'pdb_render_video_settings_page'
    );
}
add_action('admin_menu', 'pdb_add_video_settings_page');

// Afficher la page de réglages
function pdb_render_video_settings_page() {
    ?>
    <div class="wrap">
        <h1>Réglages Vidéo de Fond</h1>
        <form method="post" action="options.php" enctype="multipart/form-data">
            <?php
            settings_fields('pdb_video_options_group');
            do_settings_sections('pdb_video_options_group');
            ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">URL de la Vidéo de Fond</th>
                    <td>
                        <input type="text" name="pdb_background_video" value="<?php echo esc_attr(get_option('pdb_background_video')); ?>" />
                        <p class="description">Ou téléchargez un fichier vidéo.</p>
                        <input type="file" name="pdb_background_video_file" />
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// Enregistrer les options
function pdb_register_video_settings() {
    register_setting('pdb_video_options_group', 'pdb_background_video');
}
add_action('admin_init', 'pdb_register_video_settings');

// Enregistrer le fichier vidéo dans la bibliothèque des médias
function pdb_handle_video_upload() {
    if (!empty($_FILES['pdb_background_video_file']['name'])) {
        $uploadedfile = $_FILES['pdb_background_video_file'];
        $upload_overrides = ['test_form' => false];

        $movefile = wp_handle_upload($uploadedfile, $upload_overrides);

        if ($movefile && !isset($movefile['error'])) {
            update_option('pdb_background_video', $movefile['url']);
        }
    }
}
add_action('admin_post_pdb_video_upload', 'pdb_handle_video_upload');