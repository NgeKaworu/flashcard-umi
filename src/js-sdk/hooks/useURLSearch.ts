import moment from 'moment';
import { useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';

interface Param<T extends any = any> {
  key: string;
  onURLSearchChange: (v?: T) => void;
  reviver?: (this: any, key: string, value: any) => any;
  replacer?: (this: any, key: string, value: any) => any;
}

const _reviver: Param['reviver'] = (_, v) => {
  //  moment 处理 ISO 8601 -> moment
  if (/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/.test(v)) {
    return moment(v);
  }
  return v;
};

const _replacer: Param['replacer'] = (_, v) => {
  if (moment.isMoment(v)) {
    return v?.toISOString();
  }
  return v;
};

export default <T extends any = any>({
  key,
  reviver = _reviver,
  replacer = _replacer,
  onURLSearchChange,
}: Param<T>) => {
  const history = useHistory();
  const { search, pathname } = history.location;

  const _key = `_${key}`;
  const pParams = new URLSearchParams(search);
  const params = pParams.get(_key);

  useLayoutEffect(() => {
    let v;
    if (params) {
      try {
        v = JSON.parse(params, reviver);
      } catch (e) {
        console.error('search form json 格式错误');
      }
    }

    onURLSearchChange?.(v);
  }, [params, _key]);

  function setURLSearch(values?: T) {
    if (values) {
      const json = JSON.stringify(values, replacer);
      if (pParams.get(_key) !== json) {
        pParams.set(_key, json);
        history.push({
          pathname,
          search: `?${pParams}`,
        });
      }
    }

    if (!values && pParams.get(_key)) {
      pParams.delete(_key);
      history.push({
        pathname,
        search: `?${pParams}`,
      });
    }
  }

  return { setURLSearch };
};
