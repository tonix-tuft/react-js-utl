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

import { useAwaitableState } from "./useAwaitableStateWithEffect";
import useStateWithLayoutEffectCallback from "./useStateWithLayoutEffectCallback";

/**
 * Hook to use a state with a `setState` function which can be awaited until the state change is performed
 * and the underlying layout effect (`useLayoutEffect`) is executed.
 *
 * @param {*|Function} initialState The initial state or a lazy callback returning the initial state.
 * @return {Array} A tuple of two values, current state and callback to set state,
 *                 like the one returned by the "useState" hook.
 *
 *                 The callback to set state may be awaited until the state change is performed
 *                 and the underlying layout effect (`useLayoutEffect`) is executed.
 */
export default function useAwaitableStateWithLayoutEffect(initialState) {
  return useAwaitableState({
    initialState,
    useStateWithSetStateCallback: useStateWithLayoutEffectCallback,
  });
}
