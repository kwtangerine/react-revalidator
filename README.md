# React Revalidator

React mixin for form validation base on [revalidator](https://github.com/flatiron/revalidator).

## Installation

```bash
npm install --save react-revalidator
```

## Usage

```js
var RevalidatorMixin = require('react-revalidator');
var UpdateStateMixin = require('react-revalidator/lib/UpdateStateMixin');

var Component = React.createClass({
  mixins: [RevalidatorMixin, UpdateStateMixin],
  revalidatorSchema: {
    example: {
      type: 'object',
      required: true,
      properties: {
        name: {
          type: 'string',
          required: true,
          allowEmpty: false,
          minLength: 6
        },
        email: {
          type: 'string',
          required: true,
          format: 'email'
        }
      }
    }
  },
  getInitialState: function () {
    return {
      example: {}
    };
  },
  handleNameChange: function (e) {
    this.updateState({
      'example.name': e.target.value
    }, function () {
      this.validate('example.name');
    });
  },
  handleEmailChange: function (e) {
    this.updateState({
      'example.email': e.target.value
    }, function () {
      this.validate('example.email');
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    console.log('example: ', this.state.example);
  },
  handleReset: function (e) {
    e.preventDefault();
    this.setState({
      example: {}
    });
    this.resetValidation();
  },
  render: function () {
    return (
      <form>
        <div className={this.getFieldClass('example.name')}>
          <label className='control-label'>Name</label>
          <input type='text' className='form-control'
            value={this.state.example.name}
            onChange={this.handleNameChange}/>
          {this.renderFieldMessages('example.name')}
        </div>
        <div className={this.getFieldClass('example.email')}>
          <label className='control-label'>Email</label>
          <input type='text' className='form-control'
            value={this.state.example.email}
            onChange={this.handleEmailChange}/>
          {this.renderFieldMessages('example.email')}
        </div>
        <button className='btn btn-primary' onClick={this.handleSubmit}
          disabled={!this.isDirty('example') || !this.isValid('example')}>
          Save
        </button>
        <button className='btn btn-default' onClick={this.handleReset}>
          Reset
        </button>
      </form>
    );
  }
});
```

See more `revalidatorSchema` infomation [here](https://github.com/flatiron/revalidator#schema).

## Methods

- resetValidation()
- validate(property)
- handleValidation(property)
- getErrors([property])
- isValid([property])
- isDirty([property])
- getFieldClass(property, [successClass, errorClass, defaultClass])
- renderFieldMessages(property, [className])

`property` use [object-path](https://github.com/mariocasciaro/object-path) format.

`successClass` default value is `has-success`.

`errorClass` default value is `has-error`.

`defaultClass` default value is `form-group`.

`className` default value is `help-block`.

## Example

See example folder or [demo](http://vn38minhtran.github.io/react-revalidator).