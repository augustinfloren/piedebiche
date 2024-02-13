<?php get_header(); ?>
<!-- piedebiche_player_show(); -->
<!-- piedebiche_carrousel_photo_show(); -->
<!-- piedebiche_carrousel_video_show(); -->

<!-- ========== MAIN ========== -->

    <div class="sections section1">
        <div class="pdb-video-container">
            <video autoplay muted loop id="pdb-video">
                <source src="<?php echo get_template_directory_uri() . '/public/videos/pdb-video-bg.mp4'; ?>" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    </div>

    <div class="sections section2">

    </div>

    <div class="sections section3">

    </div>

    <div class="sections section4">

    </div>

    <div class="sections section5">

    </div>

    <div class="sections section6">

    </div>

<?php // require_once get_template_directory() . '/includes-home/concerts.php'; // Agenda Concerts?> 

<?php get_footer(); ?>
