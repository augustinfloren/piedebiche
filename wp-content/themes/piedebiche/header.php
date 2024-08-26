<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                    <li><a href="#pdb-music">Musique</a></li>
                    <li><a href="#pdb-videos">Vidéos</a></li>
                    <li><a href="#pdb-photos">Photos</a></li>
                    <li><a href="#pdb-concerts">Concerts</a></li>
                    <li><a href="#">Merch</a></li>
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
                            <a href="<?php echo wp_upload_dir()['baseurl'] . '/2024/03/presentation-MD-PDB-20242.pdf'; ?>" target="_blank">Dossier de présentation</a>
                        </li>
                        <li>
                            <a href="#">Fiche technique</a>
                        </li>
                    </ul>
                </div>
            </div>

        </header>