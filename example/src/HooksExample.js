import React, { useState, useRef } from "react";
import {
  useUpdateEffect,
  useMountEffect,
  useUnmountEffect,
  usePOJOState,
  useForceUpdate,
  useHOFCallback,
  useFactory
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

  const forceUpdate = useForceUpdate();

  const [POJOState, setPOJOState] = usePOJOState({
    a: 123,
    b: 456
  });

  const HOFCallback = useHOFCallback(key => key * count * 2, [count]);
  const callback = HOFCallback(3);
  const callbackRef = useRef(callback);
  // eslint-disable-next-line no-console
  console.log(
    callback(),
    callback,
    callbackRef.current,
    callback === callbackRef.current
      ? "callback === callbackRef.current"
      : "callback !== callbackRef.current"
  );
  callbackRef.current = callback;

  const factoryValue = useFactory(
    () => [[() => false, 123], [true, 456], [() => false, 789], "default"],
    []
  );

  return (
    <div>
      <div>
        <p>Counter: {count}</p>
        <button
          onClick={() => {
            setCount(count + 1);
          }}
        >
          Click to update the counter
        </button>
      </div>

      <div>
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

      <div>
        <button onClick={forceUpdate}>Click to force update</button>
      </div>

      <div>Factory value: {JSON.stringify(factoryValue)}</div>
    </div>
  );
}
