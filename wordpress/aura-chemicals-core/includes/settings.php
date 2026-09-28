<?php
defined('ABSPATH') || exit;

add_action('admin_menu', 'aura_register_settings_menu');
add_action('admin_init', 'aura_register_plugin_settings');

function aura_register_settings_menu() {
    add_menu_page(
        __('Aura Settings', 'aura-chemicals'),
        __('Aura Settings', 'aura-chemicals'),
        'manage_options',
        'aura-settings',
        'aura_render_settings_page',
        'dashicons-admin-settings',
        80
    );
}

function aura_register_plugin_settings() {
    $settings = [
        'aura_company_phone',
        'aura_company_email',
        'aura_legal_name',
        'aura_brand_name',
        'aura_roc_reg',
        'aura_experience_years',
        'aura_supplier_count',
        'aura_frontend_url',
        'aura_inquiry_recipient',
    ];

    foreach ($settings as $setting) {
        register_setting('aura_settings_group', $setting);
    }
}

function aura_render_settings_page() {
    ?>
    <div class="wrap">
        <h1><?php _e('Aura Chemicals — Headless Configuration', 'aura-chemicals'); ?></h1>
        <p><?php _e('Manage corporate parameters exposed to the React frontend via /wp-json/aura/v1/settings.', 'aura-chemicals'); ?></p>

        <form method="post" action="options.php">
            <?php
            settings_fields('aura_settings_group');
            do_settings_sections('aura_settings_group');
            ?>
            <table class="form-table">
                <tr>
                    <th><label for="aura_company_phone"><?php _e('Corporate Phone', 'aura-chemicals'); ?></label></th>
                    <td><input type="text" id="aura_company_phone" name="aura_company_phone" value="<?php echo esc_attr(get_option('aura_company_phone', '+91 7220000877')); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th><label for="aura_company_email"><?php _e('Corporate Email', 'aura-chemicals'); ?></label></th>
                    <td><input type="email" id="aura_company_email" name="aura_company_email" value="<?php echo esc_attr(get_option('aura_company_email', 'management.aurachemicals@gmail.com')); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th><label for="aura_legal_name"><?php _e('Legal Corporate Entity', 'aura-chemicals'); ?></label></th>
                    <td><input type="text" id="aura_legal_name" name="aura_legal_name" value="<?php echo esc_attr(get_option('aura_legal_name', 'Aura Space Infra Private Limited')); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th><label for="aura_brand_name"><?php _e('Brand Name', 'aura-chemicals'); ?></label></th>
                    <td><input type="text" id="aura_brand_name" name="aura_brand_name" value="<?php echo esc_attr(get_option('aura_brand_name', 'Aura Chemicals')); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th><label for="aura_roc_reg"><?php _e('ROC Registration Jurisdiction', 'aura-chemicals'); ?></label></th>
                    <td><input type="text" id="aura_roc_reg" name="aura_roc_reg" value="<?php echo esc_attr(get_option('aura_roc_reg', 'ROC Ahmedabad')); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th><label for="aura_experience_years"><?php _e('Market Experience Text', 'aura-chemicals'); ?></label></th>
                    <td><input type="text" id="aura_experience_years" name="aura_experience_years" value="<?php echo esc_attr(get_option('aura_experience_years', '7+ Years')); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th><label for="aura_frontend_url"><?php _e('Frontend URL (React Vite)', 'aura-chemicals'); ?></label></th>
                    <td><input type="url" id="aura_frontend_url" name="aura_frontend_url" value="<?php echo esc_attr(get_option('aura_frontend_url', 'http://localhost:3001')); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th><label for="aura_inquiry_recipient"><?php _e('RFQ Recipient Email', 'aura-chemicals'); ?></label></th>
                    <td><input type="email" id="aura_inquiry_recipient" name="aura_inquiry_recipient" value="<?php echo esc_attr(get_option('aura_inquiry_recipient', 'management.aurachemicals@gmail.com')); ?>" class="regular-text" /></td>
                </tr>
            </table>

            <?php submit_button(__('Save Aura Settings', 'aura-chemicals')); ?>
        </form>
    </div>
    <?php
}
