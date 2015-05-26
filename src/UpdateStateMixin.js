'use strict';

var ObjectPath = require('object-path');

var UpdateStateMixin = {
  updateState: function (newState, callback) {
    var state = this.state;
    callback = callback || function () {};
    var stateModel = ObjectPath(state);
    for (var property in newState) {
      stateModel.set(property, newState[property]);
    }
    this.setState(state, callback);
  }
};

module.exports = UpdateStateMixin;
