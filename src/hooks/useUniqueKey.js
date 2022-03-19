/*
 * Copyright (c) 2022 Anton Bagdatyev (Tonix)
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
import { uniqueId, trimRight } from "js-utl";

/**
 * @type {string}
 */
const uniqueKeyPrefix = "react-js-utl-ellViKYMFK-";

/**
 * Hook returning a unique key.
 *
 * @param {*} [dep] An optional dep which, if set and when changed, will force the regeneration of a new key.
 * @return {string} A unique key.
 */
export default function useUniqueKey(dep = void 0) {
  const key = useMemo(
    () =>
      uniqueId(
        `${trimRight(
          `${uniqueKeyPrefix}${typeof dep === "string" ? dep : ""}-`,
          "-"
        )}-`
      ),
    [dep]
  );
  return key;
}
