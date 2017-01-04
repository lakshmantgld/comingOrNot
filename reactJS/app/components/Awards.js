import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// import {  } from './../actions/registerActions';

let styles = {
  icon2: {
    marginRight: 10,
    marginTop: 14
  }
}

class Awards extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    let currentURL = window.location.href;
    return (
      <div>
      <h1> Awards </h1>
      </div>
    );
  }
}

Awards.propTypes = {
};

export default connect(state =>({
}))(Awards);
