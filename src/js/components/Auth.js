"use strict";

import React from "react/addons";
import DocBrown from "docbrown";

import { AuthActions, stores } from "../flux";

import Panel from "./Panel";
import Button from "./Button";

export var SignIn = React.createClass({
  handleSigninClick: function() {
    AuthActions.signin();
  },

  render: function() {
    return (
      <div>
        <Button type="info" label="Sign in your Firefox Account" onClick={this.handleSigninClick} />
        {` or `}
        <a href="https://accounts.firefox.com/signup" target="_blank">
          Sign up for one
        </a>.
      </div>
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
        <Button type="danger" label="Sign out"
                onClick={this.handleSignoutClick} />
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
