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

import { useLayoutEffect, useEffect, useCallback } from "react";
import useWindowRef from "./useWindowRef";
import usePOJOState from "./usePOJOState";
import { pick } from "js-utl";

/**
 * @type {Object}
 */
const initialDimensions = {
  width: void 0,
  height: void 0
};

/**
 * @type {string[]}
 */
const defaultDimensionProps = ["width", "height"];

/**
 * Hook to get the dimensions of a DOM element.
 *
 * @param {string|Element} element A selector of a DOM element or a DOM element.
 * @param {string[]} dimensionProps Array of dimension props to track.
 *                                  Defaults to ['width', 'height'], i.e. track both width and height.
 * @return {Array|Object} The return value of this hook can be destructured as an array as well as an object.
 *
 *                        When destructuring it as an array, the array will have the dimensions object
 *                        having "width" and "height" properties as its first element and a "forceSetDimensions"
 *                        function as its second element which, if called, will force the recalculation
 *                        of the width and height of the element.
 *
 *                        When destructuring an object, the object will have the "width" and "height" of the DOM element,
 *                        as well as the "forceSetDimensions" function as properties.
 *
 *                        Initially, on first render, both "width" and "height" will be "undefined".
 */
export default function useElementSize(
  element,
  dimensionProps = defaultDimensionProps
) {
  const [dimensions, setDimensions] = usePOJOState(() =>
    pick(...dimensionProps)(initialDimensions)
  );

  const windowRef = useWindowRef();

  const forceSetDimensions = useCallback(() => {
    const finalElement =
      typeof element === "string" ? document.querySelector(element) : element;
    if (finalElement) {
      const boundingClientRect = finalElement.getBoundingClientRect();
      const dimensions = pick(...dimensionProps)(boundingClientRect);
      setDimensions(dimensions);
    } else {
      setDimensions(initialDimensions);
    }
  }, [element, setDimensions, dimensionProps]);

  useEffect(() => {
    const window =
      windowRef.current &&
      windowRef.current.addEventListener("resize", forceSetDimensions);
    return () => {
      window && window.removeEventListener("resize", forceSetDimensions);
    };
  }, [windowRef, forceSetDimensions]);

  useLayoutEffect(forceSetDimensions, [element]);

  const ret = [dimensions, forceSetDimensions];
  for (const prop in dimensions) {
    ret[prop] = dimensions[prop];
  }
  ret.forceSetDimensions = forceSetDimensions;
  return ret;
}
