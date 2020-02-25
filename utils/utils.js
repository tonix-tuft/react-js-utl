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

import { trim, isArray } from "js-utl";

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
 * @deprecated since version 1.17.0 (will be removed in version 2.0.0, use "classNames()" instead)
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
    (Component.type && Component.type.name) ||
    "Component"
  );
}

/**
 * Map react children like "React.Children.map()", but without changing children keys.
 *
 * @param {*} children React children (usually the value of "props.children").
 * @param {Function} fn Function to call which will receive each children and its corresponding index as argument.
 * @return {Array} An array of mapped children.
 */
export const reactChildrenMap = (children, fn) => {
  if (!isArray(children)) {
    if (!children) {
      return children;
    }
    children = [children];
  }
  return children.map(fn);
};

/**
 * Map react children like "React.Children.map()", but without changing children keys
 * as well as accepting "[key child]" tuple as a child and passing the current key and child
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
  return reactChildrenMap(children, current => {
    let key, child;
    if (isArray(current)) {
      [key, child] = current;
    } else {
      child = current;
      key = child.key;
    }
    return fn(key, child);
  });
};

/**
 * Generates a new ref callback.
 *
 * @param {Object} ref A ref object.
 * @param {*} ref.current The mutable value of the ref.
 * @param {string} prop A property to pick from the value passed to the ref callback.
 * @return {Function} The new ref callback.
 */
export const refCallback = (ref, prop = void 0) => {
  return value => (ref.current = prop ? (value ? value[prop] : null) : value);
};

/**
 * Tests if the given value is a function with a valid React component name.
 *
 * @param {*} fn A value.
 * @return {boolean} True if the given value is a function with a valid React component name,
 *                   false otherwise.
 */
export const isFnWithComponentName = fn =>
  typeof fn === "function" && fn.name[0] === fn.name[0].toUpperCase();

/**
 * Tests if the given value is a valid React functional component.
 *
 * @param {*} Component The value.
 * @return {boolean} True if the value is a React functional component, false otherwise.
 */
export function isFunctionalComponent(Component) {
  return (
    isFnWithComponentName(Component) &&
    !(Component.prototype && Component.prototype.isReactComponent)
  );
}

/**
 * Tests if the given value is a valid React class component.
 *
 * @param {*} Component The value.
 * @return {boolean} True if the value is a React class component, false otherwise.
 */
export function isClassComponent(Component) {
  return !!(
    isFnWithComponentName(Component) &&
    Component.prototype &&
    Component.prototype.isReactComponent
  );
}

/**
 * Tests if the given value is a valid React component.
 *
 * @param {*} value A value.
 * @return {boolean} True if the given value is a valid React component, false otherwise.
 */
export function isReactComponent(Component) {
  return isFunctionalComponent(Component) || isClassComponent(Component);
}
