/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_MODE?: string;
  readonly VITE_GOOGLE_BOOKS_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
