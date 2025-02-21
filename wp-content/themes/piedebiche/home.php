<?php get_header(); ?>
        <main>
            <section class="sections" id="pdb-home">
                <div class="pdb-video-container">

                <?php
                $video_url = get_option('pdb_background_video');

                if ($video_url) {
                    echo '<video autoplay muted loop id="pdb-video">';
                        echo '<source src="' . esc_url($video_url) . '" type="video/mp4">';
                        echo 'Votre navigateur ne supporte pas la vidéo HTML5.';
                    echo '</video>';
                }
                ?>
                </div>
            </section>

            <section class="sections" id="pdb-merch">
            </section>

            <section class="sections" id="pdb-music">
                <div id="pdb-unn-img"></div>
                <?php piedebiche_player_show() ?>
            </section>

            <section class="sections" id="pdb-videos">
            </section>

            <section class="sections" id="pdb-photos">
            </section>

            <section class="sections" id="pdb-concerts">
                <div id="pdb-peache-img"></div>
                <?php require_once get_template_directory() . '/includes-home/concerts.php'; // Agenda Concerts?> 
            </section>

            <section class="sections" id="pdb-contact">
                <div id="pdb-contact-form">
                    <?php echo do_shortcode('[contact-form-7 id="745b58c" title="Contact piedebiche"]'); ?>
                </div>
            </section>
            
            <?php get_footer(); ?>

        </main>

