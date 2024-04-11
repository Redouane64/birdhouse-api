declare namespace NodeJS {
  export interface ProcessEnv {
    // appconfig
    NODE_ENV: 'development' | 'test' | 'production';
    HOST: string;
    PORT: string;
  }
}
