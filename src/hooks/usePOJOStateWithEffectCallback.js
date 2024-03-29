/*
 * Copyright (c) 2022 Anton Bagdatyev (Tonix)
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

import { useEffect } from "react";
import { useStateWithSetStateCallback } from "./useStateWithEffectCallback";
import usePOJOState from "./usePOJOState";
import { partialShallowEqual } from "js-utl";

/**
 * @type {Function}
 */
export const onStateUpdate = ({ prevState, newState }) => ({
  ...prevState,
  ...newState,
});

/**
 * For POJO state, bails out if the new state is null or partially shallowly equal to the previous state.
 *
 * @type {Function}
 */
export const onHasBailedOut = ({ prevState, newState }) =>
  newState === null || partialShallowEqual(prevState, newState);

/**
 * Hook to use a POJO state with a `setState` function receiving a callback as its second parameter
 * called in an effect after the state change is performed.
 *
 * @param {*|Function} initialState The initial POJO state or a lazy callback returning the initial POJO state.
 * @return {Array} A tuple of two values, current POJO state and callback to set the POJO state,
 *                 like the one returned by the "usePOJOState" hook.
 *
 *                 The callback to set state may receive an updater function which will receive
 *                 the previous state as argument and must return the next state.
 *
 *                 The callback to set state may also receive a callback as its second parameter,
 *                 which is called in an effect after the state change is performed.
 */
export default function usePOJOStateWithEffectCallback(initialState) {
  return useStateWithSetStateCallback({
    initialState,
    useState: usePOJOState,
    useEffect,
    onStateUpdate,
    onHasBailedOut,
  });
}
