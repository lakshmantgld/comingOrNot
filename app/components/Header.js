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
          style={{backgroundColor: 'black'}}
          title={<a href='/'>
                  <center> Lets Meet Up!! </center>
                </a>}
          showMenuIconButton={false}
        />
      </header>

    );
  }
}

Header.propTypes = {
};

export default connect(state =>({
}))(Header);
