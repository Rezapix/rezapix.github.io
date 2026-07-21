/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_CF_IMAGES_ACCOUNT?: string;
  readonly PUBLIC_CF_STREAM_CUSTOMER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
