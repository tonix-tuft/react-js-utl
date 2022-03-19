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

import { useEffect, useCallback, useState } from "react";
import {
  throttle,
  debounce,
  hasHorizontalScrollbar,
  hasVerticalScrollbar,
} from "js-utl";
import useEventListener from "@use-it/event-listener";

/**
 * @type {Function}
 */
const detect = ({
  ref,
  isScrollable,
  setIsScrollable,
  shouldDetectHorizontallyScrollable,
}) => {
  if (ref.current) {
    const hasScrollbar = shouldDetectHorizontallyScrollable
      ? hasHorizontalScrollbar(ref.current)
      : hasVerticalScrollbar(ref.current);
    if (hasScrollbar && !isScrollable) {
      setIsScrollable(true);
    } else if (!hasScrollbar && isScrollable) {
      setIsScrollable(false);
    }
  }
};

/**
 * @type {Function}
 */
const throttledDetect = throttle(detect, 100);

/**
 * @type {Function}
 */
const debouncedDetect = debounce(detect, 110);

function useDetectScrollablePrivate(
  ref,
  { detectOnResize = true, shouldDetectHorizontallyScrollable = false } = {}
) {
  const [isScrollable, setIsScrollable] = useState(false);

  const detectIfScrollable = useCallback(() => {
    detect({
      ref,
      isScrollable,
      setIsScrollable,
      shouldDetectHorizontallyScrollable,
    });
  }, [ref, isScrollable, shouldDetectHorizontallyScrollable]);

  useEffect(() => {
    detectIfScrollable();
  });

  useEffect(() => {
    if (ref.current && window.ResizeObserver) {
      const element = ref.current;
      const resizeObserver = new ResizeObserver(() => {
        detectIfScrollable();
      });
      resizeObserver.observe(ref.current);
      return () => {
        element && resizeObserver.unobserve(element);
        resizeObserver.disconnect();
      };
    }
  }, [ref, detectIfScrollable]);

  const [eventName, listener] = detectOnResize
    ? [
        "resize",
        () => {
          throttledDetect({
            ref,
            isScrollable,
            setIsScrollable,
            shouldDetectHorizontallyScrollable,
          });
          debouncedDetect({
            ref,
            isScrollable,
            setIsScrollable,
            shouldDetectHorizontallyScrollable,
          });
        },
      ]
    : [void 0, () => {}];
  useEventListener(eventName, listener);

  return isScrollable;
}

/**
 * Hook to determine if an element is scrollable.
 *
 * @param {Object} ref A React ref (e.g. returned by `useRef()`) for the underlying element.
 * @param {Object} [options] Options.
 * @param {boolean} [options.detectOnResize] True to detect the scrollbars also when the window is resized (default),
 *                                           false otherwise.
 * @return {Object} An object with two properties:
 *
 *                      - isVerticallyScrollable (boolean): True if the element is vertically scrollable, false otherwise.
 *                      - isHorizontallyScrollable (boolean): True if the element is horizontally scrollable, false otherwise.
 *
 */
export default function useDetectScrollable(
  ref,
  { detectOnResize = true } = {}
) {
  const isVerticallyScrollable = useDetectScrollablePrivate(ref, {
    detectOnResize,
  });
  const isHorizontallyScrollable = useDetectScrollablePrivate(ref, {
    detectOnResize,
    shouldDetectHorizontallyScrollable: true,
  });

  return { isVerticallyScrollable, isHorizontallyScrollable };
}

/**
 * Hook to determine if an element is vertically scrollable.
 *
 * @param {Object} ref A React ref (e.g. returned by `useRef()`) for the underlying element.
 * @param {Object} [options] Options.
 * @param {boolean} [options.detectOnResize] True to detect the scrollbars also when the window is resized (default),
 *                                           false otherwise.
 * @return {boolean} True if the element is vertically scrollable, false otherwise.
 */
export function useDetectVerticallyScrollable(
  ref,
  { detectOnResize = true } = {}
) {
  return useDetectScrollablePrivate(ref, { detectOnResize });
}

/**
 * Hook to determine if an element is horizontally scrollable.
 *
 * @param {Object} ref A React ref (e.g. returned by `useRef()`) for the underlying element.
 * @param {Object} [options] Options.
 * @param {boolean} [options.detectOnResize] True to detect the scrollbars also when the window is resized (default),
 *                                           false otherwise.
 * @return {Object} True if the element is horizontally scrollable, false otherwise.
 */
export function useDetectHorizontallyScrollable(
  ref,
  { detectOnResize = true } = {}
) {
  return useDetectScrollablePrivate(ref, {
    detectOnResize,
    shouldDetectHorizontallyScrollable: true,
  });
}
