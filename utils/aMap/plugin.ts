import type AMapSingleton from './singleton/aMap';

export default class Plugin {
  private config: Record<string, any>;
  private aMap: AMapSingleton;
  private name: string;

  constructor(name: string, aMap: AMapSingleton, config: Record<string, any>) {
    this.name = name;
    this.aMap = aMap;
    this.config = config;
  }

  async Get() {
    const m = await this.aMap.Get();
    return new m[this.name](this.config);
  }
}
