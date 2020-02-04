/*
 * Copyright (c) 2020 Anton Bagdatyev (Tonix-Tuft)
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

import { useMemo } from "react";
import { extend, isObject } from "js-utl";

/**
 * Hook to extend an object with an array of source objects.
 *
 * @param {Object|Function} destination Destination object or a function returning a destination object.
 * @param {Array} deps An array which defines the dependecies of the hook as well the source objects
 *                     to use to extend the destination object.
 *                     If the nth element of this array is an object, it will always be used as a source object
 *                     when extending the destination object "destination", as well as used as a dep.
 *                     If the nth element of this array is not an object, it will only be used as a dep.
 * @return {Object} The extended destination object.
 */
export default function useExtend(destination, deps) {
  const obj = useMemo(
    destination === "function" ? destination : () => destination,
    deps
  );

  const extendFn = () => extend(obj, ...deps.filter(isObject));
  const finalObj = useMemo(extendFn, deps);
  return finalObj;
}
