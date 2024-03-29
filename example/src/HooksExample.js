import React, { useState, useRef, useMemo } from "react";
import {
  useUpdateEffect,
  useMountEffect,
  useUnmountEffect,
  usePOJOState,
  useForceUpdate,
  useHOFCallback,
  useFactory,
  useExtend,
  useShallowEqualMemo,
  useUniqueKey,
  useNestedData,
  useIsOnline,
  useAwaitableState,
  useAwaitablePOJOState,
  useDetectScrollable,
  useDetectVerticallyScrollable,
  useDetectHorizontallyScrollable,
} from "react-js-utl/hooks";
import { visitor } from "react-js-utl/primitives";
import ImmutableLinkedOrderedMap from "immutable-linked-ordered-map";

export default function HooksExample() {
  const [count, setCount] = useState(0);

  // eslint-disable-next-line no-console
  console.log("Rendering HooksExample");

  // eslint-disable-next-line no-console
  useMountEffect(() => console.log("componentDidMount"));

  // eslint-disable-next-line no-console
  useUpdateEffect(() => console.log("componentDidUpdate"));

  const dep = count % 3 < 1 ? 0 : 1;
  // eslint-disable-next-line no-console
  useUpdateEffect(() => console.log("componentDidUpdate with deps"), [1, dep]);
  // eslint-disable-next-line no-console
  useUpdateEffect(() => console.log("componentDidUpdate with empty deps"), []);

  // eslint-disable-next-line no-console
  useUnmountEffect(() => console.log("componentWillUnmount"));

  const forceUpdate = useForceUpdate();

  const [POJOState, setPOJOState] = usePOJOState({
    a: 123,
    b: 456,
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

  const memoObj1 = useMemo(() => ({ a: 999, e: 111 }), []);
  const memoObj2 = useMemo(() => ({ c: { d: 555, f: "A string" } }), []);
  const destinationObj = { a: 123, b: 456, c: { d: 789 } };
  const obj = useExtend(destinationObj, [
    memoObj1,
    1,
    memoObj2,
    "Ignore as it is not a source",
  ]);
  obj.a = "A value";
  obj.c.f = "Another string";
  // eslint-disable-next-line no-console
  console.log(
    "useExtend - destinationObj === obj ?",
    destinationObj === obj,
    "\ndestinationObj = ",
    destinationObj,
    "\nmemoObj1 = ",
    memoObj1,
    "\nmemoObj2 = ",
    memoObj2,
    "\nobj = ",
    obj
  );

  const objWithNestedArray = useExtend(
    { a: 1, b: [2, { c: 3 }] },
    [{ b: [999, { d: 4 }] }],
    { extendArrays: true }
  );
  // eslint-disable-next-line no-console
  console.log("useExtend - objWithNestedArray", objWithNestedArray);

  const initialPOJO = { a: 1, b: 2 };
  const initialPOJORef = useRef(initialPOJO);
  const POJO = useShallowEqualMemo(initialPOJO);
  // eslint-disable-next-line no-console
  console.log(
    `useShallowEqualMemo - POJO === initialPOJORef.current`,
    POJO === initialPOJORef.current
  );

  const uniqueKey = useUniqueKey();
  // eslint-disable-next-line no-console
  console.log(`Unique key: ${uniqueKey}`);

  const weakMapKey1Ref = useRef({});
  const weakMapKey2Ref = useRef([]);
  const objKey = {};
  const map = new Map();
  const nestedMap = new Map();
  const nestedNestedMap = new Map();
  const weakMap = new WeakMap();
  const nestedWeakMap = new WeakMap();
  nestedWeakMap.set(weakMapKey2Ref.current, {
    linkedOrderedMap: new ImmutableLinkedOrderedMap({
      initialItems: [
        {
          immutableLinkedOrderedMapKey1: {
            prop1: new ImmutableLinkedOrderedMap({
              initialItems: [{ id: "prop2", value: "Hello world!!!" }],
            }),
          },
        },
      ],
    }),
  });
  weakMap.set(weakMapKey1Ref.current, { nestedWeakMap });
  nestedNestedMap.set("nested_nested_map", {
    d: { e: [0, { f: { g: { weakMap } } }] },
  });
  nestedMap.set(objKey, nestedNestedMap);
  map.set("map_a", nestedMap);
  const data = { a: { b: { c: map } }, h: 123, i: { l: [1, 2, 3] } };
  const value = useNestedData(data, [
    "a",
    ["b"],
    ["c", "map_a"],
    [objKey, "nested_nested_map"],
    "d",
    "e",
    1,
    "f",
    "g",
    "weakMap",
    [weakMapKey1Ref.current],
    ["nestedWeakMap", weakMapKey2Ref.current, "linkedOrderedMap"],
    ["immutableLinkedOrderedMapKey1"],
    "prop1",
    ["prop2", "value"],
  ]);
  // eslint-disable-next-line no-console
  console.log("useNestedData value", value);

  const nestedDataValue = useNestedData({ a: { b: { c: { d: 123 } } } }, [
    "a",
    visitor("b")(({ currentData, depth, key, path, pathData, data }) =>
      // eslint-disable-next-line no-console
      console.log(
        'Visiting "b" key: ',
        currentData,
        depth,
        key,
        path,
        pathData,
        data
      )
    ),
    "c",
    "d",
  ]);
  // eslint-disable-next-line no-console
  console.log("useNestedData value", nestedDataValue);

  const isOnline = useIsOnline();
  // eslint-disable-next-line no-console
  console.log("isOnline", isOnline);

  const [awaitableCounter, setAwaitableCounter] = useAwaitableState(0);
  const [awaitablePOJO, setAwaitablePOJO] = useAwaitablePOJOState({
    a: 1,
    b: 2,
  });

  const awaitablePOJOJSON = JSON.stringify(awaitablePOJO);

  // eslint-disable-next-line no-console
  console.log("useAwaitablePOJOState", { awaitablePOJO, awaitablePOJOJSON });

  const maybeScrollableRef = useRef(null);
  const {
    isVerticallyScrollable,
    isHorizontallyScrollable,
  } = useDetectScrollable(maybeScrollableRef);
  const isVerticallyScrollable2 = useDetectVerticallyScrollable(
    maybeScrollableRef
  );
  const isHorizontallyScrollable2 = useDetectHorizontallyScrollable(
    maybeScrollableRef
  );

  // eslint-disable-next-line no-console
  console.log({
    maybeScrollableRef,
    isVerticallyScrollable,
    isHorizontallyScrollable,
    isVerticallyScrollable2,
    isHorizontallyScrollable2,
  });

  return (
    <div>
      <div className="section">
        <p>Counter: {count}</p>
        <button
          onClick={() => {
            setCount(count + 1);
          }}
        >
          Click to update the counter
        </button>
      </div>

      <div className="section">
        <button
          onClick={() => {
            setPOJOState(prevState => ({
              b: prevState.b * 2,
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

      <div className="section">
        <button onClick={forceUpdate}>Click to force update</button>
      </div>

      <div className="section">
        Factory value: {JSON.stringify(factoryValue)}
      </div>

      <div className="section">
        <button
          onClick={async () => {
            const awaitableCounter = await setAwaitableCounter(
              awaitableCounter => awaitableCounter + 1
            );
            // eslint-disable-next-line no-console
            console.log("await", { awaitableCounter });
          }}
        >
          Click to update awaitable counter
        </button>{" "}
        {`awaitableCounter = ${awaitableCounter}`}
      </div>

      <div className="section">
        <button
          onClick={async () => {
            const awaitablePOJO = await setAwaitablePOJO(awaitablePOJO => {
              const a = awaitablePOJO.a;
              const b = awaitablePOJO.b;
              const update = {
                a: a + 1,
              };
              if (a % 10 === 0) {
                update.b = b + 1;
              }

              // Bail out
              if (a >= 30) {
                return null;
                // return awaitablePOJO;
              }

              return update;
            });
            // eslint-disable-next-line no-console
            console.log("await", { awaitablePOJO });
          }}
        >
          Click to update awaitable POJO
        </button>{" "}
        {`awaitablePOJO.a = ${awaitablePOJO.a}, awaitablePOJO.b = ${awaitablePOJO.b}`}
      </div>

      <div className="section">
        <div ref={maybeScrollableRef} className="scrollable">
          <div className="line-of-scrollable">
            Text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
          <div className="line-of-scrollable">
            text text text text text text text text text text text text
          </div>
        </div>
      </div>
    </div>
  );
}
