<?php get_header(); ?>
<!-- piedebiche_player_show(); -->
<!-- piedebiche_carrousel_photo_show(); -->
<!-- piedebiche_carrousel_video_show(); -->

<!-- ========== MAIN ========== -->

    <div class="sections section1" id="pdb-home">
        <div class="pdb-video-container">
            <video autoplay muted loop id="pdb-video">
                <source src="<?php echo get_template_directory_uri() . '/public/videos/pdb-video-bg.mp4'; ?>" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    </div>

    <div class="sections section2" id="pdb-music">
        <div id="pdb-player"></div>
    </div>

    <div class="sections section3" id="pdb-videos">

    </div>

    <div class="sections section4" id="pdb-photos">

    </div>

    <div class="sections section5" id="pdb-concerts">

    </div>

    <div class="sections section6" id="pdb-contact">

    </div>

<?php // require_once get_template_directory() . '/includes-home/concerts.php'; // Agenda Concerts?> 

<?php get_footer(); ?>
