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
 * Hook to use the previous given POJO if the given POJO is shallowly equal to the previous one.
 *
 * @param {Object} POJO A POJO object.
 * @return {Object} The given POJO object the very first time or the previous POJO if the given
 *                  POJO is shallowly equal to the previous given POJO.
 */
export default function useShallowEqualMemo(POJO) {
  const ref = useRef({
    init: true,
    POJO
  });
  const ret = useMemo(() => {
    if (ref.current.init) {
      ref.current.init = false;
      return POJO;
    }
    if (shallowEqual(POJO, ref.current.POJO)) {
      return ref.current.POJO;
    } else {
      ref.current.POJO = POJO;
      return POJO;
    }
  }, [POJO]);
  return ret;
}
