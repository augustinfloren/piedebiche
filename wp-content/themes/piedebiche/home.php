<?php get_header(); ?>
        <main>
            <section class="sections" id="pdb-home">
                <div class="pdb-video-container">
                    <video autoplay muted loop id="pdb-video">
                        <source src="<?php echo esc_url(get_option('pdb_background_video', get_template_directory_uri() . '/public/videos/pdb-video-bg.mp4')); ?>" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
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

