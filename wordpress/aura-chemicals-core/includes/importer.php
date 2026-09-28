<?php
defined('ABSPATH') || exit;

add_action('admin_menu', 'aura_register_importer_menu');

function aura_register_importer_menu() {
    add_submenu_page(
        'aura-settings',
        __('Import Chemical Catalog', 'aura-chemicals'),
        __('Import Catalog', 'aura-chemicals'),
        'manage_options',
        'aura-importer',
        'aura_render_importer_page'
    );
}

function aura_render_importer_page() {
    $imported_count = null;
    $message = '';

    if (isset($_POST['aura_run_import']) && check_admin_referer('aura_import_nonce')) {
        $result = aura_run_full_catalog_import();
        $imported_count = $result['products'];
        $message = $result['message'];
    }
    ?>
    <div class="wrap">
        <h1><?php _e('Import Verified Chemical Catalog (135 Items)', 'aura-chemicals'); ?></h1>
        <p><?php _e('This utility synchronizes the 135 verified chemical products and 19 industrial sectors into WordPress Custom Post Types without duplicating existing items.', 'aura-chemicals'); ?></p>

        <?php if ($message): ?>
            <div class="notice notice-success is-dismissible">
                <p><strong><?php echo esc_html($message); ?></strong></p>
            </div>
        <?php endif; ?>

        <div class="card" style="max-width: 600px; padding: 20px; margin-top: 20px;">
            <h2><?php _e('One-Click Catalog Seeder', 'aura-chemicals'); ?></h2>
            <p><?php _e('Data source: Verified scraped records from https://aurachemicals.in/', 'aura-chemicals'); ?></p>
            <ul style="list-style: disc; padding-left: 20px;">
                <li><strong>94 Active Pharmaceutical Ingredients (APIs)</strong> with CAS numbers and classes</li>
                <li><strong>20 Solvents &amp; Base Chemicals</strong></li>
                <li><strong>11 Manufacturing Phosphates</strong></li>
                <li><strong>5 China Make Imports</strong></li>
                <li><strong>6 Technical Acids</strong></li>
                <li><strong>19 Industrial Sectors</strong></li>
            </ul>

            <form method="post">
                <?php wp_nonce_field('aura_import_nonce'); ?>
                <input type="submit" name="aura_run_import" class="button button-primary button-hero" value="<?php esc_attr_e('Run Full Catalog Import', 'aura-chemicals'); ?>" />
            </form>
        </div>
    </div>
    <?php
}

/**
 * Perform database import
 */
function aura_run_full_catalog_import() {
    $products_file   = AURA_CORE_PATH . 'data/products.json';
    $industries_file = AURA_CORE_PATH . 'data/industries.json';
    $categories_file = AURA_CORE_PATH . 'data/categories.json';

    $prod_count = 0;
    $cat_count  = 0;
    $ind_count  = 0;

    // 1. Categories
    if (file_exists($categories_file)) {
        $categories = json_decode(file_get_contents($categories_file), true);
        foreach ($categories as $cat) {
            if (!term_exists($cat['name'], 'product_category')) {
                wp_insert_term($cat['name'], 'product_category', ['slug' => $cat['slug']]);
                $cat_count++;
            }
        }
    }

    // 2. Products
    if (file_exists($products_file)) {
        $products = json_decode(file_get_contents($products_file), true);
        foreach ($products as $p) {
            // Check if product already exists by slug
            $existing = get_page_by_path($p['slug'], OBJECT, 'product');
            $post_id  = $existing ? $existing->ID : 0;

            $post_data = [
                'post_title'   => $p['chemical_name'],
                'post_name'    => $p['slug'],
                'post_type'    => 'product',
                'post_status'  => 'publish',
                'post_excerpt' => $p['short_description'] ?? '',
                'post_content' => $p['short_description'] ?? '',
            ];

            if ($post_id) {
                $post_data['ID'] = $post_id;
                wp_update_post($post_data);
            } else {
                $post_id = wp_insert_post($post_data);
                $prod_count++;
            }

            if ($post_id && !is_wp_error($post_id)) {
                // Update meta
                if (!empty($p['cas_number'])) {
                    update_post_meta($post_id, 'cas_number', $p['cas_number']);
                }
                if (!empty($p['grade'])) {
                    update_post_meta($post_id, 'grade', $p['grade']);
                }
                if (!empty($p['therapeutic_category'])) {
                    update_post_meta($post_id, 'therapeutic_category', $p['therapeutic_category']);
                }

                // Set category term
                if (!empty($p['category']['slug'])) {
                    $term = get_term_by('slug', $p['category']['slug'], 'product_category');
                    if ($term) {
                        wp_set_object_terms($post_id, [$term->term_id], 'product_category');
                    }
                }
            }
        }
    }

    // 3. Industries
    if (file_exists($industries_file)) {
        $industries = json_decode(file_get_contents($industries_file), true);
        foreach ($industries as $ind) {
            $existing = get_page_by_path($ind['slug'], OBJECT, 'industry');
            $post_id  = $existing ? $existing->ID : 0;

            $post_data = [
                'post_title'   => $ind['title'],
                'post_name'    => $ind['slug'],
                'post_type'    => 'industry',
                'post_status'  => 'publish',
                'post_excerpt' => $ind['overview'] ?? '',
                'post_content' => $ind['overview'] ?? '',
            ];

            if ($post_id) {
                $post_data['ID'] = $post_id;
                wp_update_post($post_data);
            } else {
                wp_insert_post($post_data);
                $ind_count++;
            }
        }
    }

    return [
        'products'   => $prod_count,
        'categories' => $cat_count,
        'industries' => $ind_count,
        'message'    => sprintf('Import completed! Synchronized %d chemical products and %d industries.', $prod_count, $ind_count),
    ];
}

/**
 * Register WP-CLI command if active
 */
if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('aura import', function ($args, $assoc_args) {
        WP_CLI::line('Starting Aura Chemicals catalog import...');
        $result = aura_run_full_catalog_import();
        WP_CLI::success($result['message']);
    });
}
