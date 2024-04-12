declare namespace NodeJS {
  export interface ProcessEnv {
    // appconfig
    NODE_ENV: 'development' | 'test' | 'production';
    HOST: string;
    PORT: string;

    // database config
    DB_HOST: string;
    DB_PORT: string;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
  }
}
