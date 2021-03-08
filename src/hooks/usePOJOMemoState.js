import { useRef, useMemo, useEffect } from "react";
import usePOJOState from "./usePOJOState";

/**
 * Hook to use a POJO state which merges values of the previous state with the next one
 * if the partial state update of the next state is not the same as the previous state
 * for the same keys depending on the POJO passed as parameter.
 *
 * The difference from the "usePOJOState" hook is that as soon as the POJO passed as parameter changes
 * (i.e. its reference points to another object), the state is reinitialized.
 *
 * Another difference is that this hook doesn't accept a function returning a POJO as its initial state because
 * it doesn't make sense in this context as the POJO itself is needed to be passed as parameter to this hook
 * in order to determine if it changed since the last rendering.
 *
 * @param {Object} POJO A POJO (Plain Old JavaScript Object).
 * @return {Array} A tuple of two values, current state POJO and callback to set state,
 *                 like the one returned by the "useState" hook.
 *
 *                 The callback to set state may receive an updater function which will receive
 *                 the previous POJO state as argument and must return the next partial POJO state
 *                 update or "null" (to bail out of the state update, read below).
 *
 *                 If the updater function returns "null" or a partial POJO state update which
 *                 has the same values for the same keys as the current POJO state, the update will be
 *                 bailed out as for the "useState" hook.
 */
export default function usePOJOMemoState(POJO) {
  const originalPOJO = POJO;

  const rehidrateStateRef = useRef(false);
  POJO = useMemo(() => {
    rehidrateStateRef.current = true;
    return originalPOJO;
  }, [originalPOJO]);

  let setState;
  [POJO, setState] = usePOJOState(POJO);

  useEffect(() => {
    if (rehidrateStateRef.current) {
      rehidrateStateRef.current = false;
      setState(originalPOJO);
    }
  }, [originalPOJO, setState]);

  return [POJO, setState];
}
