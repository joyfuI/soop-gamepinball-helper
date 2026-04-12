import { useCallback, useRef, useSyncExternalStore } from 'react';

import type { DotPath, DotPathValue, StoreType } from '../types';

type CustomStoreEvent = CustomEvent<{ key: string }>;

declare global {
  interface WindowEventMap {
    store: CustomStoreEvent;
  }
}

// key는 electron/store.ts에서 먼저 선언해둘 것
const useStore = <K extends DotPath<StoreType>>(key: K) => {
  const snapshotRef = useRef(
    window.electron.getStore(key) as DotPathValue<StoreType, K>,
  );

  const subscribe = useCallback(
    (callback: () => void) => {
      const handleStoreEvent = (event: CustomStoreEvent) => {
        if (event.detail.key === key) {
          snapshotRef.current = window.electron.getStore(key) as DotPathValue<
            StoreType,
            K
          >;
          callback();
        }
      };

      window.addEventListener('store', handleStoreEvent);
      return () => {
        window.removeEventListener('store', handleStoreEvent);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(() => snapshotRef.current, []);

  const storedValue = useSyncExternalStore(subscribe, getSnapshot);
  const storedValueRef = useRef(storedValue);
  storedValueRef.current = storedValue;

  const setValue = useCallback(
    (
      newValue:
        | DotPathValue<StoreType, K>
        | ((
            oldValue: DotPathValue<StoreType, K>,
          ) => DotPathValue<StoreType, K>),
    ) => {
      const value =
        typeof newValue === 'function'
          ? (
              newValue as (
                oldValue: DotPathValue<StoreType, K>,
              ) => DotPathValue<StoreType, K>
            )(storedValueRef.current)
          : newValue;
      window.electron.setStore(key, value);
      window.dispatchEvent(new CustomEvent('store', { detail: { key } })); // 커스텀 이벤트 발생
    },
    [key],
  );

  const delValue = useCallback(() => {
    window.electron.deleteStore(key);
    window.dispatchEvent(new CustomEvent('store', { detail: { key } })); // 커스텀 이벤트 발생
  }, [key]);

  return [storedValue, setValue, delValue] as const;
};

export default useStore;
