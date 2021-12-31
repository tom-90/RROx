import * as React from "react";
import { hot } from "react-hot-loader";

import "./../assets/scss/App.scss";

class App extends React.Component<Record<string, unknown>, undefined> {
  public render() {
    return (
      <div className="app">
        <h1>Hello World!</h1>
      </div>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
