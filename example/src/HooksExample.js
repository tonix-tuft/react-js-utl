import React, { useState } from "react";
import {
  useUpdateEffect,
  useMountEffect,
  useUnmountEffect,
  usePOJOState
} from "react-js-utl/hooks";

export default function HooksExample() {
  const [count, setCount] = useState(0);

  // eslint-disable-next-line no-console
  console.log("Rendering HooksExample");

  // eslint-disable-next-line no-console
  useMountEffect(() => console.log("componentDidMount"));

  // eslint-disable-next-line no-console
  useUpdateEffect(() => console.log("componentDidUpdate"));

  // eslint-disable-next-line no-console
  useUnmountEffect(() => console.log("componentWillUnmount"));

  const [POJOState, setPOJOState] = usePOJOState({
    a: 123,
    b: 456
  });

  return (
    <div>
      <p>Counter: {count}</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Click to update the counter
      </button>
      <button
        onClick={() => {
          setPOJOState(prevState => ({
            b: prevState.b * 2
          }));
        }}
      >
        Click to update POJO state
      </button>
      <div>
        <p>POJO state:</p>
        <pre>
          <code>{JSON.stringify(POJOState, void 0, 4)}</code>
        </pre>
      </div>
    </div>
  );
}
