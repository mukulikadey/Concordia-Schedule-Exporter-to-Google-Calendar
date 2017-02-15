"use strict";

var SomeComponent = React.createClass({
  displayName: "SomeComponent",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "span",
        { className: "child1" },
        "Hello World"
      ),
      React.createElement("span", { className: "child2" })
    );
  }
});
