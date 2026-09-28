<?php
/**
 * Headless redirect index template
 *
 * Redirects any direct browser request on the WordPress origin
 * to the corresponding path on the React Vite frontend application.
 */

$frontend_url = get_option('aura_frontend_url', 'http://localhost:3001');
$frontend_url = rtrim($frontend_url, '/');

$request_uri = $_SERVER['REQUEST_URI'] ?? '/';

// Redirect to frontend app
wp_redirect($frontend_url . $request_uri, 301);
exit;
