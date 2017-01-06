import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// import {  } from './../actions/registerActions';

let styles = {
  icon2: {
    marginRight: 10,
    marginTop: 14
  }
}

class Contact extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  getImageURL(contactType) {
    return "/images/" + contactType + ".png";
  }

  renderContact(contact) {
    let renderedcontact = [];
      // for looping contact
      for (let contactType in contact) {
          if (contact.hasOwnProperty(contactType)) {
              renderedcontact.push(<a className="imgSpace" href={contact[contactType]}><img src={this.getImageURL(contactType)}></img></a>);
            }
      }
      return renderedcontact;
  }

  render() {
      let currentURL = window.location.href;
      return (
          <div>
              <div className='row'>
                  <div className='col-xs-12 col-md-2'>
                      <p className='sideHeading'>
                          Contact
                      </p>
                  </div>
                  <div className='col-xs-12 col-md-10 imagesDiv'>
                      {this.renderContact(this.props.contact)}
                  </div>
              </div>
          </div>
      );
  }
  }


export default Contact;
