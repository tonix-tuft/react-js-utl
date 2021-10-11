/*
 * Copyright (c) 2021 Anton Bagdatyev (Tonix)
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

import { useEffect, useState, useRef, useCallback } from "react";
import { randomString, isUndefined } from "js-utl";
import usePOJOState from "./usePOJOState";
import useShallowEqualMemo from "./useShallowEqualMemo";

/**
 * Hook used internally for all hooks allowing to set state with a `setState` callback
 * (`useStateWithEffectCallback`, `useStateWithLayoutEffectCallback`, `usePOJOStateWithEffectCallback`, `usePOJOStateWithLayoutEffectCallback`).
 *
 * @type {Function}
 */
export const useStateWithSetStateCallback = ({ initialState, useEffect }) => {
  const counterRef = useRef([]);
  const randomValueCallback = useCallback(() => {
    counterRef.current++;
    counterRef.current = counterRef.current % Number.MAX_SAFE_INTEGER;
    return `${randomString()}@${counterRef.current}`;
  }, []);

  const [derivedState, setDerivedState] = usePOJOState((...args) => ({
    state:
      typeof initialState === "function" ? initialState(...args) : initialState,
    rand: randomValueCallback(),
  }));

  const state = useShallowEqualMemo(derivedState.state);

  const callbacksRef = useRef([]);

  useEffect(() => {
    const len = callbacksRef.current.length;
    for (let i = 0; i < len; i++) {
      const callback = callbacksRef.current[0];
      callback(state);
      callbacksRef.current.shift();
    }
  }, [derivedState.rand, state]);

  const setStateWithCallback = useCallback(
    (newState, callback = void 0) => {
      let stateUpdate = {};
      const hasCallback = !isUndefined(callback);
      if (hasCallback) {
        callbacksRef.current.push(callback);
        stateUpdate =
          typeof newState === "function"
            ? (derivedState, ...args) => ({
                state: newState(derivedState.state, ...args),
                rand: randomValueCallback(),
              })
            : { state: newState, rand: randomValueCallback() };
      } else {
        stateUpdate =
          typeof newState === "function"
            ? (derivedState, ...args) => ({
                state: newState(derivedState.state, ...args),
              })
            : { state: newState };
      }
      return setDerivedState(stateUpdate);
    },
    [setDerivedState, randomValueCallback]
  );

  return [state, setStateWithCallback];
};

/**
 * Hook to use a state with a `setState` function receiving a callback as its second parameter
 * called in an effect after the state change is performed.
 *
 * @param {*|Function} initialState The initial state or a lazy callback returning the initial state.
 * @return {Array} A tuple of two values, current state and callback to set state,
 *                 like the one returned by the "useState" hook.
 *
 *                 The callback to set state may receive an updater function which will receive
 *                 the previous state as argument and must return the next state.
 *
 *                 The callback to set state may also receive a callback as its second parameter,
 *                 which is called in an effect after the state change is performed.
 */
export default function useStateWithEffectCallback(initialState) {
  return useStateWithSetStateCallback({ initialState, useState, useEffect });
}
