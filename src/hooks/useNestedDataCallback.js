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

import { useCallback } from "react";
import { shallowEqual } from "js-utl";
import ImmutableLinkedOrderedMap from "immutable-linked-ordered-map";
import useFactory from "./useFactory";
import usePrevious from "./usePrevious";
import declarativeFactory from "declarative-factory";

const dataGetKey = (data, key) => data.get(key);

/**
 * @type {Object}
 */
const mapTraverseFactory = {
  traverse: dataGetKey,
};

/**
 * @type {Object}
 */
const weakMapTraverseFactory = {
  traverse: dataGetKey,
};

/**
 * @type {Object}
 */
const immutableLinkedOrderedMapTraverseFactory = {
  traverse: dataGetKey,
};

/**
 * @type {Object}
 */
const propTraverseFactory = {
  traverse: (data, key) => data[key],
};

/**
 * Hook returning a callback to traverse nested data.
 *
 * @param {Array|Object|Map|WeakMap|ImmutableLinkedOrderedMap} data The data. Can be any of the specified types which in turn have nested data
 *                                                                  of any of the specified types.
 * @return {(keys: Array) => *} The nested data callback which receives the keys and if called returns the nested data for the given keys, if any, or undefined.
 *                              The nested data callback takes an array of keys as argument. Note that the array is flattened (only its first dimension)
 *                              and therefore the following arrays will be treated as being the same array of keys:
 *
 *                                  useNestedDataCallback(data, ["a", "b", "c", "d", "e"]);
 *                                  useNestedDataCallback(data, ["a", "b", ["c", "d"], "e"]); // Same as above.
 *
 *                              Each element represents a nested key of the given data.
 */
export default function useNestedDataCallback(data) {
  const prevData = usePrevious(data);
  const finalDataFactory = useFactory(
    () => [
      [
        data instanceof Map ||
          data instanceof WeakMap ||
          ImmutableLinkedOrderedMap.isMap(data),
        () => (prevData === data ? prevData : data),
      ],
      () => (shallowEqual(prevData, data) ? prevData : data),
    ],
    [data]
  );

  const finalData = finalDataFactory();
  const callback = useCallback(
    keys => {
      const data = finalData;
      const effectiveKeys = keys.flat();
      let consumedKeysCount = 0;
      let currentData = data;
      for (const key of effectiveKeys) {
        if (!currentData) {
          break;
        }
        const traverseFactory = declarativeFactory([
          [currentData instanceof Map, mapTraverseFactory],
          [currentData instanceof WeakMap, weakMapTraverseFactory],
          [
            () => {
              if (ImmutableLinkedOrderedMap.isMap(currentData)) {
                return true;
              } else {
                return false;
              }
            },
            immutableLinkedOrderedMapTraverseFactory,
          ],
          propTraverseFactory,
        ]);
        currentData = traverseFactory.traverse(currentData, key);
        consumedKeysCount++;
      }
      return consumedKeysCount === effectiveKeys.length ? currentData : void 0;
    },
    [finalData]
  );
  return callback;
}
