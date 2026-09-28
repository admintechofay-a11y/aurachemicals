<?php
defined('ABSPATH') || exit;

add_action('init', 'aura_register_meta_fields');
add_action('add_meta_boxes', 'aura_add_custom_meta_boxes');
add_action('save_post', 'aura_save_custom_meta_boxes');

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
 * Add Admin Meta Box for Products (Native fallback if ACF Pro is not active)
 */
function aura_add_custom_meta_boxes() {
    add_meta_box(
        'aura_product_specs',
        __('Chemical Specifications (Aura Core)', 'aura-chemicals'),
        'aura_render_product_meta_box',
        'product',
        'normal',
        'high'
    );

    add_meta_box(
        'aura_quote_details',
        __('RFQ Inquiry Details', 'aura-chemicals'),
        'aura_render_quote_meta_box',
        'quote_request',
        'normal',
        'high'
    );
}

function aura_render_product_meta_box($post) {
    wp_nonce_field('aura_product_meta_nonce', 'aura_meta_nonce');

    $cas_number           = get_post_meta($post->ID, 'cas_number', true);
    $grade                = get_post_meta($post->ID, 'grade', true);
    $therapeutic_category = get_post_meta($post->ID, 'therapeutic_category', true);
    $purity               = get_post_meta($post->ID, 'purity', true);
    $packaging            = get_post_meta($post->ID, 'packaging', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="cas_number"><?php _e('CAS Registry Number', 'aura-chemicals'); ?></label></th>
            <td><input type="text" id="cas_number" name="cas_number" value="<?php echo esc_attr($cas_number); ?>" class="regular-text" placeholder="e.g. 89796-99-6" /></td>
        </tr>
        <tr>
            <th><label for="grade"><?php _e('Grade Standard', 'aura-chemicals'); ?></label></th>
            <td><input type="text" id="grade" name="grade" value="<?php echo esc_attr($grade); ?>" class="regular-text" placeholder="e.g. Pharma Grade (IP/BP/USP)" /></td>
        </tr>
        <tr>
            <th><label for="therapeutic_category"><?php _e('Therapeutic / Technical Class', 'aura-chemicals'); ?></label></th>
            <td><input type="text" id="therapeutic_category" name="therapeutic_category" value="<?php echo esc_attr($therapeutic_category); ?>" class="regular-text" placeholder="e.g. Anti-inflammatory" /></td>
        </tr>
        <tr>
            <th><label for="purity"><?php _e('Purity / Assay %', 'aura-chemicals'); ?></label></th>
            <td><input type="text" id="purity" name="purity" value="<?php echo esc_attr($purity); ?>" class="regular-text" placeholder="e.g. ≥ 99.0%" /></td>
        </tr>
        <tr>
            <th><label for="packaging"><?php _e('Standard Packaging', 'aura-chemicals'); ?></label></th>
            <td><input type="text" id="packaging" name="packaging" value="<?php echo esc_attr($packaging); ?>" class="regular-text" placeholder="e.g. 25kg HDPE drums / ISO tanker" /></td>
        </tr>
    </table>
    <?php
}

function aura_render_quote_meta_box($post) {
    $fields = [
        'Contact Name'          => get_post_meta($post->ID, 'contact_name', true),
        'Company Name'          => get_post_meta($post->ID, 'company_name', true),
        'Email Address'         => get_post_meta($post->ID, 'contact_email', true),
        'Phone Number'          => get_post_meta($post->ID, 'contact_phone', true),
        'Chemical Product'      => get_post_meta($post->ID, 'product_name', true),
        'CAS Number'            => get_post_meta($post->ID, 'cas_number', true),
        'Order Quantity'        => get_post_meta($post->ID, 'order_quantity', true),
        'Technical Requirement' => get_post_meta($post->ID, 'technical_requirement', true),
        'Inquiry Status'        => get_post_meta($post->ID, 'inquiry_status', true),
    ];
    ?>
    <table class="form-table">
        <?php foreach ($fields as $label => $val): ?>
            <tr>
                <th><strong><?php echo esc_html($label); ?></strong></th>
                <td><?php echo nl2br(esc_html($val ?: '—')); ?></td>
            </tr>
        <?php endforeach; ?>
    </table>
    <?php
}

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

    $fields = ['cas_number', 'grade', 'therapeutic_category', 'purity', 'packaging'];
    foreach ($fields as $f) {
        if (isset($_POST[$f])) {
            update_post_meta($post_id, $f, sanitize_text_field($_POST[$f]));
        }
    }
}
