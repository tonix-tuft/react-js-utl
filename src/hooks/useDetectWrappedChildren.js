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

import { useLayoutEffect } from "react";
import { detectWrapped, isEmpty } from "js-utl";
import useElementSize from "./useElementSize";
import usePrevious from "./usePrevious";
import usePOJOState from "./usePOJOState";

/**
 * Hook detecting wrapped DOM children elements given a ref.
 *
 * @param {Object} ref A ref.
 * @return {Object} An object with the following properties:
 *
 *                      - areWrapped (bool): true if the DOM children elements wrap and are not on the same line
 *                                           (according to their top position);
 *                      - wrapped (Element[]): An array of the wrapped DOM children elements;
 */
export default function useDetectWrappedChildren(ref) {
  const [{ width }] = useElementSize(ref, ["width"]);
  const prevWidth = usePrevious(width);
  const [state, setState] = usePOJOState(() => ({
    areWrapped: void 0,
    wrapped: [],
  }));
  useLayoutEffect(() => {
    if (ref.current && width !== prevWidth) {
      const wrapped = detectWrapped(ref.current);
      setState({
        areWrapped: !isEmpty(wrapped),
        wrapped,
      });
    }
  }, [setState, prevWidth, width, ref]);
  return state;
}
