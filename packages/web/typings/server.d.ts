import { INestApplication } from '@nestjs/common';

declare module 'http' {
  interface ServerResponse {
    /**
     * @property {INestApplication} handled in `server.js`. Shoud be defined if `production`
     */
    app?: INestApplication;
  }
}

declare global {
  // eslint-disable-next-line
  let app: INestApplication | undefined = undefined;
  // eslint-disable-next-line
  let appPromise: Promise<INestApplication> | undefined = undefined;

  namespace NodeJS {
    interface Global {
      app: INestApplication | undefined;
      appPromise: Promise<INestApplication> | undefined;
    }
  }
}
