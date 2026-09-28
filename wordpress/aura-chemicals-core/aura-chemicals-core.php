<?php
/**
 * Plugin Name: Aura Chemicals Core
 * Plugin URI:  https://aurachemicals.in
 * Description: Core headless functionality for Aura Space Infra Pvt. Ltd. (Aura Chemicals): CPTs, taxonomies, REST API endpoints, quote request handling, and data import tools.
 * Version:     1.0.0
 * Author:      TECHOFY Global Ventures
 * Author URI:  https://aurachemicals.in
 * Text Domain: aura-chemicals
 * License:     GPL-2.0+
 */

defined('ABSPATH') || exit;

define('AURA_CORE_VERSION', '1.0.0');
define('AURA_CORE_PATH', plugin_dir_path(__FILE__));
define('AURA_CORE_URL', plugin_dir_url(__FILE__));

// Load modules
require_once AURA_CORE_PATH . 'includes/post-types.php';
require_once AURA_CORE_PATH . 'includes/meta-fields.php';
require_once AURA_CORE_PATH . 'includes/settings.php';
require_once AURA_CORE_PATH . 'includes/rest-api.php';
require_once AURA_CORE_PATH . 'includes/inquiry-handler.php';
require_once AURA_CORE_PATH . 'includes/importer.php';

/**
 * Activation hook: flush rewrites and seed default options if missing
 */
register_activation_hook(__FILE__, function () {
    aura_register_post_types();
    aura_register_taxonomies();
    flush_rewrite_rules();

    // Default company options
    if (!get_option('aura_company_phone')) {
        update_option('aura_company_phone', '+91 7220000877');
    }
    if (!get_option('aura_company_email')) {
        update_option('aura_company_email', 'management.aurachemicals@gmail.com');
    }
    if (!get_option('aura_legal_name')) {
        update_option('aura_legal_name', 'Aura Space Infra Private Limited');
    }
    if (!get_option('aura_brand_name')) {
        update_option('aura_brand_name', 'Aura Chemicals');
    }
    if (!get_option('aura_roc_reg')) {
        update_option('aura_roc_reg', 'ROC Ahmedabad');
    }
    if (!get_option('aura_experience_years')) {
        update_option('aura_experience_years', '7+ Years');
    }
    if (!get_option('aura_frontend_url')) {
        update_option('aura_frontend_url', 'http://localhost:3001');
    }
});

/**
 * Deactivation hook: flush rewrites
 */
register_deactivation_hook(__FILE__, function () {
    flush_rewrite_rules();
});
