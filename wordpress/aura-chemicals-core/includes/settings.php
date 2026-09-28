<?php
defined('ABSPATH') || exit;

add_action('admin_menu', 'aura_register_settings_menu');
add_action('admin_init', 'aura_register_plugin_settings');
add_action('admin_enqueue_scripts', 'aura_settings_enqueue_assets');

/**
 * Enqueue WordPress Media Uploader for Hero/Logo image selection
 */
function aura_settings_enqueue_assets($hook) {
    if ('toplevel_page_aura-settings' === $hook) {
        wp_enqueue_media();
    }
}

/**
 * Register Top-Level Menu & Submenus in WP Admin
 */
function aura_register_settings_menu() {
    add_menu_page(
        __('Aura Frontend Control', 'aura-chemicals'),
        __('Aura Frontend', 'aura-chemicals'),
        'manage_options',
        'aura-settings',
        'aura_render_settings_page',
        'dashicons-layout',
        25
    );
}

/**
 * Register all settings in WordPress Options API
 */
function aura_register_plugin_settings() {
    $settings = [
        // Tab 1: Corporate & Identity
        'aura_legal_name',
        'aura_brand_name',
        'aura_group_name',
        'aura_roc_reg',
        'aura_cin_number',
        'aura_gstin_number',
        'aura_company_tagline',
        'aura_frontend_url',

        // Tab 2: Contact Channels
        'aura_company_phone',
        'aura_secondary_phone',
        'aura_whatsapp_number',
        'aura_company_email',
        'aura_sales_email',
        'aura_inquiry_recipient',
        'aura_registered_address',
        'aura_head_office_address',
        'aura_working_hours',

        // Tab 3: Branding & Logos
        'aura_header_logo_url',
        'aura_footer_logo_url',
        'aura_favicon_url',

        // Tab 4: Homepage Hero
        'aura_hero_eyebrow',
        'aura_hero_title',
        'aura_hero_description',
        'aura_hero_cta_primary_label',
        'aura_hero_cta_primary_url',
        'aura_hero_cta_secondary_label',
        'aura_hero_cta_secondary_url',
        'aura_hero_image_url',
        'aura_hero_image_alt',
        'aura_hero_capability_strip_enabled',

        // Tab 5: Performance Statistics
        'aura_stat_1_val',
        'aura_stat_1_label',
        'aura_stat_2_val',
        'aura_stat_2_label',
        'aura_stat_3_val',
        'aura_stat_3_label',
        'aura_stat_4_val',
        'aura_stat_4_label',

        // Tab 6: Strategic Pillars & Intro
        'aura_intro_heading',
        'aura_intro_body',
        'aura_services_heading',
        'aura_services_body',
        'aura_pillar_1_title',
        'aura_pillar_1_desc',
        'aura_pillar_2_title',
        'aura_pillar_2_desc',
        'aura_pillar_3_title',
        'aura_pillar_3_desc',
        'aura_pillar_4_title',
        'aura_pillar_4_desc',

        // Tab 7: About Us Page Content
        'aura_about_title',
        'aura_about_overview',
        'aura_about_business_overview',
        'aura_about_wcu_1_title',
        'aura_about_wcu_1_desc',
        'aura_about_wcu_2_title',
        'aura_about_wcu_2_desc',
        'aura_about_wcu_3_title',
        'aura_about_wcu_3_desc',
        'aura_about_wcu_4_title',
        'aura_about_wcu_4_desc',
        'aura_about_wcu_5_title',
        'aura_about_wcu_5_desc',
        'aura_about_vision',
        'aura_about_mission',
        'aura_about_sustainability',
        'aura_about_collaboration',

        // Tab 8: Our Mission Page Content
        'aura_mission_page_title',
        'aura_mission_hero_text',
        'aura_vision_hero_text',
        'aura_mission_gp_1_title',
        'aura_mission_gp_1_desc',
        'aura_mission_gp_2_title',
        'aura_mission_gp_2_desc',
        'aura_mission_gp_3_title',
        'aura_mission_gp_3_desc',
        'aura_mission_gp_4_title',
        'aura_mission_gp_4_desc',
        'aura_mission_vision_long',
        'aura_mission_inquiry_text',

        // Tab 9: Announcement & Global CTA
        'aura_announcement_enabled',
        'aura_announcement_text',
        'aura_announcement_url',
        'aura_cta_heading',
        'aura_cta_body',
        'aura_cta_button_label',
        'aura_cta_button_url',

        // Tab 10: Social & SEO
        'aura_social_linkedin',
        'aura_social_twitter',
        'aura_social_facebook',
        'aura_social_youtube',
        'aura_meta_title_suffix',
        'aura_default_meta_desc',
        'aura_footer_copyright',
        'aura_footer_tagline',
    ];

    foreach ($settings as $setting) {
        register_setting('aura_settings_group', $setting, [
            'sanitize_callback' => 'aura_sanitize_setting_field',
        ]);
    }
}

/**
 * Universal Sanitizer
 */
function aura_sanitize_setting_field($value) {
    if (is_array($value)) {
        return array_map('sanitize_text_field', $value);
    }
    return sanitize_text_field($value);
}

/**
 * Render the Tabbed Client Control Panel
 */
function aura_render_settings_page() {
    $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'corporate';
    $frontend_url = get_option('aura_frontend_url', 'http://localhost:3001');
    ?>
    <div class="wrap aura-control-wrap">
        <h1 style="display: flex; align-items: center; gap: 12px; font-weight: 700; color: #1F5A8C;">
            <span class="dashicons dashicons-layout" style="font-size: 32px; width: 32px; height: 32px; color: #1F5A8C;"></span>
            <?php _e('Aura Chemicals — Complete Frontend Control Center', 'aura-chemicals'); ?>
        </h1>
        <p style="font-size: 14px; color: #555; max-width: 960px; margin-bottom: 24px; line-height: 1.6;">
            <?php _e('Manage all visible frontend copy, contact channels, branding logos, homepage hero, live metrics, About Us / Mission narratives, global CTAs, and SEO for the React + Vite frontend.', 'aura-chemicals'); ?>
            <a href="<?php echo esc_url($frontend_url); ?>" target="_blank" class="button button-secondary" style="margin-left: 10px; font-weight: 600;">
                <?php _e('View Live Frontend ↗', 'aura-chemicals'); ?>
            </a>
        </p>

        <h2 class="nav-tab-wrapper" style="margin-bottom: 0;">
            <a href="?page=aura-settings&tab=corporate" class="nav-tab <?php echo $active_tab === 'corporate' ? 'nav-tab-active' : ''; ?>">
                <?php _e('🏢 Corporate & Legal', 'aura-chemicals'); ?>
            </a>
            <a href="?page=aura-settings&tab=contact" class="nav-tab <?php echo $active_tab === 'contact' ? 'nav-tab-active' : ''; ?>">
                <?php _e('📞 Contact Channels', 'aura-chemicals'); ?>
            </a>
            <a href="?page=aura-settings&tab=branding" class="nav-tab <?php echo $active_tab === 'branding' ? 'nav-tab-active' : ''; ?>">
                <?php _e('🎨 Logos & Branding', 'aura-chemicals'); ?>
            </a>
            <a href="?page=aura-settings&tab=hero" class="nav-tab <?php echo $active_tab === 'hero' ? 'nav-tab-active' : ''; ?>">
                <?php _e('🚀 Homepage Hero', 'aura-chemicals'); ?>
            </a>
            <a href="?page=aura-settings&tab=stats" class="nav-tab <?php echo $active_tab === 'stats' ? 'nav-tab-active' : ''; ?>">
                <?php _e('📊 Live Statistics', 'aura-chemicals'); ?>
            </a>
            <a href="?page=aura-settings&tab=pillars" class="nav-tab <?php echo $active_tab === 'pillars' ? 'nav-tab-active' : ''; ?>">
                <?php _e('🏛️ Pillars & Intro', 'aura-chemicals'); ?>
            </a>
            <a href="?page=aura-settings&tab=about" class="nav-tab <?php echo $active_tab === 'about' ? 'nav-tab-active' : ''; ?>">
                <?php _e('📖 About Us Page', 'aura-chemicals'); ?>
            </a>
            <a href="?page=aura-settings&tab=mission" class="nav-tab <?php echo $active_tab === 'mission' ? 'nav-tab-active' : ''; ?>">
                <?php _e('🎯 Our Mission Page', 'aura-chemicals'); ?>
            </a>
            <a href="?page=aura-settings&tab=cta" class="nav-tab <?php echo $active_tab === 'cta' ? 'nav-tab-active' : ''; ?>">
                <?php _e('📢 Announcement & CTA', 'aura-chemicals'); ?>
            </a>
            <a href="?page=aura-settings&tab=seo" class="nav-tab <?php echo $active_tab === 'seo' ? 'nav-tab-active' : ''; ?>">
                <?php _e('🌐 Social & SEO', 'aura-chemicals'); ?>
            </a>
            <a href="<?php echo admin_url('admin.php?page=aura-importer'); ?>" class="nav-tab" style="color: #1F5A8C; font-weight: 600;">
                <?php _e('⚡ 1-Click Catalog Seeder', 'aura-chemicals'); ?>
            </a>
        </h2>

        <form method="post" action="options.php" style="background: #ffffff; padding: 28px 36px; border: 1px solid #ccd0d4; border-top: none; box-shadow: 0 1px 3px rgba(0,0,0,.05);">
            <?php
            settings_fields('aura_settings_group');
            ?>

            <!-- TAB 1: Corporate & Legal -->
            <?php if ($active_tab === 'corporate'): ?>
                <div class="aura-tab-pane">
                    <h3 style="color: #1F5A8C; margin-top: 0;"><?php _e('Corporate Identity & Government Registrations', 'aura-chemicals'); ?></h3>
                    <p class="description"><?php _e('These details govern corporate identification across legal disclosures, header bars, footer columns, and compliance tabs.', 'aura-chemicals'); ?></p>
                    <table class="form-table">
                        <tr>
                            <th><label for="aura_brand_name"><?php _e('Brand Trading Name', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_brand_name" name="aura_brand_name" value="<?php echo esc_attr(get_option('aura_brand_name', 'Aura Chemicals')); ?>" class="regular-text" />
                                <p class="description"><?php _e('Short commercial brand displayed across the site (e.g. Aura Chemicals).', 'aura-chemicals'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_legal_name"><?php _e('Legal Corporate Entity', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_legal_name" name="aura_legal_name" value="<?php echo esc_attr(get_option('aura_legal_name', 'Aura Space Infra Private Limited')); ?>" class="regular-text" />
                                <p class="description"><?php _e('Official registered entity name per MCA/ROC records.', 'aura-chemicals'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_group_name"><?php _e('Corporate Group Name', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_group_name" name="aura_group_name" value="<?php echo esc_attr(get_option('aura_group_name', 'Aura Group of Companies')); ?>" class="regular-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_company_tagline"><?php _e('Brand Slogan / Tagline', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_company_tagline" name="aura_company_tagline" value="<?php echo esc_attr(get_option('aura_company_tagline', 'Your Trusted Partner in Chemical Excellence')); ?>" class="large-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_roc_reg"><?php _e('ROC Jurisdiction', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_roc_reg" name="aura_roc_reg" value="<?php echo esc_attr(get_option('aura_roc_reg', 'ROC Ahmedabad')); ?>" class="regular-text" />
                                <p class="description"><?php _e('Displayed in top bar and compliance notices (e.g. ROC Ahmedabad).', 'aura-chemicals'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_cin_number"><?php _e('Corporate Identity Number (CIN)', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_cin_number" name="aura_cin_number" value="<?php echo esc_attr(get_option('aura_cin_number', '')); ?>" class="regular-text" placeholder="U51909GJ2024PTC..." />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_gstin_number"><?php _e('GSTIN Tax Identification', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_gstin_number" name="aura_gstin_number" value="<?php echo esc_attr(get_option('aura_gstin_number', '')); ?>" class="regular-text" placeholder="24AAACA..." />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_frontend_url"><?php _e('Frontend React Application URL', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="url" id="aura_frontend_url" name="aura_frontend_url" value="<?php echo esc_attr(get_option('aura_frontend_url', 'http://localhost:3001')); ?>" class="regular-text" />
                                <p class="description"><?php _e('The local development or production domain where React is running. Used for preview links and CORS authorization.', 'aura-chemicals'); ?></p>
                            </td>
                        </tr>
                    </table>
                </div>
            <?php endif; ?>

            <!-- TAB 2: Contact Channels -->
            <?php if ($active_tab === 'contact'): ?>
                <div class="aura-tab-pane">
                    <h3 style="color: #1F5A8C; margin-top: 0;"><?php _e('Commercial Communication & Quotation Inboxes', 'aura-chemicals'); ?></h3>
                    <table class="form-table">
                        <tr>
                            <th><label for="aura_company_phone"><?php _e('Primary Direct Desk Phone', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_company_phone" name="aura_company_phone" value="<?php echo esc_attr(get_option('aura_company_phone', '+91 7220000877')); ?>" class="regular-text" />
                                <p class="description"><?php _e('Displayed in the header top bar, footer, and click-to-call buttons.', 'aura-chemicals'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_secondary_phone"><?php _e('Secondary Phone / Landline', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_secondary_phone" name="aura_secondary_phone" value="<?php echo esc_attr(get_option('aura_secondary_phone', '')); ?>" class="regular-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_whatsapp_number"><?php _e('Official WhatsApp Number', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_whatsapp_number" name="aura_whatsapp_number" value="<?php echo esc_attr(get_option('aura_whatsapp_number', '+91 7220000877')); ?>" class="regular-text" />
                                <p class="description"><?php _e('Used for 1-click WhatsApp chemical RFQ chat links.', 'aura-chemicals'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_company_email"><?php _e('Corporate Management Email', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="email" id="aura_company_email" name="aura_company_email" value="<?php echo esc_attr(get_option('aura_company_email', 'management.aurachemicals@gmail.com')); ?>" class="regular-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_sales_email"><?php _e('Sales & Commercial Email', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="email" id="aura_sales_email" name="aura_sales_email" value="<?php echo esc_attr(get_option('aura_sales_email', 'management.aurachemicals@gmail.com')); ?>" class="regular-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_inquiry_recipient"><?php _e('RFQ Quote Form Recipient Email', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="email" id="aura_inquiry_recipient" name="aura_inquiry_recipient" value="<?php echo esc_attr(get_option('aura_inquiry_recipient', 'management.aurachemicals@gmail.com')); ?>" class="regular-text" />
                                <p class="description"><?php _e('All quotation requests submitted through the frontend are dispatched to this inbox.', 'aura-chemicals'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_registered_address"><?php _e('Registered Legal Office Address', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_registered_address" name="aura_registered_address" rows="3" class="large-text"><?php echo esc_textarea(get_option('aura_registered_address', 'Ahmedabad, Gujarat, India')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_head_office_address"><?php _e('Corporate / Warehousing Address', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_head_office_address" name="aura_head_office_address" rows="3" class="large-text"><?php echo esc_textarea(get_option('aura_head_office_address', 'Aura Space Infra Pvt. Ltd., Ahmedabad, Gujarat, India')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_working_hours"><?php _e('Business Operating Hours', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_working_hours" name="aura_working_hours" value="<?php echo esc_attr(get_option('aura_working_hours', 'Monday – Saturday: 9:00 AM – 6:00 PM IST')); ?>" class="regular-text" />
                            </td>
                        </tr>
                    </table>
                </div>
            <?php endif; ?>

            <!-- TAB 3: Branding & Logos -->
            <?php if ($active_tab === 'branding'): ?>
                <div class="aura-tab-pane">
                    <h3 style="color: #1F5A8C; margin-top: 0;"><?php _e('Visual Branding, Logos & Media Assets', 'aura-chemicals'); ?></h3>
                    <p class="description"><?php _e('Upload brand assets directly using the WordPress Media Library.', 'aura-chemicals'); ?></p>
                    <table class="form-table">
                        <tr>
                            <th><label for="aura_header_logo_url"><?php _e('Header Brand Logo', 'aura-chemicals'); ?></label></th>
                            <td>
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <input type="text" id="aura_header_logo_url" name="aura_header_logo_url" value="<?php echo esc_attr(get_option('aura_header_logo_url', '/images/cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png')); ?>" class="large-text" />
                                    <button type="button" class="button aura-media-upload-btn" data-target="#aura_header_logo_url"><?php _e('Upload / Select', 'aura-chemicals'); ?></button>
                                </div>
                                <p class="description"><?php _e('Displayed on light navigation background. Transparent PNG or SVG recommended (approx 240px wide).', 'aura-chemicals'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_footer_logo_url"><?php _e('Footer Brand Logo', 'aura-chemicals'); ?></label></th>
                            <td>
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <input type="text" id="aura_footer_logo_url" name="aura_footer_logo_url" value="<?php echo esc_attr(get_option('aura_footer_logo_url', '/images/aura-chemicals-logo-white.png')); ?>" class="large-text" />
                                    <button type="button" class="button aura-media-upload-btn" data-target="#aura_footer_logo_url"><?php _e('Upload / Select', 'aura-chemicals'); ?></button>
                                </div>
                                <p class="description"><?php _e('Displayed on dark navy footer background. Light or white logo recommended.', 'aura-chemicals'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_favicon_url"><?php _e('Favicon / Site Icon', 'aura-chemicals'); ?></label></th>
                            <td>
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <input type="text" id="aura_favicon_url" name="aura_favicon_url" value="<?php echo esc_attr(get_option('aura_favicon_url', '/favicon.ico')); ?>" class="large-text" />
                                    <button type="button" class="button aura-media-upload-btn" data-target="#aura_favicon_url"><?php _e('Upload / Select', 'aura-chemicals'); ?></button>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            <?php endif; ?>

            <!-- TAB 4: Homepage Hero -->
            <?php if ($active_tab === 'hero'): ?>
                <div class="aura-tab-pane">
                    <h3 style="color: #1F5A8C; margin-top: 0;"><?php _e('Homepage Hero Section & Call to Actions', 'aura-chemicals'); ?></h3>
                    <table class="form-table">
                        <tr>
                            <th><label for="aura_hero_eyebrow"><?php _e('Eyebrow Badge Text', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_hero_eyebrow" name="aura_hero_eyebrow" value="<?php echo esc_attr(get_option('aura_hero_eyebrow', 'ISO 9001:2015 & NABL Audited Supply Chain')); ?>" class="large-text" />
                                <p class="description"><?php _e('Displays in small uppercase badge above main headline.', 'aura-chemicals'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_hero_title"><?php _e('Hero Main Headline (H1)', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_hero_title" name="aura_hero_title" value="<?php echo esc_attr(get_option('aura_hero_title', 'Aura Space Infra Pvt. Ltd.')); ?>" class="large-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_hero_description"><?php _e('Hero Subtitle / Description', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_hero_description" name="aura_hero_description" rows="3" class="large-text"><?php echo esc_textarea(get_option('aura_hero_description', 'Your Trusted Partner in Chemical Excellence. Dependable sourcing and distribution of Active Pharmaceutical Ingredients (APIs), specialty chemicals, and advanced NDT engineering inspection across India.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_hero_cta_primary_label"><?php _e('Primary CTA Button', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_hero_cta_primary_label" name="aura_hero_cta_primary_label" value="<?php echo esc_attr(get_option('aura_hero_cta_primary_label', 'Request a Quote')); ?>" class="regular-text" placeholder="Button Label" />
                                <input type="text" id="aura_hero_cta_primary_url" name="aura_hero_cta_primary_url" value="<?php echo esc_attr(get_option('aura_hero_cta_primary_url', '/get-a-quote')); ?>" class="regular-text" placeholder="URL (/get-a-quote)" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_hero_cta_secondary_label"><?php _e('Secondary CTA Button', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_hero_cta_secondary_label" name="aura_hero_cta_secondary_label" value="<?php echo esc_attr(get_option('aura_hero_cta_secondary_label', 'Browse Products (135 Items)')); ?>" class="regular-text" placeholder="Button Label" />
                                <input type="text" id="aura_hero_cta_secondary_url" name="aura_hero_cta_secondary_url" value="<?php echo esc_attr(get_option('aura_hero_cta_secondary_url', '/products')); ?>" class="regular-text" placeholder="URL (/products)" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_hero_image_url"><?php _e('Hero Visual Image', 'aura-chemicals'); ?></label></th>
                            <td>
                                <div style="display: flex; gap: 8px; align-items: center;">
                                    <input type="text" id="aura_hero_image_url" name="aura_hero_image_url" value="<?php echo esc_attr(get_option('aura_hero_image_url', '/images/pexels-pixabay-247763-scaled.jpg')); ?>" class="large-text" />
                                    <button type="button" class="button aura-media-upload-btn" data-target="#aura_hero_image_url"><?php _e('Upload / Select', 'aura-chemicals'); ?></button>
                                </div>
                                <p class="description"><?php _e('High-resolution chemical laboratory or industrial manufacturing photography.', 'aura-chemicals'); ?></p>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_hero_image_alt"><?php _e('Hero Image Alt Text', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_hero_image_alt" name="aura_hero_image_alt" value="<?php echo esc_attr(get_option('aura_hero_image_alt', 'Modern chemical and pharmaceutical laboratory facility')); ?>" class="large-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_hero_capability_strip_enabled"><?php _e('Capability Strip Display', 'aura-chemicals'); ?></label></th>
                            <td>
                                <label>
                                    <input type="checkbox" id="aura_hero_capability_strip_enabled" name="aura_hero_capability_strip_enabled" value="1" <?php checked(get_option('aura_hero_capability_strip_enabled', '1'), '1'); ?> />
                                    <?php _e('Show 5 chemical sector capability badges below the hero', 'aura-chemicals'); ?>
                                </label>
                            </td>
                        </tr>
                    </table>
                </div>
            <?php endif; ?>

            <!-- TAB 5: Live Statistics -->
            <?php if ($active_tab === 'stats'): ?>
                <div class="aura-tab-pane">
                    <h3 style="color: #1F5A8C; margin-top: 0;"><?php _e('Performance Statistics & KPI Counters', 'aura-chemicals'); ?></h3>
                    <p class="description"><?php _e('These numbers animate in real time on the homepage with smooth CountUp motion.', 'aura-chemicals'); ?></p>
                    <table class="form-table">
                        <tr>
                            <th><strong><?php _e('Statistic Counter #1', 'aura-chemicals'); ?></strong></th>
                            <td>
                                <input type="text" name="aura_stat_1_val" value="<?php echo esc_attr(get_option('aura_stat_1_val', '400+')); ?>" class="small-text" style="font-weight: 700; font-size: 16px;" />
                                <input type="text" name="aura_stat_1_label" value="<?php echo esc_attr(get_option('aura_stat_1_label', 'Domestic Suppliers Network')); ?>" class="regular-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><strong><?php _e('Statistic Counter #2', 'aura-chemicals'); ?></strong></th>
                            <td>
                                <input type="text" name="aura_stat_2_val" value="<?php echo esc_attr(get_option('aura_stat_2_val', '135')); ?>" class="small-text" style="font-weight: 700; font-size: 16px;" />
                                <input type="text" name="aura_stat_2_label" value="<?php echo esc_attr(get_option('aura_stat_2_label', 'Verified Chemical Catalog Products')); ?>" class="regular-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><strong><?php _e('Statistic Counter #3', 'aura-chemicals'); ?></strong></th>
                            <td>
                                <input type="text" name="aura_stat_3_val" value="<?php echo esc_attr(get_option('aura_stat_3_val', '7+')); ?>" class="small-text" style="font-weight: 700; font-size: 16px;" />
                                <input type="text" name="aura_stat_3_label" value="<?php echo esc_attr(get_option('aura_stat_3_label', 'Years in Distribution (Since 2014)')); ?>" class="regular-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><strong><?php _e('Statistic Counter #4', 'aura-chemicals'); ?></strong></th>
                            <td>
                                <input type="text" name="aura_stat_4_val" value="<?php echo esc_attr(get_option('aura_stat_4_val', '19')); ?>" class="small-text" style="font-weight: 700; font-size: 16px;" />
                                <input type="text" name="aura_stat_4_label" value="<?php echo esc_attr(get_option('aura_stat_4_label', 'Industrial Sectors Served')); ?>" class="regular-text" />
                            </td>
                        </tr>
                    </table>
                </div>
            <?php endif; ?>

            <!-- TAB 6: Strategic Pillars & Intro -->
            <?php if ($active_tab === 'pillars'): ?>
                <div class="aura-tab-pane">
                    <h3 style="color: #1F5A8C; margin-top: 0;"><?php _e('Company Introduction & Services Overview', 'aura-chemicals'); ?></h3>
                    <table class="form-table">
                        <tr>
                            <th><label for="aura_intro_heading"><?php _e('Company Intro Heading', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_intro_heading" name="aura_intro_heading" value="<?php echo esc_attr(get_option('aura_intro_heading', 'Aura Space Infra Pvt. Ltd. (Aura Chemicals)')); ?>" class="large-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_intro_body"><?php _e('Company Intro Narrative', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_intro_body" name="aura_intro_body" rows="4" class="large-text"><?php echo esc_textarea(get_option('aura_intro_body', 'A premier distributor and service provider of high-quality solvents and APIs for the pharmaceutical industry, agrochemicals, biotechnology, food and beverage, and cosmetics sectors. We specialize in sourcing and trading products that meet the strictest regulatory standards.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_services_heading"><?php _e('Services Section Heading', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_services_heading" name="aura_services_heading" value="<?php echo esc_attr(get_option('aura_services_heading', 'API & Solvent Distribution Network')); ?>" class="large-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_services_body"><?php _e('Services Section Narrative', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_services_body" name="aura_services_body" rows="3" class="large-text"><?php echo esc_textarea(get_option('aura_services_body', 'Assured quality and reliability in API distribution through 400+ leading suppliers across India, actively serving thousands of customers across diverse industries.')); ?></textarea>
                            </td>
                        </tr>
                    </table>

                    <hr />

                    <h3 style="color: #1F5A8C;"><?php _e('4 Strategic Supply Chain Pillars', 'aura-chemicals'); ?></h3>
                    <table class="form-table">
                        <tr>
                            <th><?php _e('Pillar 1: Product Range', 'aura-chemicals'); ?></th>
                            <td>
                                <input type="text" name="aura_pillar_1_title" value="<?php echo esc_attr(get_option('aura_pillar_1_title', 'Wide Range of Products')); ?>" class="regular-text" style="font-weight: 600;" /><br /><br />
                                <textarea name="aura_pillar_1_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_pillar_1_desc', 'Aura Chemicals offers a diverse portfolio of chemical solutions catering to various industries, from manufacturing to healthcare.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><?php _e('Pillar 2: Competitive Pricing', 'aura-chemicals'); ?></th>
                            <td>
                                <input type="text" name="aura_pillar_2_title" value="<?php echo esc_attr(get_option('aura_pillar_2_title', 'Competitive Pricing')); ?>" class="regular-text" style="font-weight: 600;" /><br /><br />
                                <textarea name="aura_pillar_2_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_pillar_2_desc', 'Experience affordability without compromising quality. Aura Chemicals offers competitive pricing accessible to businesses of all sizes.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><?php _e('Pillar 3: Reliable Logistics', 'aura-chemicals'); ?></th>
                            <td>
                                <input type="text" name="aura_pillar_3_title" value="<?php echo esc_attr(get_option('aura_pillar_3_title', 'Reliable Supply Chain')); ?>" class="regular-text" style="font-weight: 600;" /><br /><br />
                                <textarea name="aura_pillar_3_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_pillar_3_desc', 'Count on a consistent and reliable supply chain ensuring that your manufacturing operations run smoothly without interruption.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><?php _e('Pillar 4: Track Record', 'aura-chemicals'); ?></th>
                            <td>
                                <input type="text" name="aura_pillar_4_title" value="<?php echo esc_attr(get_option('aura_pillar_4_title', 'Extensive Network')); ?>" class="regular-text" style="font-weight: 600;" /><br /><br />
                                <textarea name="aura_pillar_4_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_pillar_4_desc', 'With over 7 years of specialized experience in API distribution since 2014, registered with the Registrar of Companies (ROC Ahmedabad).')); ?></textarea>
                            </td>
                        </tr>
                    </table>
                </div>
            <?php endif; ?>

            <!-- TAB 7: About Us Page Content -->
            <?php if ($active_tab === 'about'): ?>
                <div class="aura-tab-pane">
                    <h3 style="color: #1F5A8C; margin-top: 0;"><?php _e('About Us Page Narrative & Core Values', 'aura-chemicals'); ?></h3>
                    <p class="description"><?php _e('Every text block on the /about-us route is populated dynamically from these fields.', 'aura-chemicals'); ?></p>
                    <table class="form-table">
                        <tr>
                            <th><label for="aura_about_title"><?php _e('About Us Page Title', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_about_title" name="aura_about_title" value="<?php echo esc_attr(get_option('aura_about_title', 'About Us')); ?>" class="regular-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_about_overview"><?php _e('Executive Overview', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_about_overview" name="aura_about_overview" rows="4" class="large-text"><?php echo esc_textarea(get_option('aura_about_overview', 'At Aura Space Infra Private Limited, we are a trusted partner in the pharmaceutical and industrial chemical trading sector. With over a decade of industry expertise, we specialize in supplying high-purity Active Pharmaceutical Ingredients (APIs), intermediates, and specialty chemicals that comply with rigorous regulatory standards across pharmaceuticals, agrochemicals, biotechnology, and allied industries.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_about_business_overview"><?php _e('Business Model & Solvents Trading', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_about_business_overview" name="aura_about_business_overview" rows="4" class="large-text"><?php echo esc_textarea(get_option('aura_about_business_overview', 'Aura Space Infra Private Limited is a premier distributor and service provider of a wide range of high-quality solvents and APIs for the pharmaceutical industry, as well as other key sectors such as agrochemicals, biotechnology, food and beverage, and cosmetics. We specialize in sourcing and trading products that meet the strictest regulatory standards while catering to the ever-evolving demands of our diverse client base.')); ?></textarea>
                            </td>
                        </tr>
                    </table>

                    <hr />

                    <h3 style="color: #1F5A8C;"><?php _e('5 Pillars: "Why Choose Aura Space Infra"', 'aura-chemicals'); ?></h3>
                    <table class="form-table">
                        <tr>
                            <th><?php _e('1. Reliable Sourcing', 'aura-chemicals'); ?></th>
                            <td>
                                <input type="text" name="aura_about_wcu_1_title" value="<?php echo esc_attr(get_option('aura_about_wcu_1_title', 'Reliable Sourcing')); ?>" class="regular-text" style="font-weight: 600;" /><br /><br />
                                <textarea name="aura_about_wcu_1_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_about_wcu_1_desc', 'Strong relationships with leading domestic manufacturers to ensure the highest quality products.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><?php _e('2. Regulatory Compliance', 'aura-chemicals'); ?></th>
                            <td>
                                <input type="text" name="aura_about_wcu_2_title" value="<?php echo esc_attr(get_option('aura_about_wcu_2_title', 'Regulatory Compliance')); ?>" class="regular-text" style="font-weight: 600;" /><br /><br />
                                <textarea name="aura_about_wcu_2_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_about_wcu_2_desc', 'Strict compliance with global regulatory standards (IP, BP, USP, EP).')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><?php _e('3. Diverse Product Portfolio', 'aura-chemicals'); ?></th>
                            <td>
                                <input type="text" name="aura_about_wcu_3_title" value="<?php echo esc_attr(get_option('aura_about_wcu_3_title', 'Diverse Product Portfolio')); ?>" class="regular-text" style="font-weight: 600;" /><br /><br />
                                <textarea name="aura_about_wcu_3_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_about_wcu_3_desc', 'Wide range of solvents, APIs, and phosphates suitable for diverse industrial applications.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><?php _e('4. Customer-Centric Service', 'aura-chemicals'); ?></th>
                            <td>
                                <input type="text" name="aura_about_wcu_4_title" value="<?php echo esc_attr(get_option('aura_about_wcu_4_title', 'Customer-Centric Service')); ?>" class="regular-text" style="font-weight: 600;" /><br /><br />
                                <textarea name="aura_about_wcu_4_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_about_wcu_4_desc', 'Dedicated technical desk providing tailored chemical procurement solutions.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><?php _e('5. Timely Delivery', 'aura-chemicals'); ?></th>
                            <td>
                                <input type="text" name="aura_about_wcu_5_title" value="<?php echo esc_attr(get_option('aura_about_wcu_5_title', 'Timely Delivery')); ?>" class="regular-text" style="font-weight: 600;" /><br /><br />
                                <textarea name="aura_about_wcu_5_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_about_wcu_5_desc', 'Prioritizing on-time delivery to prevent supply chain disruptions.')); ?></textarea>
                            </td>
                        </tr>
                    </table>

                    <hr />

                    <h3 style="color: #1F5A8C;"><?php _e('Strategic Corporate Directives', 'aura-chemicals'); ?></h3>
                    <table class="form-table">
                        <tr>
                            <th><label for="aura_about_vision"><?php _e('Corporate Vision Statement', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_about_vision" name="aura_about_vision" rows="3" class="large-text"><?php echo esc_textarea(get_option('aura_about_vision', 'At Aura Space Infra Private Limited, our vision is to be the leading trading company in the API and chemical sector, recognized for delivering exceptional products and services. We aim to provide value to our clients by sourcing and trading high-quality materials that support innovation and growth.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_about_mission"><?php _e('Corporate Mission Statement', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_about_mission" name="aura_about_mission" rows="3" class="large-text"><?php echo esc_textarea(get_option('aura_about_mission', 'Our mission is to provide reliable, cost-effective, and high-quality solutions to our clients. We strive to be the trusted partner of choice in the API and chemical distribution industry, continuously expanding our product offerings and services to meet the growing needs of the markets we serve.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_about_sustainability"><?php _e('Environmental & Sustainability Policy', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_about_sustainability" name="aura_about_sustainability" rows="3" class="large-text"><?php echo esc_textarea(get_option('aura_about_sustainability', 'Sustainability is at the core of our business practices. We ensure that the products we trade are environmentally responsible and aligned with global standards for safety and sustainability. We actively work to reduce our carbon footprint across our distribution operations.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_about_collaboration"><?php _e('Collaboration & Industry Partnership', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_about_collaboration" name="aura_about_collaboration" rows="3" class="large-text"><?php echo esc_textarea(get_option('aura_about_collaboration', 'At Aura Space Infra Pvt Ltd, we believe in the power of collaboration. We work closely with our clients, suppliers, and partners to foster innovation and drive sustainable growth.')); ?></textarea>
                            </td>
                        </tr>
                    </table>
                </div>
            <?php endif; ?>

            <!-- TAB 8: Our Mission Page Content -->
            <?php if ($active_tab === 'mission'): ?>
                <div class="aura-tab-pane">
                    <h3 style="color: #1F5A8C; margin-top: 0;"><?php _e('Our Mission & Guiding Principles', 'aura-chemicals'); ?></h3>
                    <p class="description"><?php _e('Controls every narrative block on the /our-mission route.', 'aura-chemicals'); ?></p>
                    <table class="form-table">
                        <tr>
                            <th><label for="aura_mission_page_title"><?php _e('Page Heading Title', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_mission_page_title" name="aura_mission_page_title" value="<?php echo esc_attr(get_option('aura_mission_page_title', 'Our Mission')); ?>" class="regular-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_mission_hero_text"><?php _e('Core Mission Statement', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_mission_hero_text" name="aura_mission_hero_text" rows="4" class="large-text"><?php echo esc_textarea(get_option('aura_mission_hero_text', 'At Aura Space Infra Private Limited (Aura Chemicals), our mission is to empower global pharmaceutical innovation and industrial manufacturing by providing high-purity chemical compounds, reliable supply chain solutions, and uncompromising regulatory integrity.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_vision_hero_text"><?php _e('Core Vision Statement', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_vision_hero_text" name="aura_vision_hero_text" rows="4" class="large-text"><?php echo esc_textarea(get_option('aura_vision_hero_text', 'To be recognized as India\'s most trusted and technically proficient chemical distribution partner, pioneering sustainable sourcing networks and setting benchmarks for transparency, speed, and safety in global chemical commerce.')); ?></textarea>
                            </td>
                        </tr>
                    </table>

                    <hr />

                    <h3 style="color: #1F5A8C;"><?php _e('4 Guiding Principles', 'aura-chemicals'); ?></h3>
                    <table class="form-table">
                        <tr>
                            <th><?php _e('Principle 1: Quality', 'aura-chemicals'); ?></th>
                            <td>
                                <input type="text" name="aura_mission_gp_1_title" value="<?php echo esc_attr(get_option('aura_mission_gp_1_title', 'Uncompromising Quality')); ?>" class="regular-text" style="font-weight: 600;" /><br /><br />
                                <textarea name="aura_mission_gp_1_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_mission_gp_1_desc', 'Every chemical batch is backed by certified manufacturer analyses, verifying exact assay levels, purity thresholds, and regulatory compliance.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><?php _e('Principle 2: Regulatory', 'aura-chemicals'); ?></th>
                            <td>
                                <input type="text" name="aura_mission_gp_2_title" value="<?php echo esc_attr(get_option('aura_mission_gp_2_title', 'Regulatory Rigor')); ?>" class="regular-text" style="font-weight: 600;" /><br /><br />
                                <textarea name="aura_mission_gp_2_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_mission_gp_2_desc', 'Strict adherence to national and international pharmacopeias (IP, BP, USP, EP) with end-to-end audit traceability.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><?php _e('Principle 3: Transparency', 'aura-chemicals'); ?></th>
                            <td>
                                <input type="text" name="aura_mission_gp_3_title" value="<?php echo esc_attr(get_option('aura_mission_gp_3_title', 'Transparent Partnerships')); ?>" class="regular-text" style="font-weight: 600;" /><br /><br />
                                <textarea name="aura_mission_gp_3_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_mission_gp_3_desc', 'Open technical communication, competitive market pricing, and dedicated client desk support across all commercial stages.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><?php _e('Principle 4: Stewardship', 'aura-chemicals'); ?></th>
                            <td>
                                <input type="text" name="aura_mission_gp_4_title" value="<?php echo esc_attr(get_option('aura_mission_gp_4_title', 'Environmental Stewardship')); ?>" class="regular-text" style="font-weight: 600;" /><br /><br />
                                <textarea name="aura_mission_gp_4_desc" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_mission_gp_4_desc', 'Promoting responsible storage, compliant eco-packaging, and low-emission logistics to protect ecosystems and future generations.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_mission_vision_long"><?php _e('Long-Term Vision Statement', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_mission_vision_long" name="aura_mission_vision_long" rows="3" class="large-text"><?php echo esc_textarea(get_option('aura_mission_vision_long', 'Expanding our direct manufacturing partnerships across Asia, Europe, and the Americas to offer an integrated global chemical supply network while investing in continuous quality verification.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_mission_inquiry_text"><?php _e('Inquiry Desk Assistance Text', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_mission_inquiry_text" name="aura_mission_inquiry_text" rows="2" class="large-text"><?php echo esc_textarea(get_option('aura_mission_inquiry_text', 'Our dedicated technical consultation desk is available to assist your procurement team with specific pharmacopeial grades, custom packaging, and bulk allocation schedules.')); ?></textarea>
                            </td>
                        </tr>
                    </table>
                </div>
            <?php endif; ?>

            <!-- TAB 9: Announcement & Global CTA -->
            <?php if ($active_tab === 'cta'): ?>
                <div class="aura-tab-pane">
                    <h3 style="color: #1F5A8C; margin-top: 0;"><?php _e('Site-Wide Top Announcement Banner', 'aura-chemicals'); ?></h3>
                    <table class="form-table">
                        <tr>
                            <th><label for="aura_announcement_enabled"><?php _e('Enable Announcement Bar', 'aura-chemicals'); ?></label></th>
                            <td>
                                <label>
                                    <input type="checkbox" id="aura_announcement_enabled" name="aura_announcement_enabled" value="1" <?php checked(get_option('aura_announcement_enabled', '0'), '1'); ?> />
                                    <?php _e('Display an urgent notice / announcement bar at the very top of all pages', 'aura-chemicals'); ?>
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_announcement_text"><?php _e('Announcement Text Message', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_announcement_text" name="aura_announcement_text" value="<?php echo esc_attr(get_option('aura_announcement_text', 'Now accepting technical RFQ submissions for high-purity pharma APIs and industrial solvent allocations.')); ?>" class="large-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_announcement_url"><?php _e('Announcement Target URL', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_announcement_url" name="aura_announcement_url" value="<?php echo esc_attr(get_option('aura_announcement_url', '/get-a-quote')); ?>" class="regular-text" placeholder="/get-a-quote" />
                            </td>
                        </tr>
                    </table>

                    <hr />

                    <h3 style="color: #1F5A8C;"><?php _e('Global Pre-Footer Call to Action Band', 'aura-chemicals'); ?></h3>
                    <table class="form-table">
                        <tr>
                            <th><label for="aura_cta_heading"><?php _e('Global CTA Headline', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_cta_heading" name="aura_cta_heading" value="<?php echo esc_attr(get_option('aura_cta_heading', 'Join Us on the Journey to Excellence')); ?>" class="large-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_cta_body"><?php _e('Global CTA Description', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_cta_body" name="aura_cta_body" rows="3" class="large-text"><?php echo esc_textarea(get_option('aura_cta_body', 'Whether you are a small-scale enterprise or a large industrial manufacturer, Aura Chemicals invites you to partner with us for chemical excellence.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_cta_button_label"><?php _e('Button Label & Link', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_cta_button_label" name="aura_cta_button_label" value="<?php echo esc_attr(get_option('aura_cta_button_label', 'Explore Products')); ?>" class="regular-text" placeholder="Explore Products" />
                                <input type="text" id="aura_cta_button_url" name="aura_cta_button_url" value="<?php echo esc_attr(get_option('aura_cta_button_url', '/products')); ?>" class="regular-text" placeholder="/products" />
                            </td>
                        </tr>
                    </table>
                </div>
            <?php endif; ?>

            <!-- TAB 10: Social & SEO -->
            <?php if ($active_tab === 'seo'): ?>
                <div class="aura-tab-pane">
                    <h3 style="color: #1F5A8C; margin-top: 0;"><?php _e('Social Media Channels & Profiles', 'aura-chemicals'); ?></h3>
                    <table class="form-table">
                        <tr>
                            <th><label for="aura_social_linkedin"><?php _e('LinkedIn Corporate URL', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="url" id="aura_social_linkedin" name="aura_social_linkedin" value="<?php echo esc_attr(get_option('aura_social_linkedin', 'https://linkedin.com')); ?>" class="large-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_social_twitter"><?php _e('Twitter / X Profile URL', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="url" id="aura_social_twitter" name="aura_social_twitter" value="<?php echo esc_attr(get_option('aura_social_twitter', '')); ?>" class="large-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_social_facebook"><?php _e('Facebook Page URL', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="url" id="aura_social_facebook" name="aura_social_facebook" value="<?php echo esc_attr(get_option('aura_social_facebook', '')); ?>" class="large-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_social_youtube"><?php _e('YouTube Channel URL', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="url" id="aura_social_youtube" name="aura_social_youtube" value="<?php echo esc_attr(get_option('aura_social_youtube', '')); ?>" class="large-text" />
                            </td>
                        </tr>
                    </table>

                    <hr />

                    <h3 style="color: #1F5A8C;"><?php _e('Global Meta & Footer Customization', 'aura-chemicals'); ?></h3>
                    <table class="form-table">
                        <tr>
                            <th><label for="aura_meta_title_suffix"><?php _e('Page Title Suffix', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_meta_title_suffix" name="aura_meta_title_suffix" value="<?php echo esc_attr(get_option('aura_meta_title_suffix', 'Aura Chemicals | Active Pharmaceutical Ingredients')); ?>" class="large-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_default_meta_desc"><?php _e('Default Meta Description', 'aura-chemicals'); ?></label></th>
                            <td>
                                <textarea id="aura_default_meta_desc" name="aura_default_meta_desc" rows="3" class="large-text"><?php echo esc_textarea(get_option('aura_default_meta_desc', 'Aura Space Infra Pvt. Ltd. (Aura Chemicals) supplies high-purity Active Pharmaceutical Ingredients (APIs), specialty solvents, and NDT engineering inspection across India.')); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_footer_copyright"><?php _e('Footer Copyright Notice', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_footer_copyright" name="aura_footer_copyright" value="<?php echo esc_attr(get_option('aura_footer_copyright', 'Copyright © ' . date('Y') . ' Aura Space Infra Pvt. Ltd. All rights reserved.')); ?>" class="large-text" />
                            </td>
                        </tr>
                        <tr>
                            <th><label for="aura_footer_tagline"><?php _e('Footer Regulatory Tagline', 'aura-chemicals'); ?></label></th>
                            <td>
                                <input type="text" id="aura_footer_tagline" name="aura_footer_tagline" value="<?php echo esc_attr(get_option('aura_footer_tagline', 'ROC Ahmedabad Registered · Non-Government Industrial Supply Enterprise')); ?>" class="large-text" />
                            </td>
                        </tr>
                    </table>
                </div>
            <?php endif; ?>

            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e5e5e5; display: flex; align-items: center; justify-content: space-between;">
                <?php submit_button(__('Save Changes to Frontend', 'aura-chemicals'), 'primary button-hero', 'submit', false); ?>
                <span style="color: #666; font-size: 13px;">
                    <?php _e('All saved changes update the REST API in real time.', 'aura-chemicals'); ?>
                </span>
            </div>
        </form>
    </div>

    <script>
    jQuery(document).ready(function($){
        $('.aura-media-upload-btn').on('click', function(e){
            e.preventDefault();
            var targetInput = $($(this).data('target'));
            var frame = wp.media({
                title: 'Select or Upload Brand Asset',
                button: { text: 'Use this Image' },
                multiple: false
            });
            frame.on('select', function(){
                var attachment = frame.state().get('selection').first().toJSON();
                targetInput.val(attachment.url);
            });
            frame.open();
        });
    });
    </script>
    <?php
}
