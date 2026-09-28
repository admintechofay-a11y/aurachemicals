<?php
defined('ABSPATH') || exit;

add_action('init', 'aura_register_meta_fields');
add_action('add_meta_boxes', 'aura_add_custom_meta_boxes');
add_action('save_post', 'aura_save_custom_meta_boxes');

// Admin columns for products
add_filter('manage_product_posts_columns', 'aura_filter_product_admin_columns');
add_action('manage_product_posts_custom_column', 'aura_render_product_admin_column', 10, 2);

/**
 * Register post meta with show_in_rest = true
 */
function aura_register_meta_fields() {
    // Product Meta
    $product_fields = [
        'cas_number'           => 'sanitize_text_field',
        'grade'                => 'sanitize_text_field',
        'therapeutic_category' => 'sanitize_text_field',
        'molecular_formula'    => 'sanitize_text_field',
        'molecular_weight'     => 'sanitize_text_field',
        'purity'               => 'sanitize_text_field',
        'packaging'            => 'sanitize_text_field',
        'applications'         => 'sanitize_textarea_field',
        'datasheet_url'        => 'esc_url_raw',
    ];

    foreach ($product_fields as $field => $sanitizer) {
        register_post_meta('product', $field, [
            'type'              => 'string',
            'single'            => true,
            'show_in_rest'      => true,
            'sanitize_callback' => $sanitizer,
            'auth_callback'     => function() { return current_user_can('edit_posts'); }
        ]);
    }

    // Service Meta
    register_post_meta('service', 'standards', [
        'type'              => 'string',
        'single'            => true,
        'show_in_rest'      => true,
        'sanitize_callback' => 'sanitize_text_field',
    ]);
    register_post_meta('service', 'capabilities', [
        'type'              => 'array',
        'single'            => true,
        'show_in_rest'      => [
            'schema' => [
                'type'  => 'array',
                'items' => ['type' => 'string'],
            ],
        ],
    ]);

    // Quote Request Meta
    $quote_fields = [
        'contact_name'          => 'sanitize_text_field',
        'company_name'          => 'sanitize_text_field',
        'contact_email'         => 'sanitize_email',
        'contact_phone'         => 'sanitize_text_field',
        'product_name'          => 'sanitize_text_field',
        'cas_number'            => 'sanitize_text_field',
        'order_quantity'        => 'sanitize_text_field',
        'technical_requirement' => 'sanitize_textarea_field',
        'inquiry_status'        => 'sanitize_text_field',
    ];

    foreach ($quote_fields as $field => $sanitizer) {
        register_post_meta('quote_request', $field, [
            'type'              => 'string',
            'single'            => true,
            'show_in_rest'      => true,
            'sanitize_callback' => $sanitizer,
        ]);
    }
}

/**
 * Add Admin Meta Box for Products & RFQ Inquiries
 */
function aura_add_custom_meta_boxes() {
    add_meta_box(
        'aura_product_specs',
        __('Chemical Specifications & Pharmacopeial Data', 'aura-chemicals'),
        'aura_render_product_meta_box',
        'product',
        'normal',
        'high'
    );

    add_meta_box(
        'aura_quote_details',
        __('Commercial RFQ Inquiry Details', 'aura-chemicals'),
        'aura_render_quote_meta_box',
        'quote_request',
        'normal',
        'high'
    );
}

/**
 * Render Product Meta Box in WP Admin
 */
function aura_render_product_meta_box($post) {
    wp_nonce_field('aura_product_meta_nonce', 'aura_meta_nonce');

    $cas_number           = get_post_meta($post->ID, 'cas_number', true);
    $grade                = get_post_meta($post->ID, 'grade', true);
    $therapeutic_category = get_post_meta($post->ID, 'therapeutic_category', true);
    $molecular_formula    = get_post_meta($post->ID, 'molecular_formula', true);
    $molecular_weight     = get_post_meta($post->ID, 'molecular_weight', true);
    $purity               = get_post_meta($post->ID, 'purity', true);
    $packaging            = get_post_meta($post->ID, 'packaging', true);
    $applications         = get_post_meta($post->ID, 'applications', true);
    $datasheet_url        = get_post_meta($post->ID, 'datasheet_url', true);
    ?>
    <table class="form-table">
        <tr>
            <th style="width: 200px;"><label for="cas_number"><strong><?php _e('CAS Registry Number', 'aura-chemicals'); ?></strong></label></th>
            <td>
                <input type="text" id="cas_number" name="cas_number" value="<?php echo esc_attr($cas_number); ?>" class="regular-text" placeholder="e.g. 89796-99-6" />
                <p class="description"><?php _e('Official CAS RN for instant chemical database matching.', 'aura-chemicals'); ?></p>
            </td>
        </tr>
        <tr>
            <th><label for="grade"><strong><?php _e('Grade Standard', 'aura-chemicals'); ?></strong></label></th>
            <td>
                <input type="text" id="grade" name="grade" value="<?php echo esc_attr($grade); ?>" class="regular-text" placeholder="e.g. Pharma Grade (IP / BP / USP)" />
            </td>
        </tr>
        <tr>
            <th><label for="therapeutic_category"><strong><?php _e('Therapeutic / Industry Class', 'aura-chemicals'); ?></strong></label></th>
            <td>
                <input type="text" id="therapeutic_category" name="therapeutic_category" value="<?php echo esc_attr($therapeutic_category); ?>" class="regular-text" placeholder="e.g. Calcium Channel Blocker / Solvent" />
            </td>
        </tr>
        <tr>
            <th><label for="molecular_formula"><strong><?php _e('Molecular Formula', 'aura-chemicals'); ?></strong></label></th>
            <td>
                <input type="text" id="molecular_formula" name="molecular_formula" value="<?php echo esc_attr($molecular_formula); ?>" class="regular-text" placeholder="e.g. C20H25ClN2O5" />
            </td>
        </tr>
        <tr>
            <th><label for="molecular_weight"><strong><?php _e('Molecular Weight', 'aura-chemicals'); ?></strong></label></th>
            <td>
                <input type="text" id="molecular_weight" name="molecular_weight" value="<?php echo esc_attr($molecular_weight); ?>" class="regular-text" placeholder="e.g. 408.88 g/mol" />
            </td>
        </tr>
        <tr>
            <th><label for="purity"><strong><?php _e('Assay / Purity Threshold', 'aura-chemicals'); ?></strong></label></th>
            <td>
                <input type="text" id="purity" name="purity" value="<?php echo esc_attr($purity); ?>" class="regular-text" placeholder="e.g. ≥ 99.0% / 99.5% HPLC" />
            </td>
        </tr>
        <tr>
            <th><label for="packaging"><strong><?php _e('Standard Export Packaging', 'aura-chemicals'); ?></strong></label></th>
            <td>
                <input type="text" id="packaging" name="packaging" value="<?php echo esc_attr($packaging); ?>" class="regular-text" placeholder="e.g. 25kg Fibre Drums with double PE liner / ISO Tanker" />
            </td>
        </tr>
        <tr>
            <th><label for="applications"><strong><?php _e('Industrial Applications & Uses', 'aura-chemicals'); ?></strong></label></th>
            <td>
                <textarea id="applications" name="applications" rows="3" class="large-text" placeholder="e.g. Used in cardiovascular pharmaceutical formulations, active ingredient synthesis..."><?php echo esc_textarea($applications); ?></textarea>
            </td>
        </tr>
        <tr>
            <th><label for="datasheet_url"><strong><?php _e('Technical Datasheet / COA Document', 'aura-chemicals'); ?></strong></label></th>
            <td>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <input type="url" id="datasheet_url" name="datasheet_url" value="<?php echo esc_attr($datasheet_url); ?>" class="large-text" placeholder="https://..." />
                    <button type="button" class="button aura-media-upload-btn" data-target="#datasheet_url"><?php _e('Upload PDF / File', 'aura-chemicals'); ?></button>
                </div>
            </td>
        </tr>
    </table>
    <?php
}

/**
 * Render RFQ Inquiry Meta Box
 */
function aura_render_quote_meta_box($post) {
    $fields = [
        'Contact Name'          => get_post_meta($post->ID, 'contact_name', true),
        'Company / Firm'        => get_post_meta($post->ID, 'company_name', true),
        'Email Address'         => get_post_meta($post->ID, 'contact_email', true),
        'Phone / WhatsApp'      => get_post_meta($post->ID, 'contact_phone', true),
        'Chemical Product'      => get_post_meta($post->ID, 'product_name', true),
        'CAS Registry Number'   => get_post_meta($post->ID, 'cas_number', true),
        'Target Order Quantity' => get_post_meta($post->ID, 'order_quantity', true),
        'Technical Requirement' => get_post_meta($post->ID, 'technical_requirement', true),
        'Inquiry Status'        => get_post_meta($post->ID, 'inquiry_status', true),
    ];
    ?>
    <table class="form-table">
        <?php foreach ($fields as $label => $val): ?>
            <tr>
                <th style="width: 200px;"><strong><?php echo esc_html($label); ?></strong></th>
                <td><?php echo nl2br(esc_html($val ?: '—')); ?></td>
            </tr>
        <?php endforeach; ?>
    </table>
    <?php
}

/**
 * Save Product Meta Fields
 */
function aura_save_custom_meta_boxes($post_id) {
    if (!isset($_POST['aura_meta_nonce']) || !wp_verify_nonce($_POST['aura_meta_nonce'], 'aura_product_meta_nonce')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $text_fields = [
        'cas_number',
        'grade',
        'therapeutic_category',
        'molecular_formula',
        'molecular_weight',
        'purity',
        'packaging'
    ];

    foreach ($text_fields as $f) {
        if (isset($_POST[$f])) {
            update_post_meta($post_id, $f, sanitize_text_field($_POST[$f]));
        }
    }

    if (isset($_POST['applications'])) {
        update_post_meta($post_id, 'applications', sanitize_textarea_field($_POST['applications']));
    }

    if (isset($_POST['datasheet_url'])) {
        update_post_meta($post_id, 'datasheet_url', esc_url_raw($_POST['datasheet_url']));
    }
}

/**
 * Custom Admin Columns for Chemical Products
 */
function aura_filter_product_admin_columns($columns) {
    $new_columns = [];
    $new_columns['cb']         = $columns['cb'];
    $new_columns['thumb']      = __('Visual', 'aura-chemicals');
    $new_columns['title']      = __('Chemical Name', 'aura-chemicals');
    $new_columns['cas_no']     = __('CAS Number', 'aura-chemicals');
    $new_columns['category']   = __('Category', 'aura-chemicals');
    $new_columns['purity']     = __('Purity', 'aura-chemicals');
    $new_columns['date']       = $columns['date'];

    return $new_columns;
}

/**
 * Render Column Data in Admin List Table
 */
function aura_render_product_admin_column($column, $post_id) {
    switch ($column) {
        case 'thumb':
            if (has_post_thumbnail($post_id)) {
                echo get_the_post_thumbnail($post_id, [40, 40], ['style' => 'border-radius: 4px; object-fit: cover;']);
            } else {
                echo '<span class="dashicons dashicons-beaker" style="color: #999; font-size: 28px;"></span>';
            }
            break;

        case 'cas_no':
            $cas = get_post_meta($post_id, 'cas_number', true);
            echo $cas ? '<code>' . esc_html($cas) . '</code>' : '<span style="color:#aaa;">—</span>';
            break;

        case 'category':
            $terms = get_the_terms($post_id, 'product_category');
            if ($terms && !is_wp_error($terms)) {
                $term_links = array_map(function($t) { return esc_html($t->name); }, $terms);
                echo implode(', ', $term_links);
            } else {
                echo '<span style="color:#aaa;">—</span>';
            }
            break;

        case 'purity':
            $purity = get_post_meta($post_id, 'purity', true);
            echo $purity ? '<strong style="color: #1F5A8C;">' . esc_html($purity) . '</strong>' : '<span style="color:#aaa;">—</span>';
            break;
    }
}
