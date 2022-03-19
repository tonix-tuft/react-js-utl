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

import { useState, useEffect } from "react";
import useWindowRef from "./useWindowRef";
import useCallbackRef from "./useCallbackRef";

/**
 * Hook returning whether the user's computer or device is online or offline.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/Online_and_offline_events
 *
 * @return {boolean} True if online, false if offline.
 */
export default function useIsOnline() {
  const windowRef = useWindowRef();
  const [isOnline, setIsOnline] = useState(() =>
    windowRef.current ? windowRef.current.navigator.onLine : false
  );

  const onlineCallbackRef = useCallbackRef(() => {
    setIsOnline(true);
  });
  const offlineCallbackRef = useCallbackRef(() => {
    setIsOnline(false);
  });
  useEffect(() => {
    const onlineCallback = () => onlineCallbackRef.current();
    const offlineCallback = () => offlineCallbackRef.current();
    const w = windowRef.current;
    w.addEventListener("online", onlineCallback);
    w.addEventListener("offline", offlineCallback);

    return () => {
      w.removeEventListener("online", onlineCallback);
      w.removeEventListener("offline", offlineCallback);
    };
  }, [windowRef, onlineCallbackRef, offlineCallbackRef]);

  return isOnline;
}
