<?php

// Page d'aministration 
function piedebiche_add_admin_pages() {
    add_menu_page(__('Paramètres du thème piedebiche', 'piedebiche'), __('piedebiche', 'piedebiche'), 'manage_options', 'piedebiche-settings', 'piedebiche_theme_settings', 'dashicons-admin-settings', 60); 
}

// Structure page d'administration
function piedebiche_theme_settings() {
    echo '<h1>' . get_admin_page_title() . '</h1>';

    echo '<form action="options.php" method="post" name="piedebiche_settings">';

    echo '<div>';

    settings_fields('piedebiche_settings_fields');

    do_settings_sections('piedebiche_settings_section');

    submit_button();

    echo '</div>';

    echo '</form>';
}

// Paramètres page d'administration

// Enregistrement en bdd
function piedebiche_settings_register() {
    register_setting('piedebiche_settings_fields', 'piedebiche_settings_fields', 'piedebiche_settings_fields_validate');
    add_settings_section('piedebiche_settings_section', __('Paramètres', 'piedebiche'), 'piedebiche_settings_section_introduction', 'piedebiche_settings_section');
    add_settings_field('piedebiche_settings_field_introduction', __('Introduction', 'piedebiche'), 'piedebiche_settings_field_introduction_output', 'piedebiche_settings_section', 'piedebiche_settings_section');
  }

// Label du champ introduction
function piedebiche_settings_section_introduction() {
    echo __('Paramètrez les options de votre thème.', 'piedebiche');
}

// Validation avant enregistrement
function piedebiche_settings_fields_validate($inputs) {  
    if(isset($_POST) && !empty($_POST)) { 
      if(isset($_POST['piedebiche_settings_field_introduction']) && !empty($_POST['piedebiche_settings_field_introduction'])) {
        update_option('piedebiche_settings_field_introduction', $_POST['piedebiche_settings_field_introduction']);
      }
    }

    return $inputs;
  }

// Affichage du texte du champ dans la page administration
function piedebiche_settings_field_introduction_output() {
    $value = get_option('piedebiche_settings_field_introduction');
    
    echo '<input name="piedebiche_settings_field_introduction" type="text" value="'.$value.'" />';
}