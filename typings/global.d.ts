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

/* Use this file to declare any custom file extensions for importing */
/* Use this folder to also add/extend a package d.ts file, if needed. */

/* CSS MODULES */
// declare module '*.module.css' {
//   const classes: { [key: string]: string };
//   export default classes;
// }

// declare module '*.module.scss' {
//   const classes: { [key: string]: string };
//   export default classes;
// }

// declare module '*.module.sass' {
//   const classes: { [key: string]: string };
//   export default classes;
// }

// declare module '*.less' {
//   const classes: { [key: string]: string };
//   export default classes;
// }

// declare module '*.module.styl' {
//   const classes: { [key: string]: string };
//   export default classes;
// }

/* CSS */
// declare module '*.css';
// declare module '*.scss';
// declare module '*.sass';
// declare module '*.less';
// declare module '*.styl';

/* CSS MODULES */
declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.styl' {
  const classes: { [key: string]: string };
  export default classes;
}

/* IMAGES */
declare module '*.svg' {
  const ref: string;
  export default ref;
}

declare module '*.bmp' {
  const ref: string;
  export default ref;
}

declare module '*.gif' {
  const ref: string;
  export default ref;
}

declare module '*.jpg' {
  const ref: string;
  export default ref;
}

declare module '*.jpeg' {
  const ref: string;
  export default ref;
}

declare module '*.png' {
  const ref: string;
  export default ref;
}