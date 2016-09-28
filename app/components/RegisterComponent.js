import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

// The below code is for extracting the location of browser. not working in localhost.
//import geolocator from 'geolocator';

import { grey600, red500, grey900, grey50 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import Chip from 'material-ui/Chip';


import InfiniteCalendar from 'react-infinite-calendar';
import Geosuggest from 'react-geosuggest';

import { storeName, storePurpose, registerEvent, storeDateArray, storeDateArrayErrorLabel, popDateArray,
         storeNameErrorLabel, storePurposeErrorLabel, storeLocation } from './../actions/registerActions';

let styles = {
  formLabel: {
    text: 'bold',
    fontSize: '25px',
    color: grey600
  },
  errorLabel: {
    text: 'bold',
    fontSize: '22px',
    color: red500
  },
  chip: {
    margin: 4,
  },
  underlineStyle: {
    borderColor: grey900,
  },
  dateSelectLabel:{
    fontSize: '19px'
  },
  datePush:{
    marginTop: '20px'
  }
};

let buttonStyle = {
  margin : 12,
  color : 'rgb(255, 255, 255)'
};

let mymap;

class RegisterComponent extends Component {
  constructor(props) {
    super(props);
    this.storeName = this.storeName.bind(this);
    this.storePurpose = this.storePurpose.bind(this);
    this.registerEvent = this.registerEvent.bind(this);
    this.storeDate = this.storeDate.bind(this);
    this.renderChip = this.renderChip.bind(this);
    this.storeLocation = this.storeLocation.bind(this);
    this.suggestLocation = this.suggestLocation.bind(this);
  }

  componentDidMount() {
  }

// method is invoked when you delete a selected date, it in turn deletes from the state object.
  handleRequestDelete(label) {
    this.props.dispatch(popDateArray(label))
    if (this.props.dateArray.length <= 5) {
      this.props.dispatch(storeDateArrayErrorLabel(''));
    }
  }

// stores the name of the event creator.
  storeName(e) {
    if (e.target.value.length >= '40') {
      this.props.dispatch(storeNameErrorLabel('Only 40 characters permitted!!!'))
    } else {
      this.props.dispatch(storeNameErrorLabel(''))
      this.props.dispatch(storeName(e.target.value));
    }
  }

// stores the purpose of the event and throws an error in case of any edge cases failed.
  storePurpose(e) {
    if (e.target.value.length >= '100') {
      this.props.dispatch(storePurposeErrorLabel('Only 100 characters permitted!!!'))
    } else {
      this.props.dispatch(storePurposeErrorLabel(''))
      this.props.dispatch(storePurpose(e.target.value));
    }
  }

// Stores the selected date in the state object.
  storeDate(date) {
    if (this.props.dateArray.length <= 5) {
      (this.props.dateArray.indexOf(date.format('ddd, MMM Do YYYY'))==-1)?
       this.props.dispatch(storeDateArray(date.format('ddd, MMM Do YYYY')))
       :console.log("Duplicate date");
    } else {
      this.props.dispatch(storeDateArrayErrorLabel('Only 6 dates permitted'));
    }
  }

  storeLocation(location) {
    this.props.dispatch(storeLocation(location));
  }

  suggestLocation(location) {
    this.props.dispatch(storeLocation(location.label));
  }

  registerEvent(e) {
    if (this.props.name.length === 0) {
      this.props.dispatch(storeNameErrorLabel('Name field is required!!'));
    } else if (this.props.purpose.length === 0) {
      this.props.dispatch(storePurposeErrorLabel('Purpose field is required!!'));
    } else {
      this.props.dispatch(registerEvent(this.props.name, this.props.purpose, this.props.dateArray, this.props.location));
    }
  }

  renderChip(data) {
    return (

        <div className='col-xs-6' >
          <Chip
            key={data}
            onRequestDelete={() => this.handleRequestDelete(data)}
            style={styles.chip}>
            {data}
          </Chip>
        </div>


    );
  }

  render() {

    // The below code is for extracting the location of browser. not working in localhost.
    // geolocator.config({
    //     language: "en",
    //     google: {
    //         version: "3",
    //         key: "AIzaSyD1RMZkEvaBljDPOiLj0tdu0rwWPQlwFlA"
    //     }
    // });
    //
    // var options = {
    //     enableHighAccuracy: true,
    //     timeout: 6000,
    //     maximumAge: 0,
    //     desiredAccuracy: 30,
    //     fallbackToIP: true, // fallback to IP if Geolocation fails or rejected
    //     addressLookup: true,
    //     timezone: true,
    //     map: "map-canvas"
    // };
    // geolocator.locate(options, function (err, location) {
    //     if (err) return console.log(err);
    //     console.log("prining location of browser");
    //     console.log(location);
    // });

    let today = new Date(); // Get today's date to give minimum limit to the calendar
    let dateArray = this.props.dateArray.map(this.renderChip, this);

    let fixtures = [
      {label: 'mantra, Yokohama, Kanagawa Prefecture, Japan', location: {lat: 35.44371, lng: 139.63803}},
      {label: 'Khazana, Yokohama, Kanagawa Prefecture, Japan', location: {lat: 35.4568977, lng: 139.6311364}},
      {label: 'Garlic Jo\'s, Yokohama, Kanagawa Prefecture, Japan', location: {lat: 35.456838, lng: 139.6310049}}
    ];

    return (
      <div>
          <div className="row" id='fullRow'>

              <div className="col-md-4 col-md-offset-1">
                    <div className='row'  id='leftBox'>
                        <br />

                        <div className='row'>

                          <div className='col-md-6'>
                            <TextField id='name' floatingLabelText="Name" onChange={this.storeName} floatingLabelFocusStyle={{color : grey900}} underlineFocusStyle={styles.underlineStyle} value={this.props.name} />
                            <br />
                            <label style={styles.errorLabel}> {this.props.nameErrorLabel} </label>
                          </div>
                        </div>

                        <div className='row'>

                          <div className='col-md-6'>
                            <TextField id='purpose' floatingLabelText='Purpose' onChange={this.storePurpose} floatingLabelFocusStyle={{color : grey900}} underlineFocusStyle={styles.underlineStyle} value={this.props.purpose}/>

                            <label style={styles.errorLabel}> {this.props.purposeErrorLabel} </label>
                          </div>
                        </div>
                        <br />
                        <br />
                        <div className='row' style={styles.datePush}>
                          <div className='col-md-6'>
                            <Geosuggest
                              placeholder='Restaurant location'
                              initialValue=''
                              country='JP'
                              fixtures={fixtures}
                              onSuggestSelect={this.suggestLocation}
                              onChange={this.storeLocation}
                              location={new google.maps.LatLng(35.44371, 139.63803)}
                              radius='40' />
                          </div>
                        </div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <div className='row' style={styles.datePush}>
                        <div className='col-md-12'>
                          <label style={styles.dateSelectLabel}> Select the Dates for the Event </label>

                        </div><br /><br /></div>
                        <div className="col-xs-12">
                            <div className='row'>{ dateArray }</div>
                          <div className='row center-xs'>
                            <label style={styles.errorLabel}> {this.props.dateArrayErrorLabel} </label>
                          </div>
                        </div>
                        <br />

                        <div className='row col-md-offset-2 center-xs' id="regButton">
                          <RaisedButton label="Register" labelColor={grey50} style={buttonStyle} backgroundColor={grey900} disabled={false} onTouchTap={this.registerEvent} />
                          <br />
                          <br />
                          <br />
                        </div>

                </div>
              </div>

              <div className='col-md-1 col-md-offset-1'>
                  <div className='verticalLine'>
                  </div>
              </div>
               <div className='col-md-4'>
                          <div>

                            <div className='col-xs-6'>
                                <InfiniteCalendar
                                theme={{
  selectionColor: 'rgb(6, 5, 6)',
  textColor: {
     default: '#333',
     active: '#FFF'
  },
  weekdayColor: 'rgb(49, 44, 49)',
  headerColor: 'rgb(6, 5, 6)',
  floatingNav: {
     background: 'rgb(6, 5, 6)',
     color: '#FFF',
     chevron: '#FFA726'
  }
}}
                                    layout='portrait'
                                    width={400}
                                    height={300}
                                    rowHeight={55}
                                    minDate={today}
                                    onSelect={this.storeDate}
                                    keyboardSupport={true}
                                />
                            </div>
                          </div>
              </div>
              </div>
      </div>
    );
  }
}

RegisterComponent.propTypes = {
  name: PropTypes.string.isRequired,
  purpose: PropTypes.string.isRequired,
  dateArray: PropTypes.array.isRequired,
  dateArrayErrorLabel: PropTypes.string.isRequired,
  nameErrorLabel: PropTypes.string.isRequired,
  purposeErrorLabel: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired
};

export default connect(state => ({
  name: state.name,
  purpose: state.purpose,
  dateArray: state.dateArray,
  dateArrayErrorLabel: state.dateArrayErrorLabel,
  nameErrorLabel: state.nameErrorLabel,
  purposeErrorLabel: state.purposeErrorLabel,
  location: state.location
}))(RegisterComponent);
