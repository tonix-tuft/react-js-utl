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
import useIsUpdate from "./useIsUpdate";
import {
  isObject,
  shallowEqual,
  shallowObjectDiff,
  isObjectEmpty,
  extend,
} from "js-utl";

/**
 * Hook to use a cumulative shallow diff of a value.
 *
 * @param {*} value A value.
 * @return {*} The given value, initially.
 *
 *             The previous value if the given value is equal to the previous one and both
 *             are not objects.
 *
 *             If the previous value and the given value are both objects,
 *             then this hook will only return an object containing the diff between the two
 *             accumulating the new keys and their corresponding values.
 *             In this last case, if the resulting object containing the diff is empty
 *             (meaning there's no diff) or if the diff is shallowly equal
 *             to the previous one, then the previous diff object will be returned
 *             if a diff was performed at least once previously, otherwise the previous value
 *             will be returned, meaning that there wasn't a diff before yet
 *             (useful for the array of dependencies of other hooks like "useEffect" and "useMemo").
 */
export default function useCumulativeShallowDiff(value) {
  const valueDiffRef = useRef({
    value,
    diff: {},
    werePreviousAndCurrentObjectsDiffedAndThereWasADiff: false,
  });

  const isUpdate = useIsUpdate();
  value = useMemo(() => {
    const previousValue = valueDiffRef.current.value;
    if (!isUpdate) {
      return previousValue;
    }
    if (isObject(previousValue) && isObject(value)) {
      const previousDiff = valueDiffRef.current.diff;
      const diff = shallowObjectDiff(previousValue, value);
      const newDiff = diff.objB;
      if (isObjectEmpty(newDiff) || shallowEqual(previousDiff, newDiff)) {
        return valueDiffRef.current
          .werePreviousAndCurrentObjectsDiffedAndThereWasADiff
          ? previousDiff
          : previousValue;
      } else {
        valueDiffRef.current.werePreviousAndCurrentObjectsDiffedAndThereWasADiff = true;
        valueDiffRef.current.value = extend({}, previousValue, newDiff);
        valueDiffRef.current.diff = newDiff;
        return newDiff;
      }
    } else {
      valueDiffRef.current.werePreviousAndCurrentObjectsDiffedAndThereWasADiff = false;
      valueDiffRef.current.diff = {};
      if (shallowEqual(previousValue, value)) {
        return previousValue;
      }
      valueDiffRef.current.value = value;
      return value;
    }
  }, [isUpdate, value]);

  return value;
}
