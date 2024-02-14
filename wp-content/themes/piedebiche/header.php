<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php bloginfo('name'); ?></title>
    <?php wp_head() ?>
</head>
<body>
    <div class="container">
        <header>
            <a href="#pdb-home" id="pdb-logo-container">
                <img id="pdb-logo" src="<?php echo get_template_directory_uri() . '/public/images/pdb-logo.png';?>" alt="Logo de piedebiche">
            </a>
            <nav id="pdb-main-menu">
                <ul>
                    <li><a href="#pdb-music">Musique</a></li>
                    <li><a href="#pdb-videos">Vidéos</a></li>
                    <li><a href="#pdb-photos">Photos</a></li>
                    <li><a href="#pdb-concerts">Concerts</a></li>
                    <li><a href="#">Merch</a></li>
                    <li><a href="#pdb-contact">Contact</a></li>
                    <li><a href="#">Pro</a></li>
                </ul>
            </nav>
        </header>