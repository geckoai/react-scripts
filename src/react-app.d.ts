/// <reference types="node" />
declare module 'webpack-bundle-analyzer' {
  import { WebpackPluginInstance } from 'webpack';

  interface BundleAnalyzerPluginConstructor {
    new (...args: any[]): WebpackPluginInstance;
  }
  export let BundleAnalyzerPlugin: BundleAnalyzerPluginConstructor;
  export default BundleAnalyzerPlugin;
}

namespace NodeJS {
  interface Process {
    env: ProcessEnv;
  }
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PUBLIC_URL: string;
    WDS_SOCKET_HOST: string;
    WDS_SOCKET_PORT: string;
    WDS_SOCKET_PATH: string;
    APP_RUNTIME_ENV:  'web' | 'electron';
    MAX_OLD_SPACE_SIZE: string;
  }
}