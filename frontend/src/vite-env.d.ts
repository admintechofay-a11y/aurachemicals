/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WORDPRESS_API_URL: string;
  readonly VITE_ENABLE_MOCK_FALLBACK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
