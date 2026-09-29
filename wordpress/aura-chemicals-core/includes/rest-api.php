<?php
defined('ABSPATH') || exit;

add_action('rest_api_init', 'aura_register_rest_routes');
add_action('init', 'aura_handle_cors_preflight');

/**
 * Handle CORS preflight requests dynamically
 */
function aura_handle_cors_preflight() {
    $origin = get_http_origin();
    $allowed_frontend = get_option('aura_frontend_url', 'http://localhost:3001');

    if ($origin) {
        header("Access-Control-Allow-Origin: " . esc_url_raw($origin));
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
    } elseif ($allowed_frontend) {
        header("Access-Control-Allow-Origin: " . esc_url_raw($allowed_frontend));
    }

    if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
        status_header(200);
        exit();
    }
}

/**
 * Register custom REST API endpoints under /wp-json/aura/v1/
 */
function aura_register_rest_routes() {
    $namespace = 'aura/v1';

    // 1. Settings (Corporate profile, contact channels, global branding)
    register_rest_route($namespace, '/settings', [
        'methods'             => 'GET',
        'callback'            => 'aura_rest_get_settings',
        'permission_callback' => '__return_true',
    ]);

    // 2. Home Aggregated (Hero, Intro, Pillars, Counters, Clientele, Global CTA)
    register_rest_route($namespace, '/home', [
        'methods'             => 'GET',
        'callback'            => 'aura_rest_get_home',
        'permission_callback' => '__return_true',
    ]);

    // 3. Page by slug
    register_rest_route($namespace, '/pages/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods'             => 'GET',
        'callback'            => 'aura_rest_get_page',
        'permission_callback' => '__return_true',
    ]);

    // 4. Products List
    register_rest_route($namespace, '/products', [
        'methods'             => 'GET',
        'callback'            => 'aura_rest_get_products',
        'permission_callback' => '__return_true',
    ]);

    // 5. Product by slug
    register_rest_route($namespace, '/products/(?P<slug>[a-zA-Z0-9-]+)', [
        'methods'             => 'GET',
        'callback'            => 'aura_rest_get_product_by_slug',
        'permission_callback' => '__return_true',
    ]);

    // 6. Product Categories
    register_rest_route($namespace, '/product-categories', [
        'methods'             => 'GET',
        'callback'            => 'aura_rest_get_categories',
        'permission_callback' => '__return_true',
    ]);

    // 7. Industries
    register_rest_route($namespace, '/industries', [
        'methods'             => 'GET',
        'callback'            => 'aura_rest_get_industries',
        'permission_callback' => '__return_true',
    ]);

    // 8. Services
    register_rest_route($namespace, '/services', [
        'methods'             => 'GET',
        'callback'            => 'aura_rest_get_services',
        'permission_callback' => '__return_true',
    ]);

    // 9. Inquiries (RFQ submission)
    register_rest_route($namespace, '/inquiries', [
        'methods'             => 'POST',
        'callback'            => 'aura_handle_inquiry_submission',
        'permission_callback' => '__return_true',
    ]);
}

/**
 * 1. Global Settings Endpoint
 * Merges JSON baseline with all client modifications made in WP Admin
 */
function aura_rest_get_settings() {
    $settings_file = AURA_CORE_PATH . 'data/settings.json';
    $settings = file_exists($settings_file) ? json_decode(file_get_contents($settings_file), true) : [];

    if (!isset($settings['company'])) {
        $settings['company'] = [];
    }

    // Dynamic Client Controlled Corporate Options
    $settings['company']['brand_name']          = get_option('aura_brand_name', $settings['company']['brand_name'] ?? 'Aura Chemicals');
    $settings['company']['legal_name']          = get_option('aura_legal_name', $settings['company']['legal_name'] ?? 'Aura Space Infra Private Limited');
    $settings['company']['group_name']          = get_option('aura_group_name', $settings['company']['group_name'] ?? 'Aura Group of Companies');
    $settings['company']['tagline']             = get_option('aura_company_tagline', 'Your Trusted Partner in Chemical Excellence');
    $settings['company']['roc_registration']    = get_option('aura_roc_reg', $settings['company']['roc_registration'] ?? 'ROC Ahmedabad');
    $settings['company']['cin']                 = get_option('aura_cin_number', '');
    $settings['company']['gstin']               = get_option('aura_gstin_number', '');
    $settings['company']['phone']               = get_option('aura_company_phone', $settings['company']['phone'] ?? '+91 7220000877');
    $settings['company']['secondary_phone']     = get_option('aura_secondary_phone', '');
    $settings['company']['whatsapp']            = get_option('aura_whatsapp_number', '+91 7220000877');
    $settings['company']['email']               = get_option('aura_company_email', $settings['company']['email'] ?? 'management.aurachemicals@gmail.com');
    $settings['company']['sales_email']         = get_option('aura_sales_email', 'management.aurachemicals@gmail.com');
    $settings['company']['registered_address']  = get_option('aura_registered_address', 'Ahmedabad, Gujarat, India');
    $settings['company']['head_office_address'] = get_option('aura_head_office_address', 'Aura Space Infra Pvt. Ltd., Ahmedabad, Gujarat, India');
    $settings['company']['business_hours']      = get_option('aura_working_hours', 'Monday – Saturday: 9:00 AM – 6:00 PM IST');
    $settings['company']['experience_years']    = get_option('aura_stat_3_val', $settings['company']['experience_years'] ?? '7+ Years');
    $settings['company']['supplier_count']      = intval(get_option('aura_stat_1_val', $settings['company']['supplier_count'] ?? 400));
    $settings['company']['frontend_url']        = get_option('aura_frontend_url', 'http://localhost:3001');

    $settings['company']['social_links'] = [
        ['platform' => 'linkedin', 'url' => get_option('aura_social_linkedin', 'https://linkedin.com')],
        ['platform' => 'twitter',  'url' => get_option('aura_social_twitter', '')],
        ['platform' => 'facebook', 'url' => get_option('aura_social_facebook', '')],
        ['platform' => 'youtube',  'url' => get_option('aura_social_youtube', '')],
    ];

    // Client controlled branding logos
    if (!isset($settings['branding'])) {
        $settings['branding'] = [];
    }
    $header_logo = get_option('aura_header_logo_url');
    if ($header_logo) {
        $settings['branding']['header_logo'] = [
            'url' => esc_url_raw($header_logo),
            'alt' => get_option('aura_brand_name', 'Aura Chemicals'),
        ];
    }
    $footer_logo = get_option('aura_footer_logo_url');
    if (!$footer_logo || strpos($footer_logo, 'aura-chemicals-logo-white') !== false || strpos($footer_logo, 'aa6efd8e') !== false) {
        $footer_logo = '/images/cropped-Orange_Gray_Modern_Elegant_Corporate_Business_Card-removebg-preview-1-1.png';
        update_option('aura_footer_logo_url', $footer_logo);
    }
    $settings['branding']['footer_logo'] = [
        'url' => esc_url_raw($footer_logo),
        'alt' => get_option('aura_brand_name', 'Aura Chemicals'),
    ];

    // Client controlled announcement banner
    $settings['announcement'] = [
        'enabled' => get_option('aura_announcement_enabled', '0') === '1',
        'text'    => get_option('aura_announcement_text', 'Now accepting technical RFQ submissions for high-purity pharma APIs and industrial solvent allocations.'),
        'url'     => get_option('aura_announcement_url', '/get-a-quote'),
    ];

    $settings['footer'] = [
        'copyright_text' => get_option('aura_footer_copyright', 'Copyright © ' . date('Y') . ' Aura Space Infra Pvt. Ltd. All rights reserved.'),
        'tagline'        => get_option('aura_footer_tagline', 'ROC Ahmedabad Registered · Non-Government Industrial Supply Enterprise'),
        'powered_by'     => 'TECHOFY Global Ventures',
    ];

    return rest_ensure_response($settings);
}

/**
 * 2. Homepage Aggregated Endpoint
 * Returns all client-customized homepage sections from WordPress options
 */
function aura_rest_get_home() {
    $home = [
        'hero' => [
            'eyebrow'       => get_option('aura_hero_eyebrow', 'ISO 9001:2015 & NABL Audited Supply Chain'),
            'title'         => get_option('aura_hero_title', get_option('aura_legal_name', 'Aura Space Infra Pvt. Ltd.')),
            'tagline'       => get_option('aura_hero_description', 'Your Trusted Partner in Chemical Excellence. Dependable sourcing and distribution of Active Pharmaceutical Ingredients (APIs), specialty chemicals, and advanced NDT engineering inspection across India.'),
            'cta_primary'   => [
                'label' => get_option('aura_hero_cta_primary_label', 'Request a Quote'),
                'url'   => get_option('aura_hero_cta_primary_url', '/get-a-quote')
            ],
            'cta_secondary' => [
                'label' => get_option('aura_hero_cta_secondary_label', 'Browse Products (135 Items)'),
                'url'   => get_option('aura_hero_cta_secondary_url', '/products')
            ],
            'image'         => [
                'url'    => get_option('aura_hero_image_url', '/images/pexels-pixabay-247763-scaled.jpg'),
                'width'  => 2560,
                'height' => 1707,
                'alt'    => get_option('aura_hero_image_alt', 'Modern chemical and pharmaceutical laboratory facility')
            ],
            'capability_strip_enabled' => get_option('aura_hero_capability_strip_enabled', '1') === '1',
        ],
        'stats' => [
            ['value' => get_option('aura_stat_1_val', '400+'), 'label' => get_option('aura_stat_1_label', 'Domestic Suppliers Network')],
            ['value' => get_option('aura_stat_2_val', '135'),  'label' => get_option('aura_stat_2_label', 'Verified Chemical Catalog Products')],
            ['value' => get_option('aura_stat_3_val', '7+'),   'label' => get_option('aura_stat_3_label', 'Years in Distribution (Since 2014)')],
            ['value' => get_option('aura_stat_4_val', '19'),   'label' => get_option('aura_stat_4_label', 'Industrial Sectors Served')],
        ],
        'intro' => [
            'heading' => get_option('aura_intro_heading', 'Aura Space Infra Pvt. Ltd. (Aura Chemicals)'),
            'body'    => get_option('aura_intro_body', 'A premier distributor and service provider of high-quality solvents and APIs for the pharmaceutical industry, as well as other key sectors such as agrochemicals, biotechnology, food and beverage, and cosmetics. We specialize in sourcing and trading products that meet the strictest regulatory standards while catering to the ever-evolving demands of our diverse client base.'),
        ],
        'services' => [
            'heading' => get_option('aura_services_heading', 'API & Solvent Distribution Network'),
            'body'    => get_option('aura_services_body', 'Assured quality and reliability in API distribution through 400+ leading suppliers across India, actively serving thousands of customers across diverse industries. Through direct sourcing from domestic manufacturers with proven chemical expertise, we efficiently secure supplies, develop customized compounds, and deliver high-purity products to our clients.'),
        ],
        'pillars' => [
            [
                'id'          => 'wide-range',
                'title'       => get_option('aura_pillar_1_title', 'Wide Range of Products'),
                'description' => get_option('aura_pillar_1_desc', 'Aura Chemicals offers a diverse portfolio of chemical solutions catering to various industries. Whether you are in manufacturing, agriculture, or healthcare, we have the right products to meet your specific needs.')
            ],
            [
                'id'          => 'competitive-pricing',
                'title'       => get_option('aura_pillar_2_title', 'Competitive Pricing'),
                'description' => get_option('aura_pillar_2_desc', 'Experience affordability without compromising quality. Aura Chemicals offers competitive pricing, making our products accessible to businesses of all sizes.')
            ],
            [
                'id'          => 'reliable-supply-chain',
                'title'       => get_option('aura_pillar_3_title', 'Reliable Supply Chain'),
                'description' => get_option('aura_pillar_3_desc', 'Count on a consistent and reliable supply chain when you choose Aura Chemicals. We understand the importance of timely deliveries, ensuring that your operations run smoothly without interruptions.')
            ],
            [
                'id'          => 'extensive-network',
                'title'       => get_option('aura_pillar_4_title', 'Extensive Network'),
                'description' => get_option('aura_pillar_4_desc', 'With over 7 years of specialized experience in API distribution since 2014, the company is classified as a Non-Government private entity registered with the Registrar of Companies (ROC Ahmedabad).')
            ]
        ],
        'clientele' => [
            'heading'    => 'OUR CLIENTELE',
            'subheading' => 'Trusted Partners in Chemical Excellence',
            'clients'    => [
                ['id' => 1, 'name' => 'Calyx Chemicals & Pharmaceuticals Ltd.', 'logo_url' => '/images/calyx_chemicals__pharmaceuticals_ltd_logo.jpg'],
                ['id' => 2, 'name' => 'Partner Manufacturer 1', 'logo_url' => '/images/1.png'],
                ['id' => 3, 'name' => 'Partner Manufacturer 2', 'logo_url' => '/images/2.png'],
                ['id' => 4, 'name' => 'Partner Manufacturer 3', 'logo_url' => '/images/3.png'],
                ['id' => 5, 'name' => 'Partner Manufacturer 4', 'logo_url' => '/images/4.png'],
                ['id' => 6, 'name' => 'Partner Manufacturer 5', 'logo_url' => '/images/5.png'],
                ['id' => 7, 'name' => 'Partner Manufacturer 6', 'logo_url' => '/images/6.png'],
                ['id' => 8, 'name' => 'Partner Manufacturer 7', 'logo_url' => '/images/7.png'],
            ]
        ],
        'cta' => [
            'heading' => get_option('aura_cta_heading', 'Join Us on the Journey to Excellence'),
            'body'    => get_option('aura_cta_body', 'Whether you are a small-scale enterprise or a large industrial manufacturer, Aura Chemicals invites you to partner with us for chemical excellence.'),
            'button'  => [
                'label' => get_option('aura_cta_button_label', 'Explore Products'),
                'url'   => get_option('aura_cta_button_url', '/products')
            ]
        ],
        'announcement' => [
            'enabled' => get_option('aura_announcement_enabled', '0') === '1',
            'text'    => get_option('aura_announcement_text', 'Now accepting technical RFQ submissions for high-purity pharma APIs and industrial solvent allocations.'),
            'url'     => get_option('aura_announcement_url', '/get-a-quote'),
        ],
        'seo' => [
            'meta_title'       => get_option('aura_meta_title_suffix', 'Aura Chemicals | Your Trusted Partner in Chemical Excellence'),
            'meta_description' => get_option('aura_default_meta_desc', 'Aura Space Infra Pvt. Ltd. (Aura Chemicals) supplies high-grade APIs, industrial solvents, phosphates, and specialty chemicals across India.')
        ]
    ];

    return rest_ensure_response($home);
}

/**
 * 3. Dynamic Page Endpoint (About Us, Our Mission, Privacy Policy)
 * Merges client-saved content from WP Options with WordPress pages
 */
function aura_rest_get_page($request) {
    $slug = sanitize_title($request['slug']);

    // About Us Page (Fully customizable from WP Admin)
    if ($slug === 'about-us') {
        return rest_ensure_response([
            'id'           => 11,
            'slug'         => 'about-us',
            'title'        => get_option('aura_about_title', 'About Us'),
            'content_html' => '',
            'sections'     => [
                'overview'          => get_option('aura_about_overview', 'At Aura Space Infra Private Limited, we are a trusted partner in the pharmaceutical and industrial chemical trading sector. With over a decade of industry expertise, we specialize in supplying high-purity Active Pharmaceutical Ingredients (APIs), intermediates, and specialty chemicals that comply with rigorous regulatory standards across pharmaceuticals, agrochemicals, biotechnology, and allied industries.'),
                'business_overview' => get_option('aura_about_business_overview', 'Aura Space Infra Private Limited is a premier distributor and service provider of a wide range of high-quality solvents and APIs for the pharmaceutical industry, as well as other key sectors such as agrochemicals, biotechnology, food and beverage, and cosmetics. We specialize in sourcing and trading products that meet the strictest regulatory standards while catering to the ever-evolving demands of our diverse client base.'),
                'why_choose_us'     => [
                    [
                        'title'       => get_option('aura_about_wcu_1_title', 'Reliable Sourcing'),
                        'description' => get_option('aura_about_wcu_1_desc', 'Strong relationships with leading domestic manufacturers to ensure the highest quality products.')
                    ],
                    [
                        'title'       => get_option('aura_about_wcu_2_title', 'Regulatory Compliance'),
                        'description' => get_option('aura_about_wcu_2_desc', 'Strict compliance with global regulatory standards (IP, BP, USP, EP).')
                    ],
                    [
                        'title'       => get_option('aura_about_wcu_3_title', 'Diverse Product Portfolio'),
                        'description' => get_option('aura_about_wcu_3_desc', 'Wide range of solvents, APIs, and phosphates suitable for diverse industrial applications.')
                    ],
                    [
                        'title'       => get_option('aura_about_wcu_4_title', 'Customer-Centric Service'),
                        'description' => get_option('aura_about_wcu_4_desc', 'Dedicated technical desk providing tailored chemical procurement solutions.')
                    ],
                    [
                        'title'       => get_option('aura_about_wcu_5_title', 'Timely Delivery'),
                        'description' => get_option('aura_about_wcu_5_desc', 'Prioritizing on-time delivery to prevent supply chain disruptions.')
                    ]
                ],
                'vision'            => get_option('aura_about_vision', 'At Aura Space Infra Private Limited, our vision is to be the leading trading company in the API and chemical sector, recognized for delivering exceptional products and services. We aim to provide value to our clients by sourcing and trading high-quality materials that support innovation and growth.'),
                'mission'           => get_option('aura_about_mission', 'Our mission is to provide reliable, cost-effective, and high-quality solutions to our clients. We strive to be the trusted partner of choice in the API and chemical distribution industry, continuously expanding our product offerings and services to meet the growing needs of the markets we serve.'),
                'sustainability'    => get_option('aura_about_sustainability', 'Sustainability is at the core of our business practices. We ensure that the products we trade are environmentally responsible and aligned with global standards for safety and sustainability. We actively work to reduce our carbon footprint across our distribution operations.'),
                'collaboration'     => get_option('aura_about_collaboration', 'At Aura Space Infra Pvt Ltd, we believe in the power of collaboration. We work closely with our clients, suppliers, and partners to foster innovation and drive sustainable growth.')
            ]
        ]);
    }

    // Our Mission Page (Fully customizable from WP Admin)
    if ($slug === 'our-mission') {
        return rest_ensure_response([
            'id'           => 15,
            'slug'         => 'our-mission',
            'title'        => get_option('aura_mission_page_title', 'Our Mission'),
            'content_html' => '',
            'sections'     => [
                'mission_statement' => get_option('aura_mission_hero_text', 'At Aura Space Infra Private Limited (Aura Chemicals), our mission is to empower global pharmaceutical innovation and industrial manufacturing by providing high-purity chemical compounds, reliable supply chain solutions, and uncompromising regulatory integrity.'),
                'vision_statement'  => get_option('aura_vision_hero_text', 'To be recognized as India\'s most trusted and technically proficient chemical distribution partner, pioneering sustainable sourcing networks and setting benchmarks for transparency, speed, and safety in global chemical commerce.'),
                'principles'        => [
                    [
                        'title'       => get_option('aura_mission_gp_1_title', 'Uncompromising Quality'),
                        'description' => get_option('aura_mission_gp_1_desc', 'Every chemical batch is backed by certified manufacturer analyses, verifying exact assay levels, purity thresholds, and regulatory compliance.')
                    ],
                    [
                        'title'       => get_option('aura_mission_gp_2_title', 'Regulatory Rigor'),
                        'description' => get_option('aura_mission_gp_2_desc', 'Strict adherence to national and international pharmacopeias (IP, BP, USP, EP) with end-to-end audit traceability.')
                    ],
                    [
                        'title'       => get_option('aura_mission_gp_3_title', 'Transparent Partnerships'),
                        'description' => get_option('aura_mission_gp_3_desc', 'Open technical communication, competitive market pricing, and dedicated client desk support across all commercial stages.')
                    ],
                    [
                        'title'       => get_option('aura_mission_gp_4_title', 'Environmental Stewardship'),
                        'description' => get_option('aura_mission_gp_4_desc', 'Promoting responsible storage, compliant eco-packaging, and low-emission logistics to protect ecosystems and future generations.')
                    ]
                ],
                'long_term_vision'  => get_option('aura_mission_vision_long', 'Expanding our direct manufacturing partnerships across Asia, Europe, and the Americas to offer an integrated global chemical supply network while investing in continuous quality verification.'),
                'inquiry_support'   => get_option('aura_mission_inquiry_text', 'Our dedicated technical consultation desk is available to assist your procurement team with specific pharmacopeial grades, custom packaging, and bulk allocation schedules.')
            ]
        ]);
    }

    // Check WordPress Page table for custom page
    $page = get_page_by_path($slug);
    if ($page) {
        return rest_ensure_response([
            'id'           => $page->ID,
            'slug'         => $page->post_name,
            'title'        => get_the_title($page),
            'content_html' => apply_filters('the_content', $page->post_content),
            'sections'     => get_post_meta($page->ID, 'aura_sections', true) ?: [],
        ]);
    }

    return new WP_Error('page_not_found', 'Page not found', ['status' => 404]);
}

/**
 * 4. Products List Endpoint
 * Checks WordPress CPT database first, falls back seamlessly to products.json
 */
function aura_rest_get_products($request) {
    $category = $request->get_param('category');
    $search   = $request->get_param('search');
    $industry = $request->get_param('industry');
    $page     = max(1, intval($request->get_param('page') ?: 1));
    $per_page = max(1, min(500, intval($request->get_param('per_page') ?: 20)));

    // 1. Try WordPress Database Query
    $args = [
        'post_type'      => 'product',
        'post_status'    => 'publish',
        'posts_per_page' => $per_page,
        'paged'          => $page,
    ];

    if ($search) {
        $args['s'] = sanitize_text_field($search);
    }

    if ($category && $category !== 'all') {
        $args['tax_query'] = [
            [
                'taxonomy' => 'product_category',
                'field'    => 'slug',
                'terms'    => sanitize_title($category),
            ],
        ];
    }

    $query = new WP_Query($args);

    if ($query->have_posts()) {
        $products = [];
        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            $categories = get_the_terms($post_id, 'product_category');
            $primary_cat = (!empty($categories) && !is_wp_error($categories)) ? [
                'id'    => $categories[0]->term_id,
                'name'  => $categories[0]->name,
                'slug'  => $categories[0]->slug,
                'count' => $categories[0]->count,
            ] : [
                'id'    => 1,
                'name'  => 'Active Pharmaceutical Ingredients',
                'slug'  => 'api',
                'count' => 1,
            ];

            $products[] = [
                'id'                   => $post_id,
                'slug'                 => get_post_field('post_name', $post_id),
                'chemical_name'        => get_the_title($post_id),
                'cas_number'           => get_post_meta($post_id, 'cas_number', true) ?: '',
                'grade'                => get_post_meta($post_id, 'grade', true) ?: 'Pharma Grade',
                'therapeutic_category' => get_post_meta($post_id, 'therapeutic_category', true) ?: '',
                'molecular_formula'    => get_post_meta($post_id, 'molecular_formula', true) ?: '',
                'molecular_weight'     => get_post_meta($post_id, 'molecular_weight', true) ?: '',
                'purity'               => get_post_meta($post_id, 'purity', true) ?: '≥ 99.0%',
                'packaging'            => get_post_meta($post_id, 'packaging', true) ?: 'Standard Export Packaging',
                'applications'         => get_post_meta($post_id, 'applications', true) ?: '',
                'datasheet_url'        => get_post_meta($post_id, 'datasheet_url', true) ?: '',
                'short_description'    => get_the_excerpt($post_id) ?: get_the_content($post_id),
                'category'             => $primary_cat,
                'image'                => has_post_thumbnail($post_id) ? [
                    'url' => get_the_post_thumbnail_url($post_id, 'large'),
                    'alt' => get_the_title($post_id),
                ] : null,
            ];
        }
        wp_reset_postdata();

        return rest_ensure_response([
            'total'        => (int) $query->found_posts,
            'total_pages'  => (int) $query->max_num_pages,
            'current_page' => $page,
            'per_page'     => $per_page,
            'products'     => $products,
        ]);
    }

    // 2. Seamless Fallback to Verified Baseline JSON
    $products_file = AURA_CORE_PATH . 'data/products.json';
    if (!file_exists($products_file)) {
        return new WP_Error('no_data', 'Products data file missing', ['status' => 500]);
    }

    $all_products = json_decode(file_get_contents($products_file), true);

    if ($category && $category !== 'all') {
        $all_products = array_filter($all_products, function($p) use ($category) {
            return isset($p['category']['slug']) && $p['category']['slug'] === $category;
        });
    }

    if ($industry && $industry !== 'all') {
        $all_products = array_filter($all_products, function($p) use ($industry) {
            if (!isset($p['related_industries']) || !is_array($p['related_industries'])) return false;
            foreach ($p['related_industries'] as $ind) {
                if (isset($ind['slug']) && $ind['slug'] === $industry) return true;
            }
            return false;
        });
    }

    if ($search) {
        $s = strtolower($search);
        $all_products = array_filter($all_products, function($p) use ($s) {
            return (
                strpos(strtolower($p['chemical_name']), $s) !== false ||
                (isset($p['cas_number']) && strpos(strtolower($p['cas_number']), $s) !== false) ||
                (isset($p['therapeutic_category']) && strpos(strtolower($p['therapeutic_category']), $s) !== false)
            );
        });
    }

    $total = count($all_products);
    $total_pages = max(1, ceil($total / $per_page));
    $paged = array_slice(array_values($all_products), ($page - 1) * $per_page, $per_page);

    return rest_ensure_response([
        'total'        => $total,
        'total_pages'  => $total_pages,
        'current_page' => $page,
        'per_page'     => $per_page,
        'products'     => $paged,
    ]);
}

/**
 * 5. Single Product by Slug
 * Queries WordPress DB first, falls back to JSON
 */
function aura_rest_get_product_by_slug($request) {
    $slug = sanitize_title($request['slug']);

    // Check WordPress DB first
    $posts = get_posts([
        'post_type'      => 'product',
        'name'           => $slug,
        'posts_per_page' => 1,
        'post_status'    => 'publish',
    ]);

    if (!empty($posts)) {
        $post = $posts[0];
        $post_id = $post->ID;
        $categories = get_the_terms($post_id, 'product_category');
        $primary_cat = (!empty($categories) && !is_wp_error($categories)) ? [
            'id'    => $categories[0]->term_id,
            'name'  => $categories[0]->name,
            'slug'  => $categories[0]->slug,
            'count' => $categories[0]->count,
        ] : [
            'id'    => 1,
            'name'  => 'Active Pharmaceutical Ingredients',
            'slug'  => 'api',
            'count' => 1,
        ];

        return rest_ensure_response([
            'id'                   => $post_id,
            'slug'                 => $post->post_name,
            'chemical_name'        => get_the_title($post),
            'cas_number'           => get_post_meta($post_id, 'cas_number', true) ?: '',
            'grade'                => get_post_meta($post_id, 'grade', true) ?: 'Pharma Grade',
            'therapeutic_category' => get_post_meta($post_id, 'therapeutic_category', true) ?: '',
            'molecular_formula'    => get_post_meta($post_id, 'molecular_formula', true) ?: '',
            'molecular_weight'     => get_post_meta($post_id, 'molecular_weight', true) ?: '',
            'purity'               => get_post_meta($post_id, 'purity', true) ?: '≥ 99.0%',
            'packaging'            => get_post_meta($post_id, 'packaging', true) ?: 'Standard Export Packaging',
            'applications'         => get_post_meta($post_id, 'applications', true) ?: '',
            'datasheet_url'        => get_post_meta($post_id, 'datasheet_url', true) ?: '',
            'short_description'    => get_the_excerpt($post) ?: $post->post_content,
            'category'             => $primary_cat,
            'image'                => has_post_thumbnail($post_id) ? [
                'url' => get_the_post_thumbnail_url($post_id, 'large'),
                'alt' => get_the_title($post),
            ] : null,
        ]);
    }

    // Fallback to static JSON file
    $products_file = AURA_CORE_PATH . 'data/products.json';
    if (file_exists($products_file)) {
        $all_products = json_decode(file_get_contents($products_file), true);
        foreach ($all_products as $p) {
            if ($p['slug'] === $slug) {
                return rest_ensure_response($p);
            }
        }
    }

    return new WP_Error('product_not_found', 'Chemical product not found in catalog', ['status' => 404]);
}

/**
 * 6. Product Categories
 * Queries WordPress terms first, falls back to JSON
 */
function aura_rest_get_categories() {
    $terms = get_terms([
        'taxonomy'   => 'product_category',
        'hide_empty' => false,
    ]);

    if (!empty($terms) && !is_wp_error($terms)) {
        $result = [];
        foreach ($terms as $term) {
            $result[] = [
                'id'    => $term->term_id,
                'name'  => $term->name,
                'slug'  => $term->slug,
                'count' => (int) $term->count,
            ];
        }
        return rest_ensure_response($result);
    }

    $file = AURA_CORE_PATH . 'data/categories.json';
    if (file_exists($file)) {
        return rest_ensure_response(json_decode(file_get_contents($file), true));
    }
    return rest_ensure_response([]);
}

/**
 * 7. Industries
 * Queries WordPress CPT first, falls back to JSON
 */
function aura_rest_get_industries() {
    $posts = get_posts([
        'post_type'      => 'industry',
        'posts_per_page' => 100,
        'post_status'    => 'publish',
        'orderby'        => 'title',
        'order'          => 'ASC',
    ]);

    $image_map = [
        'adhesives'     => '/images/adhesives.jpeg',
        'sealant'       => '/images/adhesives.jpeg',
        'agro'          => '/images/agriculture.jpeg',
        'fertilizer'    => '/images/agriculture.jpeg',
        'automotive'    => '/images/automotive.jpeg',
        'cleaning'      => '/images/cleaning.jpeg',
        'sanitation'    => '/images/cleaning.jpeg',
        'construction'  => '/images/constuction.jpeg',
        'cosmetic'      => '/images/cosmetic.jpeg',
        'personal care' => '/images/cosmetic.jpeg',
        'energy'        => '/images/energy-sector.jpeg',
        'oil'           => '/images/energy-sector.jpeg',
        'gas'           => '/images/energy-sector.jpeg',
        'food'          => '/images/food-and-bevearge.jpeg',
        'beverage'      => '/images/food-and-bevearge.jpeg',
        'healthcare'    => '/images/healthcare.jpeg',
        'diagnostics'   => '/images/healthcare.jpeg',
        'pharma'        => '/images/phrama.jpeg',
        'leather'       => '/images/leather.jpeg',
        'tanning'       => '/images/leather.jpeg',
        'mining'        => '/images/mining.jpeg',
        'metallurgy'    => '/images/mining.jpeg',
        'packaging'     => '/images/packaging.jpeg',
        'paint'         => '/images/paint.jpeg',
        'coating'       => '/images/paint.jpeg',
        'paper'         => '/images/paper.jpeg',
        'pulp'          => '/images/paper.jpeg',
        'plastic'       => '/images/plastics.jpeg',
        'polymer'       => '/images/plastics.jpeg',
        'semiconductor' => '/images/semiconductor.jpeg',
        'electronic'    => '/images/semiconductor.jpeg',
        'textile'       => '/images/textind.jpeg',
        'rubber'        => '/images/tyre.jpeg',
        'tyre'          => '/images/tyre.jpeg',
        'water'         => '/images/water-treatment-plant.jpg',
    ];

    if (!empty($posts)) {
        $industries = [];
        foreach ($posts as $post) {
            $post_id = $post->ID;
            $slug    = $post->post_name;
            $title   = html_entity_decode(get_the_title($post), ENT_QUOTES, 'UTF-8');
            $img_url = has_post_thumbnail($post_id) ? get_the_post_thumbnail_url($post_id, 'large') : '';

            if (empty($img_url)) {
                $search_text = strtolower($slug . ' ' . $title);
                foreach ($image_map as $key => $path) {
                    if (strpos($search_text, $key) !== false) {
                        $img_url = $path;
                        break;
                    }
                }
            }
            if (empty($img_url)) {
                $img_url = '/images/water-treatment-plant.jpg';
            }

            $industries[] = [
                'id'        => $post_id,
                'title'     => $title,
                'slug'      => $slug,
                'overview'  => html_entity_decode(get_the_excerpt($post) ?: $post->post_content, ENT_QUOTES, 'UTF-8'),
                'image_url' => $img_url,
                'image'     => [
                    'url'    => $img_url,
                    'alt'    => $title,
                    'width'  => 612,
                    'height' => 408,
                ],
            ];
        }
        return rest_ensure_response($industries);
    }

    $file = AURA_CORE_PATH . 'data/industries.json';
    if (file_exists($file)) {
        return rest_ensure_response(json_decode(file_get_contents($file), true));
    }
    return rest_ensure_response([]);
}

/**
 * 8. Services
 * Queries WordPress CPT first, falls back to JSON
 */
function aura_rest_get_services() {
    $posts = get_posts([
        'post_type'      => 'service',
        'posts_per_page' => 50,
        'post_status'    => 'publish',
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
    ]);

    if (!empty($posts)) {
        $services = [];
        foreach ($posts as $post) {
            $post_id = $post->ID;
            $services[] = [
                'id'           => $post_id,
                'title'        => get_the_title($post),
                'slug'         => $post->post_name,
                'description'  => get_the_excerpt($post) ?: $post->post_content,
                'standards'    => get_post_meta($post_id, 'standards', true) ?: '',
                'capabilities' => get_post_meta($post_id, 'capabilities', true) ?: [],
            ];
        }
        return rest_ensure_response($services);
    }

    $file = AURA_CORE_PATH . 'data/services.json';
    if (file_exists($file)) {
        return rest_ensure_response(json_decode(file_get_contents($file), true));
    }
    return rest_ensure_response([]);
}
