import React, { useState } from "react";
import {
  useUpdateEffect,
  useMountEffect,
  useUnmountEffect
} from "react-js-utl/hooks";

export default function HooksExample() {
  const [count, setCount] = useState(0);

  // eslint-disable-next-line no-console
  useMountEffect(() => console.log("componentDidMount"));

  // eslint-disable-next-line no-console
  useUpdateEffect(() => console.log("componentDidUpdate"));

  // eslint-disable-next-line no-console
  useUnmountEffect(() => console.log("componentWillUnmount"));

  return (
    <div>
      <p>Updated: {count} times</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Click to update
      </button>
    </div>
  );
}
