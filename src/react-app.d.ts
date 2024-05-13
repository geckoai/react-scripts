/// <reference types="node" />
/// <reference types="@types/react" />
/// <reference types="@types/react-dom" />

declare module 'webpack-bundle-analyzer' {
  import { WebpackPluginInstance } from 'webpack';

  interface BundleAnalyzerPluginConstructor {
    new (...args: any[]): WebpackPluginInstance;
  }
  export let BundleAnalyzerPlugin: BundleAnalyzerPluginConstructor;
  export default BundleAnalyzerPlugin;
}

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: 'development' | 'production' | 'test';
      readonly PUBLIC_URL: string;
      readonly WDS_SOCKET_HOST: string;
      readonly WDS_SOCKET_PORT: string;
      readonly WDS_SOCKET_PATH: string;
      readonly APP_RUNTIME_ENV: string;
      readonly MAX_OLD_SPACE_SIZE: number;
    }
  }
  declare module '*.avif' {
    const src: string;
    export default src;
  }

  declare module '*.bmp' {
    const src: string;
    export default src;
  }

  declare module '*.gif' {
    const src: string;
    export default src;
  }

  declare module '*.jpg' {
    const src: string;
    export default src;
  }

  declare module '*.jpeg' {
    const src: string;
    export default src;
  }

  declare module '*.png' {
    const src: string;
    export default src;
  }

  declare module '*.webp' {
    const src: string;
    export default src;
  }

  declare module '*.svg' {
    import * as React from 'react';

    export const ReactComponent: React.FunctionComponent<
      React.SVGProps<SVGSVGElement> & { title?: string }
    >;

    const src: string;
    export default src;
  }

  declare module '*.module.css' {
    const classes: { readonly [key: string]: string };
    export default classes;
  }

  declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
  }

  declare module '*.module.sass' {
    const classes: { readonly [key: string]: string };
    export default classes;
  }
}
