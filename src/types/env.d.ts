declare namespace NodeJS {
  interface ProcessEnv {
    NODE_TLS_REJECT_UNAUTHORIZED: '0';
    NODE_ENV?: 'development' | 'production';
    APP_URL: string;
    PP_CLIENT_ID: string;
    PP_SECRET_KEY: string;
    MAGENTO_REST_URL: string;
    MAGENTO_TOKEN: string;
  }
}
