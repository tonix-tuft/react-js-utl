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

import { useMemo, useCallback } from "react";
import { isArray } from "js-utl";

/**
 * Hook to easily create interchangeable factories switching them
 * in a declarative way based on the given runtime parameters.
 *
 * @param {Function} tuplesFn A function returning an array of tuples, each tuple being an array of two elements:
 *
 *                                - testCondition: A boolean value or a function returning a boolean value
 *                                                 which, if "true", instructs this hook to return the "factory" factory
 *                                                 bound to this "testCondition".
 *                                                 Note that the first "factory" for which "testCondition" is truthy
 *                                                 will be returned and further tuples will be ignored;
 *
 *                                - factory: Anything. The value to return if "testCondition" is a truthy value
 *                                           or a function returning a truthy value.
 *
 *                            The last element of the returned tuples MAY not be a tuple array with two elements,
 *                            and in such case it will be treated as the default factory value to return if none
 *                            of the test conditions of the previous factories are satisfied.
 *                            If the last tuple is not a default value and none of the test conditions of the previous
 *                            factories are satisfied as well as for the factory of last tuple, then "undefined"
 *                            will be returned by this hook.
 * @param {Array|undefined} [deps] Dependencies array to use.
 * @return {*} The first factory value for which the test is truthy or returns a truthy value, a default factory value,
 *             or "undefined".
 */
export default function useFactory(tuplesFn, deps = void 0) {
  const tuples = useMemo(tuplesFn, deps || []);

  // "testConditionFn" is pure and does never change.
  const testConditionFn = useCallback(
    testCondition =>
      Boolean(
        typeof testCondition === "function" ? testCondition() : testCondition
      ),
    []
  );

  const factoryValue = useMemo(() => {
    let i = 0;
    // Loop through all the tuples except the last one (handled after this loop).
    for (; i < tuples.length - 1; i++) {
      const tuple = tuples[i];
      const [testCondition, factoryValue] = tuple;
      if (testConditionFn(testCondition)) {
        // Test condition for factory value is satisfied.
        return factoryValue;
      }
    }
    const lastTuple = tuples[i];
    if (isArray(lastTuple) && lastTuple.length === 2) {
      const [testCondition, factoryValue] = lastTuple;
      if (testConditionFn(testCondition)) {
        // Test condition for last factory value is satisfied.
        return factoryValue;
      }

      // No default and no factory value satisfying a test condition.
      return void 0;
    } else {
      // Default factory value.
      return lastTuple;
    }
  }, [testConditionFn, tuples]);

  return factoryValue;
}
