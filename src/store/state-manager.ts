import { useSyncExternalStore } from "react";

export type Listener = () => void;

export function createStore<T>(initialState: T) {
  let subscribers: Listener[] = [];
  let state = initialState;

  const notifyStateChanged = () => {
    subscribers.forEach((listener) => listener());
  };

  return {
    subscribe(fn: Listener) {
      subscribers.push(fn);
      return () => {
        subscribers = subscribers.filter((listener) => listener !== fn);
      };
    },

    getSnapshot() {
      return state;
    },
    setState(newState: T) {
      state = newState;
      notifyStateChanged();
    },
  };
}

export function createUseStore<T>(initialState: T) {
  const store = createStore(initialState);
  return () =>
    [
      useSyncExternalStore(store.subscribe, store.getSnapshot),
      store.setState,
    ] as const;
}
