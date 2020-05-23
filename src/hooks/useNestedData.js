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

import useNestedDataCallback from "./useNestedDataCallback";
import { useMemo } from "react";

/**
 * Hook to traverse nested data.
 *
 * @param {Array|Object|Map|WeakMap|ImmutableLinkedOrderedMap} data The data. Can be any of the specified types which in turn have nested data
 *                                                                  of any of the specified types.
 * @param {Array} keys An array of keys. Note that the array is flattened (only its first dimension) and therefore the following arrays
 *                     will be treated as being the same array of keys:
 *
 *                         useNestedDataCallback(data, ["a", "b", "c", "d", "e"]);
 *                         useNestedDataCallback(data, ["a", "b", ["c", "d"], "e"]); // Same as above.
 *
 *                     Each element represents a nested key of the given data.
 * @return {*} The nested data.
 */
export default function useNestedData(data, keys) {
  const callback = useNestedDataCallback(data);
  const nestedData = useMemo(() => callback(keys), [callback, keys]);
  return nestedData;
}
