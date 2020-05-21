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

import { useCallback, useRef } from "react";

/**
 * Hook returning a HOF (higher-order function) which, when called
 * with a given key, returns a memoized function for that same key
 * which can be easily used e.g. in a loop without causing re-renders
 * because of inline arrow functions.
 *
 * @param {Function} fn The function to memoize.
 * @param {Array|undefined} deps Dependencies array for the function, or undefined.
 * @return {Function} A higher-order function which, when called with a given key,
 *                    returns the memoized function "fn" which, when called, will receive
 *                    the key as the first parameter as well as the other parameters passed
 *                    to the memoized function when calling it.
 */
export default function useHOFCallback(fn, deps) {
  const callback = useCallback(fn, deps);
  const ref = useRef({ map: new Map(), callback });

  if (callback !== ref.current.callback) {
    ref.current.map.clear();
    ref.current.callback = callback;
  }

  const HOFCallback = useCallback(
    key => {
      let memoizedFn = ref.current.map.get(key);
      if (!memoizedFn) {
        memoizedFn = (...args) => callback(key, ...args);
        ref.current.map.set(key, memoizedFn);
      }
      return memoizedFn;
    },
    [callback]
  );

  return HOFCallback;
}
