declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    JWT_KEY: string;
    MONGO_URI: string;
  }
}