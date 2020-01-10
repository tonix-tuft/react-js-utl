/*
 * Copyright (c) 2020 Anton Bagdatyev (Tonix-Tuft)
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
