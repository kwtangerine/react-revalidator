var React = require('react');

require('./bower_components/bootstrap-customize/css/bootstrap.css');
require('./assets/styles/app.scss');

var Header = require('./components/Header');
var Footer = require('./components/Footer');

var RevalidatorMixin = require('../src/RevalidatorMixin');
var UpdateStateMixin = require('../src/UpdateStateMixin');

var App = React.createClass({
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
        },
        height: {
          type: 'number',
          required: true,
          minimum: 80,
          maximum: 210
        },
        arraySample: {
          type: 'array',
          required: true,
          minItems: 2,
          maxItems: 4,
          items: {
            type: 'string',
            require: true,
            allowEmpty: false
          }
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
  handleHeightChange: function (e) {
    var height = Number(e.target.value);
    this.updateState({
      'example.height': !isNaN(height) ? height : e.target.value
    }, function () {
      this.validate('example.height');
    });
  },
  handleArraySampleChange: function (e) {
    var value = e.target.value;
    this.updateState({
      'example.arraySample': value.length === 0 ? [] : value.split(',')
    }, function () {
      this.validate('example.arraySample');
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
      <div className={"layout-page"}>
        <Header/>
        <main className={"layout-main"}>
          <div className={"container"}>
            <div className='page-header'>
              <h1>Example form</h1>
            </div>
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
              <div className={this.getFieldClass('example.height')}>
                <label className='control-label'>Height</label>
                <input type='text' className='form-control'
                  value={this.state.example.height}
                  onChange={this.handleHeightChange}/>
                {this.renderFieldMessages('example.height')}
              </div>
              <div className={this.getFieldClass('example.arraySample')}>
                <label className='control-label'>Array sample</label>
                <input type='text' className='form-control'
                  value={this.state.example.arraySample}
                  placeholder='a, b, c, d'
                  onChange={this.handleArraySampleChange}/>
                {this.renderFieldMessages('example.arraySample')}
              </div>
              <button className='btn btn-primary' onClick={this.handleSubmit}
                disabled={!this.isDirty('example') || !this.isValid('example')}>
                Save
              </button>
              <button className='btn btn-default' onClick={this.handleReset}>
                Reset
              </button>
            </form>
          </div>
        </main>
        <Footer/>
      </div>
    );
  }
});

React.render(<App />, document.body);
