import React, { useState } from "react";
import { getDisplayName } from "react-js-utl/utils";
import HooksExample from "./HooksExample";

export default function App() {
  const [shouldUnmountHooksExample, setShouldUnmountHooksExample] = useState(
    false
  );
  return (
    <div>
      <div>{getDisplayName(App)}</div>
      {!shouldUnmountHooksExample && <HooksExample />}
      <button onClick={() => setShouldUnmountHooksExample(true)}>
        Click to unmount hooks example component
      </button>
    </div>
  );
}
