/*
 * Copyright (c) 2021 Anton Bagdatyev (Tonix)
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

import useFactory from "./useFactory";
import ImmutableLinkedOrderedMap from "immutable-linked-ordered-map";

/**
 * Hook returning an array for a given a data structure.
 *
 * @param {Array|ImmutableLinkedOrderedMap} dataStructure A data structure.
 * @return {Array} An array containing the values of the data structure.
 *                 If an array is given as the data structure, the same array will be returned by this hook.
 */
export default function useArray(dataStructure) {
  const arrayFactoryFn = useFactory(
    () => [
      [
        ImmutableLinkedOrderedMap.isMap(dataStructure),
        () => dataStructure.values(),
      ],
      () => dataStructure,
    ],
    [dataStructure]
  );
  return arrayFactoryFn();
}
