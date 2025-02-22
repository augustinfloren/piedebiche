<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Site officiel du groupe post punk indie PIEDEBICHE formé à Marseille.
    Rock sauvage et émotionnel aux textes en français rebelles et poétiques.">
    <link rel="icon" href="<?php echo get_template_directory_uri() . '/public/images/favicon.ico'?>" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <title><?php bloginfo('name'); ?></title>
    <?php wp_head() ?>
</head>
<body>
    <div id="pdb-container" class="pdb-parallax">
        <header>
            <div id="pdb-logo-container">
                <a href="#pdb-home">
                    <img id="pdb-logo" src="<?php echo get_template_directory_uri() . '/public/images/pdb-logo.png';?>" alt="Logo de piedebiche">
                </a>
            </div>
            <button id="pdb-burger">
                <div id="pdb-burger-bar"></div>
            </button>
            <nav id="pdb-main-menu">
                <ul>
                    <?php if (get_option('pdb_merch_enabled')) : ?>
                        <li><a href="#pdb-merch">Boutique</a></li>
                    <?php endif; ?>
                    <li><a href="#pdb-music">Musique</a></li>
                    <li><a href="#pdb-videos">Vidéos</a></li>
                    <li><a href="#pdb-photos">Photos</a></li>
                    <li><a href="#pdb-concerts">Concerts</a></li>
                    
                    <li><a href="#pdb-contact">Contact</a></li>
                    <li><a href="#">Pro</a></li>
                </ul>
            </nav>
        
            <div id="pdb-menu-overlay"></div>

            <div id="pdb-pro">
                <div id="pdb-pro-text-box">
                    <h3 id="pdb-pro-title">Pro</h3>
                    <ul>
                        <li>
                            <?php
                                // Affichage conditionnel des boutons de dossier de présentation et fiche technique
                                if (get_option('pdb_presentation_enabled') && !empty(get_option('pdb_presentation_file'))) {
                                    echo '<a class="btn dossier-presentation" href="' . esc_url(get_option('pdb_presentation_file')) . '">Dossier de présentation</a>';
                                }
                            ?>
                        </li>
                        <li>
                            <?php
                                // Affichage conditionnel des boutons de dossier de présentation et fiche technique
                                if (get_option('pdb_technical_enabled') && !empty(get_option('pdb_technical_file'))) {
                                    echo '<a class="btn fiche-technique" href="' . esc_url(get_option('pdb_technical_file')) . '">Fiche technique</a>';
                                }
                            ?>
                        </li>
                    </ul>
                </div>
            </div>

        </header>