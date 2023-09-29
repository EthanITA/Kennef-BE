declare namespace NodeJS {
  interface ProcessEnv {
    MAGENTO_TOKEN: string;
    NODE_TLS_REJECT_UNAUTHORIZED: '0';
  }
}
