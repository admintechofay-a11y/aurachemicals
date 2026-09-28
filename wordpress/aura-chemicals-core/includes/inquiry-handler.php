<?php
defined('ABSPATH') || exit;

/**
 * Handle incoming RFQ quote submissions from React Frontend
 */
function aura_handle_inquiry_submission(WP_REST_Request $request) {
    $params = $request->get_json_params() ?: $request->get_body_params();

    // 1. Honeypot check
    if (!empty($params['website_url_hp'])) {
        return rest_ensure_response([
            'success'    => true,
            'message'    => 'Inquiry received successfully.',
            'inquiry_id' => 9999,
        ]);
    }

    // 2. Time check (reject form filled under 2 seconds)
    if (!empty($params['_ts'])) {
        $elapsed = time() - intval($params['_ts']);
        if ($elapsed < 2) {
            return new WP_Error('bot_submission', 'Submission was too fast. Please retry.', ['status' => 429]);
        }
    }

    // 3. IP Rate Limiting via WordPress Transients (Max 10 per hour per IP)
    $client_ip = sanitize_text_field($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
    $rate_key  = 'aura_rfq_rate_' . md5($client_ip);
    $attempts  = (int) get_transient($rate_key);

    if ($attempts >= 10) {
        return new WP_Error(
            'rate_limit_exceeded',
            'Maximum quotation submission limit reached for this session. Please contact the sales desk directly via phone or email.',
            ['status' => 429]
        );
    }
    set_transient($rate_key, $attempts + 1, HOUR_IN_SECONDS);

    // 4. Validate required fields
    $name     = sanitize_text_field($params['name'] ?? '');
    $company  = sanitize_text_field($params['company'] ?? '');
    $email    = sanitize_email($params['email'] ?? '');
    $phone    = sanitize_text_field($params['phone'] ?? '');
    $product  = sanitize_text_field($params['product'] ?? '');
    $cas      = sanitize_text_field($params['cas_number'] ?? '');
    $quantity = sanitize_text_field($params['quantity'] ?? '');
    $notes    = sanitize_textarea_field($params['requirement'] ?? '');

    if (empty($name) || empty($email) || empty($phone) || empty($product)) {
        return new WP_Error(
            'missing_required_fields',
            'Please fill in all mandatory quotation fields (Name, Email, Phone, Product).',
            ['status' => 400]
        );
    }

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Please provide a valid business email address.', ['status' => 400]);
    }

    // 5. Save as quote_request Custom Post Type
    $title = sprintf('RFQ: %s - %s', $product, ($company ? $company : $name));
    $post_data = [
        'post_title'  => $title,
        'post_type'   => 'quote_request',
        'post_status' => 'publish',
    ];

    $inquiry_id = wp_insert_post($post_data);
    if (is_wp_error($inquiry_id)) {
        return new WP_Error('db_insert_error', 'Could not record quotation request. Please contact sales directly.', ['status' => 500]);
    }

    // 6. Save metadata
    update_post_meta($inquiry_id, 'contact_name', $name);
    update_post_meta($inquiry_id, 'company_name', $company);
    update_post_meta($inquiry_id, 'contact_email', $email);
    update_post_meta($inquiry_id, 'contact_phone', $phone);
    update_post_meta($inquiry_id, 'product_name', $product);
    update_post_meta($inquiry_id, 'cas_number', $cas);
    update_post_meta($inquiry_id, 'order_quantity', $quantity);
    update_post_meta($inquiry_id, 'technical_requirement', $notes);
    update_post_meta($inquiry_id, 'inquiry_status', 'unread');
    update_post_meta($inquiry_id, 'submission_ip', $client_ip);

    // 7. Dispatch notification email to management
    $recipient = get_option('aura_inquiry_recipient', 'management.aurachemicals@gmail.com');
    $subject   = sprintf('[Aura Chemicals RFQ #%d] %s (%s)', $inquiry_id, $product, ($company ?: $name));

    $message  = "A new commercial quotation request has been submitted through the portal:\n\n";
    $message .= "Reference ID: #RFQ-" . $inquiry_id . "\n";
    $message .= "Product Requested: " . $product . "\n";
    $message .= "CAS Number: " . ($cas ?: 'N/A') . "\n";
    $message .= "Target Quantity: " . ($quantity ?: 'Unspecified') . "\n\n";
    $message .= "Contact Person: " . $name . "\n";
    $message .= "Company / Firm: " . ($company ?: 'N/A') . "\n";
    $message .= "Email: " . $email . "\n";
    $message .= "Phone / WhatsApp: " . $phone . "\n\n";
    $message .= "Technical Notes / Specifications:\n" . ($notes ?: 'None provided') . "\n\n";
    $message .= "View in WordPress Admin: " . admin_url('post.php?post=' . $inquiry_id . '&action=edit') . "\n";

    $headers = [
        'From: Aura Portal <no-reply@aurachemicals.in>',
        'Reply-To: ' . $name . ' <' . $email . '>',
    ];

    @wp_mail($recipient, $subject, $message, $headers);

    return rest_ensure_response([
        'success'    => true,
        'message'    => 'Thank you. Your quotation inquiry has been recorded and transmitted to the sales desk.',
        'inquiry_id' => $inquiry_id,
    ]);
}

/**
 * Admin Columns for Quote Requests
 */
add_filter('manage_quote_request_posts_columns', function($columns) {
    return [
        'cb'             => $columns['cb'],
        'title'          => __('Reference / Title', 'aura-chemicals'),
        'rfq_name'       => __('Representative', 'aura-chemicals'),
        'rfq_company'    => __('Company', 'aura-chemicals'),
        'rfq_product'    => __('Product Required', 'aura-chemicals'),
        'rfq_quantity'   => __('Volume', 'aura-chemicals'),
        'rfq_status'     => __('Status', 'aura-chemicals'),
        'date'           => __('Date Received', 'aura-chemicals'),
    ];
});

add_action('manage_quote_request_posts_custom_column', function($column, $post_id) {
    switch ($column) {
        case 'rfq_name':
            echo esc_html(get_post_meta($post_id, 'contact_name', true) ?: '—');
            break;
        case 'rfq_company':
            echo esc_html(get_post_meta($post_id, 'company_name', true) ?: '—');
            break;
        case 'rfq_product':
            $prod = get_post_meta($post_id, 'product_name', true);
            $cas  = get_post_meta($post_id, 'cas_number', true);
            echo '<strong>' . esc_html($prod) . '</strong>';
            if ($cas) echo '<br><small style="color:#666;">CAS: ' . esc_html($cas) . '</small>';
            break;
        case 'rfq_quantity':
            echo esc_html(get_post_meta($post_id, 'order_quantity', true) ?: '—');
            break;
        case 'rfq_status':
            $status = get_post_meta($post_id, 'inquiry_status', true) ?: 'unread';
            $colors = [
                'unread'  => '#d63638',
                'handled' => '#00a32a',
                'pending' => '#dba617',
            ];
            $color = $colors[$status] ?? '#666';
            echo '<span style="font-weight:600; color:' . esc_attr($color) . '; text-transform:uppercase; font-size:11px;">' . esc_html($status) . '</span>';
            break;
    }
}, 10, 2);

/**
 * CSV Export for Quote Requests in Admin
 */
add_action('admin_action_aura_export_rfqs', function() {
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized');
    }

    $posts = get_posts([
        'post_type'      => 'quote_request',
        'posts_per_page' => -1,
        'post_status'    => 'any',
    ]);

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=aura_quotation_inquiries_' . date('Y-m-d') . '.csv');

    $output = fopen('php://output', 'w');
    fputcsv($output, ['ID', 'Date', 'Representative', 'Company', 'Email', 'Phone', 'Product', 'CAS', 'Quantity', 'Notes', 'Status']);

    foreach ($posts as $post) {
        fputcsv($output, [
            $post->ID,
            $post->post_date,
            get_post_meta($post->ID, 'contact_name', true),
            get_post_meta($post->ID, 'company_name', true),
            get_post_meta($post->ID, 'contact_email', true),
            get_post_meta($post->ID, 'contact_phone', true),
            get_post_meta($post->ID, 'product_name', true),
            get_post_meta($post->ID, 'cas_number', true),
            get_post_meta($post->ID, 'order_quantity', true),
            get_post_meta($post->ID, 'technical_requirement', true),
            get_post_meta($post->ID, 'inquiry_status', true) ?: 'unread',
        ]);
    }
    fclose($output);
    exit;
});

/**
 * Add Export Button to RFQ List Screen
 */
add_action('manage_posts_extra_tablenav', function($which) {
    global $typenow;
    if ($typenow === 'quote_request' && $which === 'top') {
        echo '<div class="alignleft actions">';
        echo '<a href="' . esc_url(admin_url('admin.php?action=aura_export_rfqs')) . '" class="button button-secondary" style="margin-left:8px;">' . esc_html__('Export Inquiries (CSV)', 'aura-chemicals') . '</a>';
        echo '</div>';
    }
});
