import { useEffect, useRef } from "react";

const useEffectAfterMount = (fn: any, deps: any[]) => {
  const isMount = useRef(false);

  useEffect(() => {
    if (!isMount.current) {
      isMount.current = true;
      return;
    }
    fn();
  }, deps);
};

export default useEffectAfterMount;
