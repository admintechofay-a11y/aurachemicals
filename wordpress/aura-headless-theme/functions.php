<?php
defined('ABSPATH') || exit;

add_action('after_setup_theme', 'aura_headless_theme_setup');
add_action('init', 'aura_headless_disable_bloat');
add_filter('preview_post_link', 'aura_headless_preview_link', 10, 2);

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
