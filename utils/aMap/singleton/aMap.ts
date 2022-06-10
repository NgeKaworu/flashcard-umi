import AMapLoader from '@amap/amap-jsapi-loader';

declare global {
  interface Window {
    aMapSingleton: any;
  }
}

export type Config = Parameters<typeof AMapLoader.load>[0];

export default class AMapSingleton {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async Get() {
    let m = window?.aMapSingleton;

    if (!m) {
      m = await AMapLoader.load(this.config);
      window.aMapSingleton = m;
    }

    return m;
  }

  Destroy() {
    window.aMapSingleton = void 0;
  }

  async ReNew() {
    this.Destroy();
    return this.Get();
  }
}
