/*
 * Copyright (c) 2020 Anton Bagdatyev (Tonix)
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

import { trim, isArray, isUndefined, isEmpty } from "js-utl";

/**
 * React JS utility functions.
 */

/**
 * Returns a class name string.
 *
 * @param {*} componentClassName Default class name of a component (a string) or a falsy value which evaluates to an empty string.
 * @param {...*} classNames Additional, optional list of strings of class names or falsy values to ignore.
 * @return {string} The class name string.
 */
export function classNames(componentClassName, ...classNames) {
  return classNames.reduce(
    (componentClassName, className) =>
      trim(`${componentClassName || ""} ${className || ""}`),
    componentClassName
  );
}

/**
 * Merges a component's class name.
 *
 * @deprecated since version 1.17.0 (will be removed in a next major version, use "classNames()" instead)
 *
 * @param {string} componentClassName Component's class name.
 * @param {Object} props Properties.
 * @return {Object} The merged properties.
 */
export function mergeClassNameProp(componentClassName, props) {
  const { className, ...remaining } = props;
  return {
    className: classNames(componentClassName, className),
    ...remaining
  };
}

/**
 * Returns the name of a React component.
 *
 * @param {Object} reactComponentInstance An instance of a React component.
 * @return {string|undefined} The React component's name, or "undefined" if the name is unknown.
 */
export function reactComponentName(reactComponentInstance) {
  return (
    reactComponentInstance.constructor.displayName ||
    reactComponentInstance.constructor.name ||
    void 0
  );
}

/**
 * Gets a React component's display name.
 *
 * @param {Function} Component A component.
 * @return {string} Its name or "Component" if unknown.
 */
export function getDisplayName(Component) {
  return (
    Component.displayName ||
    Component.name ||
    (typeof Component === "object" && getDisplayName(Component.type)) ||
    "Component"
  );
}

/**
 * Returns an array of mappable children if the given children
 * parameter is not falsy.
 *
 * @private
 *
 * @param {*} children The given children.
 * @param {(children: Array) => Array} fn A callback to map children returning the mapped children
 *                                        if the given "children" is not falsy.
 */
const childrenMap = (children, fn) => {
  if (!isArray(children)) {
    if (!children) {
      return children;
    }
    children = [children];
  }
  return fn(children);
};

/**
 * Map React children like "React.Children.map()", but without changing children keys.
 *
 * @param {*} children React children (usually the value of "props.children").
 * @param {Function} fn Function to call which will receive each child and its corresponding index as argument.
 * @return {Array} An array of mapped children.
 */
export const reactChildrenMap = (children, fn) =>
  childrenMap(children, children => children.map(fn));

/**
 * Map React children like "reactChildrenMap", but flattening the given children before mapping.
 *
 * @param {*} children React children (usually the value of "props.children").
 * @param {Function} fn Function to call which will receive each child and its corresponding index as argument.
 * @param {number} [depth] The depth of the flattening. Defaults to 1.
 * @return {Array} An array of mapped children.
 */
export const reactChildrenFlatMap = (children, fn, depth = 1) =>
  childrenMap(children, children => children.flat(depth).map(fn));

/**
 * Returns a key/child tuple function.
 *
 * @private
 *
 * @param {Function} fn Function to call which will receive two parameters:
 *
 *                          - key: The current key;
 *                          - child: The current child;
 *
 * @return {(current: *) => *} A function returning the mapped child.
 */
const childrenKeyChildTupleFn = fn => current => {
  let key, child;
  if (isArray(current)) {
    [key, child] = current;
  } else {
    child = current;
    key = child.key;
  }
  return fn(key, child);
};

/**
 * Map React children like "React.Children.map()", but without changing children keys
 * as well as accepting a "[key, child]" tuple as a child and passing the current key and child
 * parameter to the provided callback function.
 *
 * @param {*} children React children (usually the value of "props.children").
 * @param {Function} fn Function to call which will receive two parameters:
 *
 *                          - key: The current key;
 *                          - child: The current child;
 *
 * @return {Array} An array of mapped children.
 */
export const reactChildrenKeyChildTupleMap = (children, fn) => {
  return reactChildrenMap(children, childrenKeyChildTupleFn(fn));
};

/**
 * Map React children like "reactChildrenKeyChildTupleMap", but flattening the given children before mapping.
 *
 * @param {*} children React children (usually the value of "props.children").
 * @param {Function} fn Function to call which will receive two parameters:
 *
 *                          - key: The current key;
 *                          - child: The current child;
 *
 * @return {Array} An array of mapped children.
 */
export const reactChildrenKeyChildTupleFlatMap = (children, fn) => {
  return reactChildrenFlatMap(children, childrenKeyChildTupleFn(fn));
};

/**
 * Generates a new ref callback.
 *
 * @param {Object} ref A ref object.
 * @param {*} ref.current The mutable value of the ref.
 * @param {string} prop A property to pick from the value passed to the ref callback.
 * @return {Function} The new ref callback.
 */
export const refCallback = (ref, prop = void 0) => value =>
  (ref.current = prop ? (value ? value[prop] : null) : value);

/**
 * Tests if the given value has a React component name property
 * (either a "name" or a "displayName" string property with the first character
 * being a capital letter).
 *
 * @param {*} fn A value.
 * @return {boolean} True if the given value has a valid React component name,
 *                   false otherwise.
 */
export const isWithReactComponentName = fn =>
  fn &&
  ((!isEmpty(fn.name) && fn.name[0] === fn.name[0].toUpperCase()) ||
    (!isEmpty(fn.displayName) &&
      fn.displayName[0] === fn.displayName[0].toUpperCase()));

/**
 * Tests if the given value is a function with a valid React component name.
 *
 * @param {*} fn A value.
 * @return {boolean} True if the given value is a function with a valid React component name,
 *                   false otherwise.
 */
export const isFnWithComponentName = fn =>
  typeof fn === "function" && isWithReactComponentName(fn);

/**
 * Tests if a value is a React builtin HOC (e.g. a component returned by "React.memo()").
 *
 * @param {*} Component The value.
 * @return {boolean} True if the given value is a React HOC.
 */
export const isReactHOC = Component =>
  typeof Component === "object" && isReactComponent(Component.type);

/**
 * Private helper for composing behaviour.
 *
 * @private
 */
function withAncestorHasComponentName(fn) {
  let ancestorHasComponentName = false;
  return (Component, Parent = void 0) => {
    ancestorHasComponentName =
      ancestorHasComponentName || isWithReactComponentName(Parent);
    return fn(Component, ancestorHasComponentName);
  };
}

/**
 * Tests if the given value is a valid React functional component.
 *
 * @param {*} Component The value.
 * @return {boolean} True if the value is a React functional component, false otherwise.
 */
export function isFunctionalComponent(Component) {
  const testComponent = withAncestorHasComponentName(
    (Component, ancestorHasComponentName) =>
      // prettier-ignore
      (
        !(Component.prototype && Component.prototype.isReactComponent) &&
        (
          isFnWithComponentName(Component) ||
          (ancestorHasComponentName && typeof Component === "function"))
      ) ||
      (isReactHOC(Component) && testComponent(Component.type, Component))
  );
  return testComponent(Component);
}

/**
 * Tests if the given value is a valid React class component.
 *
 * @param {*} Component The value.
 * @return {boolean} True if the value is a React class component, false otherwise.
 */
export function isClassComponent(Component) {
  const testComponent = withAncestorHasComponentName(
    (Component, ancestorHasComponentName) =>
      !!(
        Component.prototype &&
        Component.prototype.isReactComponent &&
        (ancestorHasComponentName || isFnWithComponentName(Component))
      ) ||
      (isReactHOC(Component) && isClassComponent(Component.type))
  );
  return testComponent(Component);
}

/**
 * Tests if the given value is a valid React component.
 *
 * @param {*} value A value.
 * @return {boolean} True if the given value is a valid React component, false otherwise.
 */
export function isReactComponent(Component) {
  return (
    isFunctionalComponent(Component) ||
    isClassComponent(Component) ||
    isReactHOC(Component)
  );
}

/**
 * Returns a default value.
 *
 * @param {*} [defaultValue] A default value.
 * @param {*} [valueIfDefaultValueIsUndefined] A value to return if the given default value is "undefined".
 * @return {*} A default value.
 */
export function defaultVal(
  defaultValue = void 0,
  valueIfDefaultValueIsUndefined = void 0
) {
  if (defaultValue) {
    return defaultValue;
  }
  if (isUndefined(defaultValue)) {
    return valueIfDefaultValueIsUndefined;
  } else {
    return !defaultValue ? void 0 : defaultValue;
  }
}
