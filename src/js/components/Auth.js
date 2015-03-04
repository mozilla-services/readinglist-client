"use strict";

import React from "react/addons";
import DocBrown from "docbrown";

import { AuthActions, stores } from "../flux";

import Panel from "./Panel";
import Button from "./Button";

export var SignIn = React.createClass({
  handleSubmit: function(event) {
    event.preventDefault();

    AuthActions.signin({persistent: this.refs.remember.getDOMNode().checked});
  },

  render: function() {
    return (
      <form className="form-inline" onSubmit={this.handleSubmit}>
        <p>
          <Button kind="info" type="submit" label="Sign in your Firefox Account" />
          {" or "}
          <a href="https://accounts.firefox.com/signup" target="_blank">
            Sign up for one
          </a>.
        </p>
        <div className="checkbox">
          <label><input ref="remember" type="checkbox" />{" "}Remember me</label>
        </div>
      </form>
    );
  }
});

export var UserInfo = React.createClass({
  handleSignoutClick: function() {
    AuthActions.signout();
  },

  render: function() {
    return (
      <div>
        <p>You're signed in.</p>
        <Button kind="danger" label="Sign out" onClick={this.handleSignoutClick} />
      </div>
    );
  }
});

export default React.createClass({
  mixins: [DocBrown.storeMixin(stores.getter("authStore"))],

  componentDidMount: function() {
    AuthActions.checkAuth();
  },

  render: function() {
    return (
      <Panel title="Authentication">
        {this.state.authToken ? <UserInfo {...this.state} /> : <SignIn />}
      </Panel>
    );
  }
});
