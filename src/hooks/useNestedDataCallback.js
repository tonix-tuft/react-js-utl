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
import visitor from "../primitives/visitor";
import isPrimitiveOfType from "../primitives/predicates/isPrimitiveOfType";

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
 * @type {Object}
 */
const yesVisitorKeyFactory = visitor => ({
  key: () => visitor.key,
  visit: (...args) => visitor.visit(...args),
});

/**
 * @type {Object}
 */
const noVisitorKeyFactory = finalKey => ({
  key: () => finalKey,
  visit: () => {},
});

/**
 * Hook returning a callback to traverse nested data.
 *
 * @param {Array|Object|Map|WeakMap|ImmutableLinkedOrderedMap} data The data. Can be any of the specified types which in turn have nested data
 *                                                                  of any of the specified types.
 * @return {(keys: Array) => *} The nested data callback which receives the keys and if called returns the nested data for the given keys, if any, or undefined.
 *                              The nested data callback takes an array of keys as argument. Note that the array is flattened (only its first dimension)
 *                              and therefore the following arrays will be treated as being the same array of keys:
 *
 *                                  import { useNestedDataCallback } from "react-js-utl/hooks";
 *
 *                                  // Inside functional component:
 *                                  useNestedDataCallback(data)(["a", "b", "c", "d", "e"]);
 *                                  useNestedDataCallback(data)(["a", "b", ["c", "d"], "e"]); // Same as above.
 *
 *                              Each element represents a nested key of the given data.
 *
 *                              An element can also be a visitor primitive returned by the "visitor" primitive function:
 *
 *                                  import { useNestedDataCallback } from "react-js-utl/hooks";
 *                                  import { visitor } from "react-js-utl/primitives";
 *
 *                                  // Inside functional component:
 *                                  useNestedDataCallback(data)([
 *                                      "a",
 *                                      visitor("b", ({
 *                                          currentData,
 *                                          depth,
 *                                          key,
 *                                          path,
 *                                          pathData,
 *                                          data,
 *                                      }) => {
 *                                          // Called when visiting the nested data ("currentData") for the "b" key (depth 1)
 *                                          // if the data for the "b" key is not "undefined".
 *                                      }),
 *                                      "c",
 *                                      "d",
 *                                      "e"
 *                                  ]);
 *
 *                              The visitor function allows to perform a custom behaviour when visiting the nested data.
 *                              Note that the visitor function will only be called if the underlying visited data for a given nested key
 *                              is not "undefined".
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
      let depth = 0;
      let currentData = data;
      let path = [];
      let pathData = [];
      for (const key of effectiveKeys) {
        if (!currentData) {
          break;
        }
        const traverseFactory = declarativeFactory([
          [() => currentData instanceof Map, mapTraverseFactory],
          [() => currentData instanceof WeakMap, weakMapTraverseFactory],
          [
            () => ImmutableLinkedOrderedMap.isMap(currentData),
            immutableLinkedOrderedMapTraverseFactory,
          ],
          propTraverseFactory,
        ]);
        const visitorFactory = declarativeFactory([
          [() => isPrimitiveOfType(key, visitor), yesVisitorKeyFactory(key)],
          noVisitorKeyFactory(key),
        ]);
        const finalKey = visitorFactory.key();
        currentData = traverseFactory.traverse(currentData, finalKey);
        path = path.concat(finalKey);
        pathData = pathData.concat(currentData);
        if (typeof currentData !== "undefined") {
          visitorFactory.visit({
            currentData,
            depth,
            key: finalKey,
            path,
            pathData,
            data,
          });
        }
        depth++;
      }
      return depth === effectiveKeys.length ? currentData : void 0;
    },
    [finalData]
  );
  return callback;
}
