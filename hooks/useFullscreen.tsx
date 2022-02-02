import { useEffect, useState } from 'react';
import type { MutableRefObject } from 'react';

export interface useFullscreenParams<T extends Element> {
  ref: MutableRefObject<T | null>;
  onfullscreenchange?: T['onfullscreenchange'];
  onfullscreenerror?: T['onfullscreenerror'];
}

export default <T extends Element>({
  ref,
  onfullscreenchange,
  onfullscreenerror,
}: useFullscreenParams<T>) => {
  const [inFullscreen, setInFullscreen] = useState(false);

  useEffect(() => {
    const current = ref.current;
    function _fullscreenchange() {
      if (current !== document.fullscreenElement) setInFullscreen(false);
    }
    if (current) {
      if (onfullscreenchange) current.addEventListener('fullscreenchange', onfullscreenchange);
      if (onfullscreenerror) current.addEventListener('fullscreenerror', onfullscreenerror);

      current.addEventListener('fullscreenchange', _fullscreenchange);
    }

    return () => {
      if (current) {
        if (onfullscreenchange) current.removeEventListener('fullscreenchange', onfullscreenchange);
        if (onfullscreenerror) current.removeEventListener('fullscreenerror', onfullscreenerror);

        current.removeEventListener('fullscreenchange', _fullscreenchange);
      }
    };
  }, [onfullscreenchange, onfullscreenerror, ref]);

  async function fullscreen() {
    return await ref.current?.requestFullscreen().then(() => setInFullscreen(true));
  }

  async function exitFullscreen() {
    if (document.fullscreenElement) {
      return await document.exitFullscreen().then(() => setInFullscreen(false));
    }
  }

  async function triggerFullscreen() {
    if (inFullscreen) {
      await exitFullscreen();
    } else {
      await fullscreen();
    }
  }

  return { inFullscreen, triggerFullscreen, fullscreen, exitFullscreen };
};
