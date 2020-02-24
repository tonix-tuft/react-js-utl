/*
 * Copyright (c) 2020 Anton Bagdatyev (Tonix)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

import { useState, useMemo } from "react";
import { partialShallowEqual } from "js-utl";

/**
 * Hook to use a POJO state which merges values of the previous state with the next one
 * if the partial state update of the next state is not the same as the previous state
 * for the same keys.
 *
 * @param {Object} initialState The initial state, a POJO (Plain Old JavaScript Object).
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
export default function usePOJOState(initialState) {
  const [state, setState] = useState(initialState);
  const setPOJOState = useMemo(() => {
    return nextState =>
      setState(prevState => {
        const newState =
          typeof nextState === "function" ? nextState(prevState) : nextState;
        if (newState === null) {
          return prevState;
        } else {
          return partialShallowEqual(prevState, newState)
            ? prevState
            : { ...prevState, ...newState };
        }
      });
  }, []);
  return [state, setPOJOState];
}
