declare module 'process' {
    global {
      namespace NodeJS {
        export interface ProcessEnv {
          BASE_ENV: 'development' | 'test' | 'pre' | 'production'
          NODE_ENV: 'development' | 'production'
        }
      }
    }
  }