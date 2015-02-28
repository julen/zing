/*
 * Copyright (C) Pootle contributors.
 *
 * This file is a part of the Pootle project. It is distributed under the GPL2
 * license. See the LICENSE file for a copy of the license and the AUTHORS file
 * for copyright and authorship information.
 */

'use strict';

var Backbone = require('backbone');
var React = require('react');
var _ = require('underscore');

var Dialog = require('components/lightbox').Dialog;
var Modal = require('components/lightbox').Modal;
var ModalContainer = require('components/lightbox').ModalContainer;
var UserProfileForm = require('../forms').UserProfileForm;


var UserProfileEdit = React.createClass({

  /* Lifecycle */

  getInitialState: function () {
    return {
      editing: false,
      confirmClose: false,
      isDirty: false
    };
  },

  setupRoutes: function (router) {
    router.on('route:main', function (qs) {
      this.setState({editing: false});
    }.bind(this));

    router.on('route:edit', function (id, qs) {
      this.setState({editing: true});
    }.bind(this));
  },

  componentWillMount: function () {
    this.setupRoutes(this.props.router);
    Backbone.history.start({pushState: true, root: this.props.appRoot});
  },

  componentWillUpdate: function (nextProps, nextState) {
    this.handleURL(nextState);
  },


  /* State-changing handlers */

  handleEdit: function () {
    this.setState({editing: true});
  },

  handleClose: function (opts) {
    opts = opts || {};
    var forceClose = opts.forceClose || false;

    if (this.state.isDirty && !forceClose) {
      this.setState({confirmClose: true});
    } else {
      this.setState({
        editing: false,
        confirmClose: false,
        isDirty: false
      });
    }
  },

  handleSave: function (item) {
    this.handleClose();
    window.location.reload();
  },

  handleDlgOk: function () {
    this.handleClose({forceClose: true});
  },

  handleDlgCancel: function () {
    this.setState({confirmClose: false});
  },

  handleDirtyFlag: function (isDirty) {
    this.setState({isDirty: isDirty});
  },


  /* Handlers */

  handleURL: function (newState) {
    var newURL = newState.editing ? '/edit/' : '/';
    this.props.router.navigate(newURL);
  },


  /* Layout */

  render: function () {
    return (
      <div>
        <div className="edit-profile-btn">
          <button className="btn btn-primary"
                  onClick={this.handleEdit}>
            {gettext('Edit My Public Profile')}
          </button>
        </div>
      {this.state.editing &&
        <Modal
          className="user-edit"
          onClose={this.handleClose}
          title={gettext('My Public Profile')}>
          <div id="user-edit">
            <UserProfileForm model={this.props.user}
                             handleDirtyFlag={this.handleDirtyFlag}
                             handleSuccess={this.handleSave} />
          </div>
        </Modal>}
      {this.state.confirmClose &&
        <Dialog
          handleOk={this.handleDlgOk}
          handleCancel={this.handleDlgCancel}
          onClose={this.handleDlgCancel}
          title={gettext('Discard changes.')}
          okLabel={gettext('Yes')}
          cancelLabel={gettext('No')}>
          {gettext('There are unsaved changes. Do you want to discard them?')}
        </Dialog>}
      </div>
    );
  }
});


module.exports = UserProfileEdit;
