import React, { Component } from "react";

import { getDisplayName } from "react-js-utl/utils";

export default class App extends Component {
  render() {
    return <div>{getDisplayName(App)}</div>;
  }
}
