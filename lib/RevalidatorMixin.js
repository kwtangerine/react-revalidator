'use strict';

var React = require('react');
var ObjectPath = require('object-path');
var Revalidator = require('revalidator');
var ClassNames = require('classnames');
var Result = require('lodash.result');
var IsObject = require('lodash.isobject');
var IsEmpty = require('lodash.isempty');
var Find = require('lodash.find');

function parseProperty(propertyValue) {
  var object = {
    isValid: false,
    isDirty: false,
    errors: []
  };
  var objectModel = ObjectPath(object);
  if (propertyValue.hasOwnProperty('properties')) {
    for (var property in propertyValue.properties) {
      if (propertyValue.properties.hasOwnProperty(property)) {
        objectModel.set(property, parseProperty(propertyValue.properties[property]));
      }
    }
  }
  if (propertyValue.type === 'array' && propertyValue.hasOwnProperty('items')) {
    var max = ObjectPath.get(propertyValue, 'maxItems', 100);
    for (var i = 0; i < max; i++) {
      objectModel.set(i, parseProperty(propertyValue.items));
    }
  }
  return object;
}

var RevalidatorMixin = {
  getInitialState: function getInitialState() {
    return {
      Revalidator: {
        isValid: false,
        isDirty: false,
        errors: []
      }
    };
  },
  resetValidation: function resetValidation() {
    var schema = Result(this, 'revalidatorSchema') || {};
    var revalidator = this.state.Revalidator;
    var revalidatorModel = ObjectPath(revalidator);
    revalidatorModel.set('isValid', false);
    revalidatorModel.set('isDirty', false);
    for (var property in schema) {
      if (schema.hasOwnProperty(property)) {
        revalidatorModel.set(property, parseProperty(schema[property]));
      }
    }
    this.setState({ Revalidator: revalidator });
  },
  componentWillMount: function componentWillMount() {
    if (!IsObject(this.revalidatorSchema)) {
      throw Error('invalid `revalidatorSchema` type');
    }
    this.resetValidation();
  },
  processDirty: function processDirty(property) {
    var revalidator = this.state.Revalidator;
    var revalidatorModel = ObjectPath(revalidator);
    revalidatorModel.set('isDirty', true);
    if (property) {
      revalidatorModel.set(property + '.isDirty', true);
      this.setState({ Revalidator: revalidator });

      var propertyArray = property.split('.');
      if (propertyArray.length > 1) {
        propertyArray.splice(-1, 1);
        this.processDirty(propertyArray.join('.'));
      }
    }
  },
  validateNested: function validateNested(object, schema, path) {
    path = path || '';
    var revalidator = this.state.Revalidator;
    var revalidatorModel = ObjectPath(revalidator);
    var objectModel = ObjectPath(object);
    var subObject;
    var subSchema;
    var subPath;
    var result;

    if (schema.hasOwnProperty('properties')) {
      result = Revalidator.validate(object, schema);
      if (IsEmpty(path)) {
        revalidatorModel.set('isValid', result.valid);
        revalidatorModel.set('errors', result.errors);
      } else {
        revalidatorModel.set(path + '.isValid', result.valid);
        revalidatorModel.set(path + '.errors', result.errors);
      }
      for (var schemaProperty in schema.properties) {
        if (schema.properties.hasOwnProperty(schemaProperty)) {
          var p1 = IsEmpty(path) ? schemaProperty : path + '.' + schemaProperty;
          revalidatorModel.set(p1 + '.isValid', true);
          revalidatorModel.set(p1 + '.errors', []);
        }
      }
      result.errors.forEach(function (error) {
        var errorPropertyArray = error.property.split('.');
        if (errorPropertyArray.length === 1) {
          var p2 = IsEmpty(path) ? error.property : path + '.' + error.property;
          var isDirty = revalidatorModel.get(p2 + '.isDirty', false);
          if (isDirty) {
            revalidatorModel.set(p2 + '.isValid', false);
            var errors = revalidatorModel.get(p2 + '.errors', []);
            var r = Find(errors, function (er) {
              return er.property === error.property;
            });
            if (r === undefined) {
              revalidatorModel.push(p2 + '.errors', error);
            }
          }
        }
      });
      this.setState({ Revalidator: revalidator });
      for (var property in schema.properties) {
        if (schema.properties.hasOwnProperty(property)) {
          subObject = objectModel.get(property, {});
          subSchema = schema.properties[property];
          subPath = IsEmpty(path) ? property : path + '.' + property;
          this.validateNested(subObject, subSchema, subPath);
        }
      }
    }

    if (schema.hasOwnProperty('items')) {
      result = Revalidator.validate(object, schema);
      if (schema.hasOwnProperty('items')) {
        result.errors.forEach(function (error) {
          if (error.property.length !== 0) {
            error.message = 'Item ' + error.property + ' ' + error.message;
          }
        });
      }
      if (IsEmpty(path)) {
        revalidatorModel.set('isValid', result.valid);
        revalidatorModel.set('errors', result.errors);
      } else {
        revalidatorModel.set(path + '.isValid', result.valid);
        revalidatorModel.set(path + '.errors', result.errors);
      }
      var max = ObjectPath.get(schema, 'maxItems', 100);
      for (var i = 0; i < max; i++) {
        subObject = objectModel.get(i, {});
        subSchema = schema.items;
        subPath = IsEmpty(path) ? i : path + '.' + i;
        this.validateNested(subObject, subSchema, subPath);
      }
    }
  },
  validate: function validate(property) {
    this.processDirty(property);
    var schema = Result(this, 'revalidatorSchema') || {};
    this.validateNested(this.state, { properties: schema });
  },
  handleValidation: function handleValidation(property) {
    return (function (event) {
      event.preventDefault();
      this.validate(property);
    }).bind(this);
  },
  getErrors: function getErrors(property) {
    var revalidator = this.state.Revalidator;
    var revalidatorModel = ObjectPath(revalidator);
    if (property) {
      return revalidatorModel.get(property + '.errors', []);
    }
    return revalidator.errors;
  },
  isValid: function isValid(property) {
    var revalidator = this.state.Revalidator;
    var revalidatorModel = ObjectPath(revalidator);
    if (property) {
      return revalidatorModel.get(property + '.isValid', false);
    }
    return revalidator.isValid;
  },
  isDirty: function isDirty(property) {
    var revalidator = this.state.Revalidator;
    var revalidatorModel = ObjectPath(revalidator);
    if (property) {
      return revalidatorModel.get(property + '.isDirty', false);
    }
    return revalidator.isDirty;
  },
  getFieldClass: function getFieldClass(property, successClass, errorClass, defaultClass) {
    successClass = successClass || 'has-success';
    errorClass = errorClass || 'has-error';
    defaultClass = defaultClass || 'form-group';
    var classNames = {};
    classNames[defaultClass] = true;
    classNames[successClass] = this.isValid(property) && this.isDirty(property);
    classNames[errorClass] = !this.isValid(property) && this.isDirty(property);
    return ClassNames(classNames);
  },
  renderFieldMessages: function renderFieldMessages(property, className) {
    className = className || 'help-block';
    var errors = this.getErrors(property);
    if (errors.length !== 0) {
      var html = errors.map(function (error) {
        return React.createElement(
          'div',
          { key: error.property },
          error.message
        );
      });
      return React.createElement(
        'div',
        { className: className },
        html
      );
    }
    return null;
  }
};

module.exports = RevalidatorMixin;