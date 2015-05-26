'use strict';

var ObjectPath = require('object-path');

var UpdateStateMixin = {
  updateState: function updateState(newState, callback) {
    var state = this.state;
    callback = callback || function () {};
    var stateModel = ObjectPath(state);
    for (var property in newState) {
      if (newState.hasOwnProperty(property)) {
        stateModel.set(property, newState[property]);
      }
    }
    this.setState(state, callback);
  }
};

module.exports = UpdateStateMixin;