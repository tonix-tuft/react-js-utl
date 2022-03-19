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

import { useRef, useEffect } from "react";

/**
 * Returns a ref for a callback.
 *
 * Useful e.g. when using callbacks within a callback of "useEffect" hook
 * which should not interfere with the deps array of the hook and yet having
 * a reference to the up-to-date callback within the "useEffect" hook's callback
 * through the "current" property.
 *
 * @see https://github.com/donavon/use-event-listener/issues/27
 *
 * @param {Function} callback A callback.
 * @return {Object} A ref for the given callback.
 *                  The returned ref could and should be passed as a dep to the dependencies array
 *                  of a hook using it because React guarantees that the returned object will persist
 *                  for the full lifetime of the component.
 * @return {Object.current} The up-to-date callback.
 */
export default function useCallbackRef(callback) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return callbackRef;
}
