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

import { useRef, useMemo } from "react";
import { shallowEqual } from "js-utl";

/**
 * Hook to use the previous given value if the currently given value is shallowly equal to the previous one.
 *
 * @param {*} value A value.
 * @return {*} The given value the very first time or the previous value if the given
 *             value is shallowly equal to the previous given value.
 */
export default function useShallowEqualMemo(value) {
  const ref = useRef({
    init: true,
    value,
  });
  const ret = useMemo(() => {
    if (ref.current.init) {
      ref.current.init = false;
      ref.current.value = value;
      return value;
    }
    if (shallowEqual(value, ref.current.value)) {
      return ref.current.value;
    } else {
      ref.current.value = value;
      return value;
    }
  }, [value]);
  return ret;
}
