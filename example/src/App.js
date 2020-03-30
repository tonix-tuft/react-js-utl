import React, { useState, useRef } from "react";
import {
  getDisplayName,
  refCallback,
  isReactComponent,
  isClassComponent,
  isFunctionalComponent,
  isReactHOC
} from "react-js-utl/utils";
import HooksExample from "./HooksExample";

const ClassComponent = class ClassComponent extends React.Component {};

const ReactMemoClass = React.memo(ClassComponent);
ReactMemoClass.displayName = `ReactMemo(${getDisplayName(ReactMemoClass)})`;

const ReactMemoFn = React.memo(App);
ReactMemoFn.displayName = `ReactMemo(${getDisplayName(ReactMemoFn)})`;

const notAReactComponent = () => {};

export default function App() {
  const [shouldUnmountHooksExample, setShouldUnmountHooksExample] = useState(
    false
  );
  const ref = useRef(null);
  const testComponents = [
    App,
    ClassComponent,
    ReactMemoFn,
    ReactMemoClass,
    notAReactComponent
  ];
  return (
    <div className="app">
      <div ref={refCallback(ref, "contentEditable")}>{getDisplayName(App)}</div>
      <div>
        {testComponents.map(testComponent => (
          <pre key={getDisplayName(testComponent)}>
            {getDisplayName(testComponent)}:{" "}
            {JSON.stringify({
              isReactComponent: isReactComponent(testComponent),
              isClassComponent: isClassComponent(testComponent),
              isFunctionalComponent: isFunctionalComponent(testComponent),
              isReactHOC: isReactHOC(testComponent)
            })}
          </pre>
        ))}
      </div>
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
