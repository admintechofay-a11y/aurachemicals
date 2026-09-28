<?php
defined('ABSPATH') || exit;

add_action('rest_api_init', 'aura_register_rest_routes');
add_action('init', 'aura_handle_cors_preflight');

/**
 * Handle CORS preflight requests
 */
function aura_handle_cors_preflight() {
    $origin = get_http_origin();
    if ($origin) {
        header("Access-Control-Allow-Origin: " . esc_url_raw($origin));
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With");
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

    // 1. Settings
    register_rest_route($namespace, '/settings', [
        'methods'             => 'GET',
        'callback'            => 'aura_rest_get_settings',
        'permission_callback' => '__return_true',
    ]);

    // 2. Home Aggregated
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
 * Endpoint Callbacks
 */

function aura_rest_get_settings() {
    $settings_file = AURA_CORE_PATH . 'data/settings.json';
    if (file_exists($settings_file)) {
        $settings = json_decode(file_get_contents($settings_file), true);
        // Overlay dynamically saved WP options
        $settings['company']['phone'] = get_option('aura_company_phone', $settings['company']['phone']);
        $settings['company']['email'] = get_option('aura_company_email', $settings['company']['email']);
        $settings['company']['legal_name'] = get_option('aura_legal_name', $settings['company']['legal_name']);
        $settings['company']['brand_name'] = get_option('aura_brand_name', $settings['company']['brand_name']);
        $settings['company']['roc_registration'] = get_option('aura_roc_reg', $settings['company']['roc_registration']);
        return rest_ensure_response($settings);
    }

    return new WP_Error('settings_not_found', 'Settings data file missing', ['status' => 500]);
}

function aura_rest_get_home() {
    // If customized posts exist in DB, build from DB, else use verified data file
    $settings = aura_rest_get_settings()->data;

    $home = [
        'hero' => [
            'eyebrow' => 'Aura Group of Companies',
            'title'   => get_option('aura_legal_name', 'Aura Space Infra Pvt. Ltd.'),
            'tagline' => 'Your Trusted Partner in Chemical Excellence',
            'cta_primary' => ['label' => 'Request a Quote', 'url' => '/get-a-quote'],
            'cta_secondary' => ['label' => 'Explore Products', 'url' => '/products'],
            'image' => [
                'url' => '/images/pexels-pixabay-247763-scaled.jpg',
                'width' => 2560,
                'height' => 1707,
                'alt' => 'Modern chemical and pharmaceutical laboratory facility'
            ]
        ],
        'intro' => [
            'heading' => 'Our Company',
            'body' => 'The company has earned a strong reputation as a reliable, quality-driven supplier through decades of collective market experience, maintaining close long-term relationships with customers and developing a deep understanding of their specific chemical requirements.'
        ],
        'services' => [
            'heading' => 'Our Services',
            'body' => 'Assured quality and reliability in API distribution through 400+ leading suppliers across India, actively serving thousands of customers across diverse industries. Through direct sourcing from domestic manufacturers with proven chemical expertise, we efficiently secure supplies, develop customized compounds, and deliver high-purity products to our clients.'
        ],
        'pillars' => [
            [
                'id' => 'wide-range',
                'title' => 'Wide Range of Products',
                'description' => 'Aura Chemicals offers a diverse portfolio of chemical solutions catering to various industries. Whether you are in manufacturing, agriculture, or healthcare, we have the right products to meet your specific needs.'
            ],
            [
                'id' => 'competitive-pricing',
                'title' => 'Competitive Pricing',
                'description' => 'Experience affordability without compromising quality. Aura Chemicals offers competitive pricing, making our products accessible to businesses of all sizes.'
            ],
            [
                'id' => 'reliable-supply-chain',
                'title' => 'Reliable Supply Chain',
                'description' => 'Count on a consistent and reliable supply chain when you choose Aura Chemicals. We understand the importance of timely deliveries, ensuring that your operations run smoothly without interruptions.'
            ],
            [
                'id' => 'extensive-network',
                'title' => 'Extensive Network',
                'description' => 'With over 7 years of specialized experience in API distribution since 2014, the company is classified as a Non-Government private entity registered with the Registrar of Companies (ROC Ahmedabad).'
            ]
        ],
        'clientele' => [
            'heading' => 'OUR CLIENTELE',
            'subheading' => 'Trusted Partners in Chemical Excellence',
            'clients' => [
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
            'heading' => 'Join Us on the Journey to Excellence',
            'body' => 'Whether you are a small-scale enterprise or a large industrial manufacturer, Aura Chemicals invites you to partner with us for chemical excellence.',
            'button' => ['label' => 'Explore Products', 'url' => '/products']
        ],
        'seo' => [
            'meta_title' => 'Aura Chemicals | Your Trusted Partner in Chemical Excellence',
            'meta_description' => 'Aura Space Infra Pvt. Ltd. (Aura Chemicals) supplies high-grade APIs, industrial solvents, phosphates, and specialty chemicals across India.'
        ]
    ];

    return rest_ensure_response($home);
}

function aura_rest_get_page($request) {
    $slug = sanitize_title($request['slug']);
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

    // Default static page fallback
    if ($slug === 'about-us' || $slug === 'our-mission') {
        return rest_ensure_response([
            'id' => 999,
            'slug' => $slug,
            'title' => ucwords(str_replace('-', ' ', $slug)),
            'content_html' => '',
            'sections' => []
        ]);
    }

    return new WP_Error('page_not_found', 'Page not found', ['status' => 404]);
}

function aura_rest_get_products($request) {
    $category = $request->get_param('category');
    $search   = $request->get_param('search');
    $page     = max(1, intval($request->get_param('page') ?: 1));
    $per_page = max(1, min(500, intval($request->get_param('per_page') ?: 20)));

    $products_file = AURA_CORE_PATH . 'data/products.json';
    if (!file_exists($products_file)) {
        return new WP_Error('no_data', 'Products data file missing', ['status' => 500]);
    }

    $all_products = json_decode(file_get_contents($products_file), true);

    // Filter by category
    if ($category && $category !== 'all') {
        $all_products = array_filter($all_products, function($p) use ($category) {
            return isset($p['category']['slug']) && $p['category']['slug'] === $category;
        });
    }

    // Filter by search
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

function aura_rest_get_product_by_slug($request) {
    $slug = sanitize_title($request['slug']);
    $products_file = AURA_CORE_PATH . 'data/products.json';
    if (file_exists($products_file)) {
        $all_products = json_decode(file_get_contents($products_file), true);
        foreach ($all_products as $p) {
            if ($p['slug'] === $slug) {
                return rest_ensure_response($p);
            }
        }
    }

    return new WP_Error('product_not_found', 'Product not found', ['status' => 404]);
}

function aura_rest_get_categories() {
    $file = AURA_CORE_PATH . 'data/categories.json';
    if (file_exists($file)) {
        return rest_ensure_response(json_decode(file_get_contents($file), true));
    }
    return rest_ensure_response([]);
}

function aura_rest_get_industries() {
    $file = AURA_CORE_PATH . 'data/industries.json';
    if (file_exists($file)) {
        return rest_ensure_response(json_decode(file_get_contents($file), true));
    }
    return rest_ensure_response([]);
}

function aura_rest_get_services() {
    $file = AURA_CORE_PATH . 'data/services.json';
    if (file_exists($file)) {
        return rest_ensure_response(json_decode(file_get_contents($file), true));
    }
    return rest_ensure_response([]);
}
