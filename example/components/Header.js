var React = require('react');
var logoImg = require('../assets/images/logo.svg');

require('../assets/styles/header.scss');

var Header = React.createClass({
  render: function () {
    return (
      <header className='layout-header'>
        <nav className='navbar navbar-inverse'>
          <div className='container'>
            <div className='navbar-header'>
              <button type='button' className='navbar-toggle collapsed'>
                <span className='sr-only'>Toggle navigation</span>
                <span className='icon-bar'></span>
                <span className='icon-bar'></span>
                <span className='icon-bar'></span>
              </button>
              <a className='navbar-brand' href='#'>
                <img width='20' src={logoImg}></img>
              </a>
            </div>
            <div className='collapse navbar-collapse'>
              <ul className='nav navbar-nav navbar-right'></ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
});

module.exports = Header;
