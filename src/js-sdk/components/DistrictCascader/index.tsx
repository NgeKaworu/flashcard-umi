import AMap from '@/edk/utils/aMap/singleton/aMap';
import Plugin from '@/edk/utils/aMap/plugin';

import { useQuery } from 'react-query';
import { reject } from 'lodash';
import type { CascaderProps } from 'antd';
import { Cascader } from 'antd';

type Status = 'complete';
type Level = 'province' | 'country';
interface District {
  districtList: DistrictItem[];
  info: string;
}
interface DistrictItem {
  adcode: string;
  boundaries: unknown[];
  center: unknown;
  citycode: unknown[];
  districtList?: DistrictItem[];
  level: Level;
  name: string;
}

interface DistrictConfig {
  // 关键字对应的行政区级别，country表示国家
  level: Level;
  // 显示下级行政区级数，1表示返回下一级行政区
  subdistrict: number;
  extensions: string;
}

type Props<T> = CascaderProps<T> & {
  districtConfig?: DistrictConfig;
};

export default <T extends any = any>({ mapConfig, districtConfig, ...cascaderProps }: Props<T>) => {
  const aMap = new AMap(mapConfig);
  const districtSearch = new Plugin('DistrictSearch', aMap, {
    // 关键字对应的行政区级别，country表示国家
    level: 'province',
    // 显示下级行政区级数，1表示返回下一级行政区
    subdistrict: 2,
    extensions: 'all',
    ...districtConfig,
  });

  const district = useQuery(
    ['district', districtConfig],
    () =>
      new Promise<District>(async (res) => {
        const client = await districtSearch.Get();
        client?.search('中国', (status: Status, data: District) => {
          if (status === 'complete') return res(data);
          return reject(data);
        });
      }),
  );

  return (
    <Cascader
      {...cascaderProps}
      showSearch
      options={district?.data?.districtList?.[0]?.districtList}
      loading={district.isFetching}
      fieldNames={{ label: 'name', value: 'adcode', children: 'districtList' }}
    />
  );
};
