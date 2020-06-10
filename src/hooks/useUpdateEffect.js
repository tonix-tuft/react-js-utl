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

import { useRef, useEffect } from "react";
import { isArray } from "js-utl";

/**
 * Hook to execute a callback each time a component updates
 * (not when it mounts on the initial render).
 *
 * @param {Function} fn The callback to execute.
 * @param {Array|undefined} [deps] Dependencies array to use.
 * @return {undefined}
 */
export default function useUpdateEffect(fn, deps = void 0) {
  const isInitialRenderRef = useRef(true);
  if (isArray(deps)) {
    // This is needed so that the update effect is triggered on the first update
    // even if the deps array didn't change.
    if (deps.length) {
      if (isInitialRenderRef.current) {
        deps = [...deps];
        let shouldBreak = false;
        while (true) {
          const rand = Math.random();
          for (let i = 0; i < deps.length; i++) {
            const value = deps[i];
            if (rand !== value) {
              shouldBreak = true;
              break;
            }
            deps[i] = rand + 1;
          }
          if (shouldBreak) {
            break;
          }
        }
      }
    } else {
      if (isInitialRenderRef.current) {
        deps = [0];
      } else {
        deps = [1];
      }
    }
  }
  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }
    return fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
