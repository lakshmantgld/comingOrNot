import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <header>
        <AppBar
          className='headerBar'
          title={<a href='/'>
                  <center> {this.props.languageJson.header} </center>
                </a>}
          showMenuIconButton={false}
        />
      </header>
    );
  }
}

Header.propTypes = {
  languageJson: PropTypes.object.isRequired
};

export default connect(state =>({
  languageJson: state.languageJson
}))(Header);
