import { useEffect, useRef, MutableRefObject } from "react";

export function useInterval(callback: Function, delay: number | null) {
  const savedCallback: MutableRefObject<Function | undefined> = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
