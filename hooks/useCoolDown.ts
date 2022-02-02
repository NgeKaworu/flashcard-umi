import { useState, useRef, useEffect } from 'react';
export interface CoolDownParams {
  interval?: number;
  count: number;
  step?: number;
  persistenceKey?: string;
  onCoolDown?: () => void;
}

const coolDownSuffix = ':cd:suffix';
let lock = 0;

export enum STATUS {
  'STOP',
  'RUN',
}

export function encodeCoolDown(count: number, endAt: number, status: STATUS) {
  return [count, endAt, status]?.join();
}

export function decodeCoolDown(item: ReturnType<typeof localStorage.getItem>) {
  return (item ?? ',,')?.split(',')?.map((v) => (v === '' ? NaN : +v)) as [
    count: number,
    endAt: number,
    status: STATUS,
  ];
}

export function setCoolDown(
  key: string,
  value: number,
  endAt: number,
  status: STATUS = STATUS.RUN,
) {
  return localStorage.setItem(`${key}${coolDownSuffix}`, encodeCoolDown(value, endAt, status));
}

export function getCoolDown(key: string) {
  return decodeCoolDown(localStorage.getItem(`${key}${coolDownSuffix}`));
}

export function clearOvertime() {
  Object.keys(localStorage)?.forEach((k) => {
    if (k.endsWith(coolDownSuffix)) {
      const [, endAt] = decodeCoolDown(localStorage.getItem(k));
      if (endAt + 24 * 60 * 60 * 1000 < Date.now()) {
        localStorage.removeItem(k);
      }
    }
  });
}

export default ({
  count,
  interval = 1000,
  step = 1,
  persistenceKey,
  onCoolDown,
}: CoolDownParams) => {
  const isPersistence = !!persistenceKey;
  let init = count;
  if (isPersistence) {
    const [pre, endAt, status] = getCoolDown(persistenceKey);
    switch (status) {
      case STATUS.STOP:
        init = pre;
        break;
      case STATUS.RUN: {
        init = ~~((endAt - Date.now()) / (interval * step));
        init = init <= 0 ? count : init;
        break;
      }
    }
  }

  const [remaining, setRemaining] = useState(init),
    timer = useRef<number>(),
    cooling = remaining !== count;

  useEffect(() => {
    if (isPersistence && cooling) {
      const [, , status] = getCoolDown(persistenceKey);
      if (status === STATUS.RUN) start();
    }

    if (lock === 0) clearOvertime();

    return () => {
      lock--;
    };
  }, []);

  function loop(pre: number) {
    const n = pre - step;
    if (n <= 0) {
      stop();
      reset();
      onCoolDown?.();
    } else {
      setRemaining(n);
      timer.current = window.setTimeout(() => loop(n), interval);
    }
  }

  function start() {
    if (timer.current === void 0) {
      if (isPersistence) {
        setCoolDown(persistenceKey, remaining, Date.now() + (remaining / step) * interval);
      }
      loop(remaining);
    }
  }

  function stop() {
    clearTimeout(timer.current);
    timer.current = void 0;
    if (isPersistence && cooling) {
      const [, endAt] = getCoolDown(persistenceKey);
      setCoolDown(persistenceKey, remaining, endAt, STATUS.STOP);
    }
  }

  function reset(c = count) {
    const safeCount = Number.isNaN(Number(c)) ? count : c;
    setRemaining(safeCount);
    if (isPersistence && cooling) {
      const [, , status] = getCoolDown(persistenceKey);
      setCoolDown(persistenceKey, safeCount, Date.now() + (safeCount / step) * interval, status);
    }
  }

  return { remaining, start, reset, stop, cooling };
};
