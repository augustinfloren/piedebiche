<?php

function piedebiche_register_custom_post_types() {
    // Définition des étiquettes pour le type de publication
    $labels_concert = array(
        'menu_name'         => __('Concerts', 'piedebiche'),
        'name_admin_bar'    => __('Concert', 'piedebiche'),
        'add_new'           => __('Ajouter un nouveau concert', 'piedebiche'),
        'add_new_item'      => __('Ajouter', 'piedebiche'),
        'new_item'          => __('Nouveau concert', 'piedebiche'),
        'edit_item'         => __('Modifier le concert', 'piedebiche'),
    );

    // Définition des arguments pour le type de publication
    $args_concert = array(
        'label'             => __('Concerts', 'piedebiche'),
        'description'       => __('Concerts', 'piedebiche'),
        'labels'            => $labels_concert,
        'supports'          => array('title','thumbnail'),
        'hierarchical'      => false,
        'public'            => true,
        'show_ui'           => true,
        'show_in_menu'      => true,
        'menu_position'     => 40,
        'show_in_admin_bar' => true,
        'show_in_nav_menus' => true,
        'can_export'        => true,
        'has_archive'       => true,
        'exclude_from_search'   => false,
        'publicly_queryable' => true,
        'capability_type'   => 'post',
        'menu_icon'  => 'dashicons-tickets-alt',
    );

    // Enregistrement du type de publication personnalisé 'cif_ingredient'
    register_post_type('pdb_concert', $args_concert);
}
