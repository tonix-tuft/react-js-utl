import React, { useState, useRef } from "react";
import { getDisplayName, refCallback } from "react-js-utl/utils";
import HooksExample from "./HooksExample";

export default function App() {
  const [shouldUnmountHooksExample, setShouldUnmountHooksExample] = useState(
    false
  );
  const ref = useRef(null);
  return (
    <div className="app">
      <div ref={refCallback(ref, "contentEditable")}>{getDisplayName(App)}</div>
      {!shouldUnmountHooksExample && <HooksExample />}
      <button
        onClick={() => {
          setShouldUnmountHooksExample(true);
        }}
      >
        Click to unmount hooks example component
      </button>
    </div>
  );
}
