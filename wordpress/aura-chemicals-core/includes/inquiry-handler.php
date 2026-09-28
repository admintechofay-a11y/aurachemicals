<?php
defined('ABSPATH') || exit;

/**
 * Handle incoming RFQ quote submissions from React Frontend
 */
function aura_handle_inquiry_submission(WP_REST_Request $request) {
    $params = $request->get_json_params() ?: $request->get_body_params();

    // 1. Honeypot check
    if (!empty($params['website_url_hp'])) {
        // Silent rejection for bots
        return rest_ensure_response([
            'success'    => true,
            'message'    => 'Inquiry received successfully.',
            'inquiry_id' => 9999,
        ]);
    }

    // 2. Validate required fields
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

    // 3. Save as quote_request Custom Post Type
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

    // 4. Save metadata
    update_post_meta($inquiry_id, 'contact_name', $name);
    update_post_meta($inquiry_id, 'company_name', $company);
    update_post_meta($inquiry_id, 'contact_email', $email);
    update_post_meta($inquiry_id, 'contact_phone', $phone);
    update_post_meta($inquiry_id, 'product_name', $product);
    update_post_meta($inquiry_id, 'cas_number', $cas);
    update_post_meta($inquiry_id, 'order_quantity', $quantity);
    update_post_meta($inquiry_id, 'technical_requirement', $notes);
    update_post_meta($inquiry_id, 'inquiry_status', 'pending');

    // 5. Send notification email to management
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
