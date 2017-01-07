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

  renderAwards(awards) {
    let renderedAwards = [];
    for (let i = 0; i < awards.length; i++){
      let awardsSet = [];
      awardsSet.push(<p className='awardName'>{awards[i]["name"]}</p>);
      awardsSet.push(<p className='awardOrganiser'>{awards[i]["organiser"]}</p>);
      awardsSet.push(<p className='awardYear'>{awards[i]["date"]}</p>);
      if (awards[i]["description"] !== "") {
        awardsSet.push(<p className='awardDescription'>{awards[i]["description"]}</p>);
      }
      renderedAwards.push(awardsSet);
      renderedAwards.push(<br />);
    }
    return renderedAwards;
  }

  render() {
    let currentURL = window.location.href;
    return (
      <div>
          <div className='row'>
              <div className='col-xs-12 col-md-2'>
                  <p className='sideHeading'>
                     Awards
                  </p>
              </div>
              <div className='col-xs-12 col-md-10 sideContent'>
                  {this.renderAwards(this.props.awards)}
              </div>
          </div>
      </div>
    );
  }
}

export default Awards;
