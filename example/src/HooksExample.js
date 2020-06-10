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
  console.log(dep);
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

      <div>
        <button onClick={forceUpdate}>Click to force update</button>
      </div>

      <div>Factory value: {JSON.stringify(factoryValue)}</div>
    </div>
  );
}
