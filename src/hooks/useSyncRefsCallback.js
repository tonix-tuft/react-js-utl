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

import { useCallback } from "react";
import useCallbackRef from "./useCallbackRef";

/**
 * @type {Function}
 */
const setRef = (refToSync, args) => {
  const [ref] = args;
  if (typeof refToSync === "function") {
    refToSync(...args);
  } else if (refToSync) {
    refToSync.current = ref;
  }
};

/**
 * Hook returning a callback ref which synchronizes all the refs given as parameter.
 *
 * @param {...Object} refs The refs to sync.
 * @return {Function} The callback ref synchronizing the given refs.
 */
export default function useSyncRefsCallback(...refs) {
  const syncCallbackRef = useCallbackRef((...args) => {
    refs.map(refToSync => setRef(refToSync, args));
  });
  const callbackRef = useCallback(
    (...args) => {
      syncCallbackRef.current(...args);
    },
    [syncCallbackRef]
  );
  return callbackRef;
}
