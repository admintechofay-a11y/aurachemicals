<?php
defined('ABSPATH') || exit;

add_action('init', 'aura_register_post_types');
add_action('init', 'aura_register_taxonomies');

/**
 * Register Custom Post Types for Headless Architecture
 */
function aura_register_post_types() {
    // 1. Product CPT
    register_post_type('product', [
        'labels' => [
            'name'               => __('Chemical Products', 'aura-chemicals'),
            'singular_name'      => __('Chemical Product', 'aura-chemicals'),
            'add_new'            => __('Add Product', 'aura-chemicals'),
            'add_new_item'       => __('Add New Chemical Product', 'aura-chemicals'),
            'edit_item'          => __('Edit Chemical Product', 'aura-chemicals'),
            'all_items'          => __('All Products (135 Catalog)', 'aura-chemicals'),
            'search_items'       => __('Search Products or CAS', 'aura-chemicals'),
            'not_found'          => __('No chemical products found', 'aura-chemicals'),
        ],
        'public'              => true,
        'has_archive'         => true,
        'rewrite'             => ['slug' => 'products'],
        'show_in_rest'        => true,
        'rest_base'           => 'products',
        'menu_icon'           => 'dashicons-beaker',
        'supports'            => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
    ]);

    // 2. Industry CPT
    register_post_type('industry', [
        'labels' => [
            'name'               => __('Industries', 'aura-chemicals'),
            'singular_name'      => __('Industry Sector', 'aura-chemicals'),
            'add_new'            => __('Add Industry', 'aura-chemicals'),
            'add_new_item'       => __('Add New Industry Sector', 'aura-chemicals'),
            'edit_item'          => __('Edit Industry Sector', 'aura-chemicals'),
            'all_items'          => __('All Industries (19 Sectors)', 'aura-chemicals'),
        ],
        'public'              => true,
        'has_archive'         => false,
        'rewrite'             => ['slug' => 'industries'],
        'show_in_rest'        => true,
        'rest_base'           => 'industries',
        'menu_icon'           => 'dashicons-building',
        'supports'            => ['title', 'editor', 'thumbnail', 'excerpt'],
    ]);

    // 3. Service CPT
    register_post_type('service', [
        'labels' => [
            'name'               => __('Services', 'aura-chemicals'),
            'singular_name'      => __('Service Capability', 'aura-chemicals'),
            'add_new'            => __('Add Service', 'aura-chemicals'),
            'add_new_item'       => __('Add New Service Capability', 'aura-chemicals'),
            'edit_item'          => __('Edit Service Capability', 'aura-chemicals'),
            'all_items'          => __('All Services', 'aura-chemicals'),
        ],
        'public'              => true,
        'has_archive'         => false,
        'rewrite'             => ['slug' => 'services'],
        'show_in_rest'        => true,
        'rest_base'           => 'services',
        'menu_icon'           => 'dashicons-shield',
        'supports'            => ['title', 'editor', 'excerpt'],
    ]);

    // 4. Client / Partner CPT
    register_post_type('client', [
        'labels' => [
            'name'               => __('Clientele & Partners', 'aura-chemicals'),
            'singular_name'      => __('Client / Partner', 'aura-chemicals'),
            'add_new'            => __('Add Client', 'aura-chemicals'),
            'all_items'          => __('All Clients & Partners', 'aura-chemicals'),
        ],
        'public'              => false,
        'show_ui'             => true,
        'show_in_rest'        => true,
        'rest_base'           => 'clients',
        'menu_icon'           => 'dashicons-groups',
        'supports'            => ['title', 'thumbnail'],
    ]);

    // 5. Quote Request CPT (Inquiries)
    register_post_type('quote_request', [
        'labels' => [
            'name'               => __('Quote Requests', 'aura-chemicals'),
            'singular_name'      => __('Quote Request', 'aura-chemicals'),
            'all_items'          => __('All Incoming RFQs', 'aura-chemicals'),
            'edit_item'          => __('View Quote Request', 'aura-chemicals'),
            'search_items'       => __('Search RFQs', 'aura-chemicals'),
        ],
        'public'              => false,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true,
        'rest_base'           => 'quote-requests',
        'menu_icon'           => 'dashicons-email-alt',
        'capabilities'        => [
            'create_posts' => 'do_not_allow', // Created via REST API submissions only
        ],
        'map_meta_cap'        => true,
        'supports'            => ['title', 'custom-fields'],
    ]);
}

/**
 * Register Custom Taxonomy: Product Category
 */
function aura_register_taxonomies() {
    register_taxonomy('product_category', ['product'], [
        'labels' => [
            'name'              => __('Product Categories', 'aura-chemicals'),
            'singular_name'     => __('Product Category', 'aura-chemicals'),
            'search_items'      => __('Search Categories', 'aura-chemicals'),
            'all_items'         => __('All Product Categories', 'aura-chemicals'),
            'edit_item'         => __('Edit Category', 'aura-chemicals'),
            'update_item'       => __('Update Category', 'aura-chemicals'),
            'add_new_item'      => __('Add New Category', 'aura-chemicals'),
            'new_item_name'     => __('New Category Name', 'aura-chemicals'),
            'menu_name'         => __('Categories', 'aura-chemicals'),
        ],
        'hierarchical'          => true,
        'public'                => true,
        'show_ui'               => true,
        'show_admin_column'     => true,
        'show_in_rest'          => true,
        'rest_base'             => 'product-categories',
        'rewrite'               => ['slug' => 'product-category'],
    ]);
}
