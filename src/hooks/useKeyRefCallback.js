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

import React, { useCallback, useRef } from "react";

/**
 * Hook to return a callback which, if called with a key/id, will return a new ref for that key
 * or the same ref for that key if the ref for that key was already created previously
 * (therefore this callback is useful e.g. when creating refs dynamically in a loop or when using `.map()`
 * during the rendering of a React component).
 *
 * @return {(key: string|number) => {current: *}} The callback accepting a key and returning a ref for that key
 *                                                (the same ref for that key if a ref for that key was already created previously).
 */
export default function useKeyRefCallback() {
  const mapRef = useRef({});
  return useCallback(key => {
    mapRef.current[key] = mapRef.current[key] || React.createRef();
    return mapRef.current[key];
  }, []);
}
