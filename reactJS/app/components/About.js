import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// import {  } from './../actions/registerActions';

let styles = {
  icon2: {
    marginRight: 10,
    marginTop: 14
  }
}

class About extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    let currentURL = window.location.href;
    return (
      <div>
        <div className='row'>
          <div className='col-md-3'>
            <p className='sideHeading'> About </p>
          </div>
          <div className='col-md-9'>
            <p className='contents'> Engineer </p>
          </div>
        </div>
      </div>
    );
  }
}

About.propTypes = {
};

export default connect(state =>({
}))(About);
