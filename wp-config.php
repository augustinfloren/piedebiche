<?php
/**
 * La configuration de base de votre installation WordPress.
 *
 * Ce fichier contient les réglages de configuration suivants : réglages MySQL,
 * préfixe de table, clés secrètes, langue utilisée, et ABSPATH.
 * Vous pouvez en savoir plus à leur sujet en allant sur
 * {@link https://fr.wordpress.org/support/article/editing-wp-config-php/ Modifier
 * wp-config.php}. C’est votre hébergeur qui doit vous donner vos
 * codes MySQL.
 *
 * Ce fichier est utilisé par le script de création de wp-config.php pendant
 * le processus d’installation. Vous n’avez pas à utiliser le site web, vous
 * pouvez simplement renommer ce fichier en "wp-config.php" et remplir les
 * valeurs.
 *
 * @link https://fr.wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Réglages MySQL - Votre hébergeur doit vous fournir ces informations. ** //
/** Nom de la base de données de WordPress. */
define( 'DB_NAME', 'piedebiche' );

/** Utilisateur de la base de données MySQL. */
define( 'DB_USER', 'pdb_admin' );

/** Mot de passe de la base de données MySQL. */
define( 'DB_PASSWORD', 'yRk1s"YjaD64.cp' );

/** Adresse de l’hébergement MySQL. */
define( 'DB_HOST', 'localhost' );

/** Jeu de caractères à utiliser par la base de données lors de la création des tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** Type de collation de la base de données.
  * N’y touchez que si vous savez ce que vous faites.
  */
define('DB_COLLATE', '');

/**#@+
 * Clés uniques d’authentification et salage.
 *
 * Remplacez les valeurs par défaut par des phrases uniques !
 * Vous pouvez générer des phrases aléatoires en utilisant
 * {@link https://api.wordpress.org/secret-key/1.1/salt/ le service de clés secrètes de WordPress.org}.
 * Vous pouvez modifier ces phrases à n’importe quel moment, afin d’invalider tous les cookies existants.
 * Cela forcera également tous les utilisateurs à se reconnecter.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'B1nyFj6z,|,XO<D D?C&d3=BYcr{9p a,[95dFcz?jk>rPCn/vJV=8(J_!r`Z;__' );
define( 'SECURE_AUTH_KEY',  '.5>#OgEJO$x=/]p]omCn.BZ[~D}$Xq4Hzk~.AiaLST{o`7^Y}I>TGYd%G+ISN,K]' );
define( 'LOGGED_IN_KEY',    'Y4iacTs.ofJ@JjKr7$~qfiWjv{-*to}53}PH!6C>TPK2~Fo-6Eq_Xn1![f];g,8K' );
define( 'NONCE_KEY',        ' 0_lsNmxR:[:8=<Jb[ceu]=V;|Q`, k]#1zH49gc~%8|lPOp]78OVC#2/BfVX^j^' );
define( 'AUTH_SALT',        '#>Z2KAZJ6;Qg.jBVX, D~-$D}PgI@I,5c==*QO4:nz x*Zr=HRnl`8v`j%;MAu{M' );
define( 'SECURE_AUTH_SALT', '.my8qYREbHM$UWVe!)+_(*J7_>sMr(ZxHzt`M6^`M<jK5,L/C9@,r;sTx~:Ai#=8' );
define( 'LOGGED_IN_SALT',   'm<.DMofYx5^u)RuW<V6nS-;>h0P1WC/UAErxDAf^~qV[bm)_+GBd(t9goI$2RNU%' );
define( 'NONCE_SALT',       '<OU&?!HhY~eQvXy$tYit!O{PM}crn+;*:2%8-/mr54*0pw$Fi%j3|.TZ^s#{!}|d' );
/**#@-*/

/**
 * Préfixe de base de données pour les tables de WordPress.
 *
 * Vous pouvez installer plusieurs WordPress sur une seule base de données
 * si vous leur donnez chacune un préfixe unique.
 * N’utilisez que des chiffres, des lettres non-accentuées, et des caractères soulignés !
 */
$table_prefix = 'wp_';

/**
 * Pour les développeurs et développeuses : le mode déboguage de WordPress.
 *
 * En passant la valeur suivante à "true", vous activez l’affichage des
 * notifications d’erreurs pendant vos essais.
 * Il est fortement recommandé que les développeurs et développeuses d’extensions et
 * de thèmes se servent de WP_DEBUG dans leur environnement de
 * développement.
 *
 * Pour plus d’information sur les autres constantes qui peuvent être utilisées
 * pour le déboguage, rendez-vous sur la documentation.
 *
 * @link https://fr.wordpress.org/support/article/debugging-in-wordpress/
 */
define('WP_DEBUG', false);
define('SCRIPT_DEBUG', true);

/* C’est tout, ne touchez pas à ce qui suit ! Bonne publication. */

/** Chemin absolu vers le dossier de WordPress. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Réglage des variables de WordPress et de ses fichiers inclus. */
require_once(ABSPATH . 'wp-settings.php');
