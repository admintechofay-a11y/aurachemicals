<?php
defined('ABSPATH') || exit;

add_action('after_setup_theme', 'aura_headless_theme_setup');
add_action('init', 'aura_headless_disable_bloat');
add_filter('preview_post_link', 'aura_headless_preview_link', 10, 2);
add_action('admin_bar_menu', 'aura_headless_admin_bar_links', 99);
add_action('wp_dashboard_setup', 'aura_headless_dashboard_widget');

/**
 * Headless Theme Setup
 */
function aura_headless_theme_setup() {
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
}

/**
 * Remove front-end scripts, emojis, and bloat not needed for a Headless CMS
 */
function aura_headless_disable_bloat() {
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_generator');
}

/**
 * Point WordPress admin "Preview" buttons to the React Vite frontend
 */
function aura_headless_preview_link($link, $post) {
    $frontend_url = rtrim(get_option('aura_frontend_url', 'http://localhost:3001'), '/');

    if ($post->post_type === 'product') {
        return $frontend_url . '/products/' . $post->post_name . '?preview=true';
    }
    if ($post->post_type === 'industry') {
        return $frontend_url . '/industries#' . $post->post_name;
    }
    if ($post->post_type === 'page') {
        return $frontend_url . '/' . $post->post_name . '?preview=true';
    }

    return $link;
}

/**
 * Add Quick Navigation Links to WordPress Admin Bar
 */
function aura_headless_admin_bar_links($admin_bar) {
    $frontend_url = get_option('aura_frontend_url', 'http://localhost:3001');

    $admin_bar->add_menu([
        'id'    => 'aura_live_frontend',
        'title' => '<span class="ab-icon dashicons dashicons-external" style="margin-top:2px;"></span> ' . __('Live Frontend App', 'aura-chemicals'),
        'href'  => esc_url($frontend_url),
        'meta'  => ['target' => '_blank'],
    ]);

    $admin_bar->add_menu([
        'id'    => 'aura_frontend_control',
        'title' => '<span class="ab-icon dashicons dashicons-layout" style="margin-top:2px;"></span> ' . __('Aura Control Center', 'aura-chemicals'),
        'href'  => admin_url('admin.php?page=aura-settings'),
    ]);
}

/**
 * Custom WordPress Dashboard Widget: Aura Frontend Status
 */
function aura_headless_dashboard_widget() {
    wp_add_dashboard_widget(
        'aura_headless_overview',
        __('🚀 Aura Chemicals — Headless Frontend Control', 'aura-chemicals'),
        'aura_render_dashboard_widget'
    );
}

function aura_render_dashboard_widget() {
    $frontend_url = get_option('aura_frontend_url', 'http://localhost:3001');
    $brand_name   = get_option('aura_brand_name', 'Aura Chemicals');
    $legal_name   = get_option('aura_legal_name', 'Aura Space Infra Private Limited');
    $phone        = get_option('aura_company_phone', '+91 7220000877');

    $product_count  = wp_count_posts('product')->publish ?? 0;
    $industry_count = wp_count_posts('industry')->publish ?? 0;
    $rfq_count      = wp_count_posts('quote_request')->publish ?? 0;
    ?>
    <div style="font-size: 13px; line-height: 1.6;">
        <p>
            <strong><?php echo esc_html($brand_name); ?></strong> (<?php echo esc_html($legal_name); ?>)<br />
            <?php _e('Connected to React + Vite Headless Frontend:', 'aura-chemicals'); ?>
            <a href="<?php echo esc_url($frontend_url); ?>" target="_blank" style="font-weight: 600;">
                <?php echo esc_html($frontend_url); ?> ↗
            </a>
        </p>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 16px 0; text-align: center;">
            <div style="background: #f0f6fc; padding: 12px; border-radius: 4px; border: 1px solid #c8d8ea;">
                <div style="font-size: 20px; font-weight: 700; color: #1F5A8C;"><?php echo (int) $product_count; ?></div>
                <div style="font-size: 11px; text-transform: uppercase; color: #555;"><?php _e('Products in DB', 'aura-chemicals'); ?></div>
            </div>
            <div style="background: #f0fdf4; padding: 12px; border-radius: 4px; border: 1px solid #bbf7d0;">
                <div style="font-size: 20px; font-weight: 700; color: #166534;"><?php echo (int) $industry_count; ?></div>
                <div style="font-size: 11px; text-transform: uppercase; color: #555;"><?php _e('Industries', 'aura-chemicals'); ?></div>
            </div>
            <div style="background: #fefce8; padding: 12px; border-radius: 4px; border: 1px solid #fef08a;">
                <div style="font-size: 20px; font-weight: 700; color: #854d0e;"><?php echo (int) $rfq_count; ?></div>
                <div style="font-size: 11px; text-transform: uppercase; color: #555;"><?php _e('RFQs Received', 'aura-chemicals'); ?></div>
            </div>
        </div>

        <p style="margin-top: 14px; display: flex; gap: 8px;">
            <a href="<?php echo admin_url('admin.php?page=aura-settings'); ?>" class="button button-primary">
                <?php _e('Open Frontend Control Center', 'aura-chemicals'); ?>
            </a>
            <a href="<?php echo admin_url('edit.php?post_type=product'); ?>" class="button button-secondary">
                <?php _e('Manage Chemical Products', 'aura-chemicals'); ?>
            </a>
        </p>
    </div>
    <?php
}
