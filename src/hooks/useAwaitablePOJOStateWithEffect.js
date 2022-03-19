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
import usePOJOStateWithEffectCallback from "./usePOJOStateWithEffectCallback";

/**
 * Hook to use a POJO state with a `setState` function which can be awaited until the POJO state change is performed
 * and the underlying effect (`useEffect`) is executed.
 *
 * @param {*|Function} initialState The initial POJO state or a lazy callback returning the initial POJO state.
 * @return {Array} A tuple of two values, current POJO state and callback to set POJO state,
 *                 like the one returned by the "usePOJOState" hook.
 *
 *                 The callback to set POJO state may be awaited until the POJO state change is performed
 *                 and the underlying effect (`useEffect`) is executed.
 */
export default function useAwaitablePOJOStateWithEffect(initialState) {
  return useAwaitableState({
    initialState,
    useStateWithSetStateCallback: usePOJOStateWithEffectCallback,
  });
}
