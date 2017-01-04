import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// import {  } from './../actions/registerActions';

let styles = {
  icon2: {
    marginRight: 10,
    marginTop: 14
  }
}

class Experience extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    let currentURL = window.location.href;
    return (
      <div>
      <h1> Experience </h1>
      </div>
    );
  }
}

Experience.propTypes = {
};

export default connect(state =>({
}))(Experience);
