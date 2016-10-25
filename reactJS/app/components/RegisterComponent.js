import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';

// The below code is for extracting the location of browser. not working in localhost.
//import geolocator from 'geolocator';
import { grey600, red500, grey900, grey50 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import Chip from 'material-ui/Chip';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import englishJson from '../../en.json';
import MediaQuery from 'react-responsive';
import InfiniteCalendar from 'react-infinite-calendar';
import Geosuggest from 'react-geosuggest';

import { storeName, storePurpose, registerEvent, storeDateArray, storeDateArrayErrorLabel, popDateArray,
         storeNameErrorLabel, storePurposeErrorLabel, storeLocation, changelanguage } from './../actions/registerActions';

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
  },
  cal:{
    backgroundColor: 'rgba(78, 74, 74, 0.05)'
  }
};
let datePushResponsive = {
  marginTop : 30
}
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
    this.validateRegisterEvent = this.validateRegisterEvent.bind(this);
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
      this.props.dispatch(storeNameErrorLabel(this.props.languageJson.nameErrorLabel))
    } else {
      this.props.dispatch(storeNameErrorLabel(''))
      this.props.dispatch(storeName(e.target.value));
    }
  }

// stores the purpose of the event and throws an error in case of any edge cases failed.
  storePurpose(e) {
    if (e.target.value.length >= '100') {
      this.props.dispatch(storePurposeErrorLabel(this.props.languageJson.purposeErrorLabel))
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
      this.props.dispatch(storeDateArrayErrorLabel(this.props.languageJson.dateArrayExcessErrorLabel));
    }
  }

  storeLocation(location) {
    this.props.dispatch(storeLocation(location));
  }

  suggestLocation(location) {
    this.props.dispatch(storeLocation(location.label));
  }

  registerEvent() {
    let formattedEnteredDates = {};
    for (let i=0; i<this.props.dateArray.length; i++) {
      let date = this.props.dateArray[i];
      let formattedDate;

      if (date.indexOf("th") !== -1) {
        formattedDate = date.replace("th", "");
      } else if (date.indexOf("st") !== -1){
        formattedDate = date.replace("st", "");
      } else if (date.indexOf("nd") !== -1){
        formattedDate = date.replace("nd", "");
      } else {
        formattedDate = date.replace("rd", "");
      }
      formattedEnteredDates[formattedDate.split(",")[1]] = date;
    }

    let unorderedDates = Object.keys(formattedEnteredDates);
    let intermediateSortedDates = unorderedDates.sort(function(a,b) {
      return new Date(a) - new Date(b);
    });

    let sortedDates = [];

    for (let j=0; j<intermediateSortedDates.length; j++) {
      sortedDates[j] = formattedEnteredDates[intermediateSortedDates[j]];
    }

    this.props.dispatch(registerEvent(this.props.name, this.props.purpose, sortedDates, this.props.location));
  }

  validateRegisterEvent(e) {
    if (this.props.name.length === 0) {
      this.props.dispatch(storeNameErrorLabel(this.props.languageJson.nameErrorLabelRequired));
    } else if (this.props.purpose.length === 0) {
      this.props.dispatch(storePurposeErrorLabel(this.props.languageJson.purposeErrorLabelRequired));
    } else if (this.props.dateArray.length === 0){
      this.props.dispatch(storeDateArrayErrorLabel(this.props.languageJson.dateArrayEmptyErrorLabel));
    } else {
      this.registerEvent();
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
        <MediaQuery maxDeviceWidth={420}>
         <div className="row" id='fullRow'>

             <div className="col-md-12">
                 <Card>
                   <div className='row' style={{'padding':'20px'}}>
                       <br />

                       <div className='row'>

                         <div className='col-md-6'>
                           <TextField id='name' floatingLabelText={this.props.languageJson.name} onChange={this.storeName} floatingLabelFocusStyle={{color : grey900}} underlineFocusStyle={styles.underlineStyle} value={this.props.name} />
                           <br />
                           <label style={styles.errorLabel}> {this.props.nameErrorLabel} </label>
                         </div>
                       </div>

                       <div className='row'>

                         <div className='col-md-6'>
                           <TextField id='purpose' floatingLabelText={this.props.languageJson.purpose} onChange={this.storePurpose} floatingLabelFocusStyle={{color : grey900}} underlineFocusStyle={styles.underlineStyle} value={this.props.purpose}/>

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
                         <label style={styles.dateSelectLabel}> {this.props.languageJson.calendarLabel} </label>

                       </div><br /><br /></div>
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
                                 width={200}
                                 height={150}
                                 rowHeight={55}
                                 minDate={today}
                                 onSelect={this.storeDate}
                                 keyboardSupport={true}
                             />
                         </div>
                       </div><br /><br /><br /><br />
                     <div className="col-xs-12" style={datePushResponsive}>
                           <div className='row'><div className='col-xs-12'>{ dateArray }</div></div>
                         <div className='row center-xs'>
                           <label style={styles.errorLabel}> {this.props.dateArrayErrorLabel} </label>
                         </div>
                       </div>
                       <br />

                       <div className='row col-md-offset-2 center-xs' id="regButton">
                         <RaisedButton label={this.props.languageJson.register} labelColor={grey50} style={buttonStyle} backgroundColor={grey900} disabled={false} onTouchTap={this.registerEvent} />
                         <br />
                         <br />
                         <br />
                       </div>

               </div>
             </Card>
             </div>


              <div className='col-md-12'>

             </div>
             </div>
           </MediaQuery>
        <MediaQuery maxDeviceWidth={1224} minDeviceWidth={421}>
         <div className="row" id='fullRow'>

             <div className="col-md-12">
                 <Card>
                   <div className='row' style={{'padding':'32px'}}>
                       <br />

                       <div className='row'>

                         <div className='col-md-6'>
                           <TextField id='name' floatingLabelText={this.props.languageJson.name} onChange={this.storeName} floatingLabelFocusStyle={{color : grey900}} underlineFocusStyle={styles.underlineStyle} value={this.props.name} />
                           <br />
                           <label style={styles.errorLabel}> {this.props.nameErrorLabel} </label>
                         </div>
                       </div>

                       <div className='row'>

                         <div className='col-md-6'>
                           <TextField id='purpose' floatingLabelText={this.props.languageJson.purpose} onChange={this.storePurpose} floatingLabelFocusStyle={{color : grey900}} underlineFocusStyle={styles.underlineStyle} value={this.props.purpose}/>

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
                         <label style={styles.dateSelectLabel}> {this.props.languageJson.calendarLabel} </label>

                       </div><br /><br /></div>
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
                                 width={300}
                                 height={200}
                                 rowHeight={55}
                                 minDate={today}
                                 onSelect={this.storeDate}
                                 keyboardSupport={true}
                             />
                         </div>
                       </div><br /><br /><br /><br />
                     <div className="col-xs-12" style={datePushResponsive}>
                           <div className='row'>{ dateArray }</div>
                         <div className='row center-xs'>
                           <label style={styles.errorLabel}> {this.props.dateArrayErrorLabel} </label>
                         </div>
                       </div>
                       <br />

                       <div className='row col-md-offset-2 center-xs' id="regButton">
                         <RaisedButton label={this.props.languageJson.register} labelColor={grey50} style={buttonStyle} backgroundColor={grey900} disabled={false} onTouchTap={this.registerEvent} />
                         <br />
                         <br />
                         <br />
                       </div>

               </div>
             </Card>
             </div>


              <div className='col-md-12'>

             </div>
             </div>
           </MediaQuery>
           <MediaQuery minDeviceWidth={1224} orientation='landscape'>
          <div className="row" id='fullRow'>

              <div className="col-md-4 col-md-offset-1">
                  <Card>
                    <div className='row'>
                        <br />

                        <div className='row'>

                          <div className='col-md-6'>
                            <TextField id='name' floatingLabelText={this.props.languageJson.name} onChange={this.storeName} floatingLabelFocusStyle={{color : grey900}} underlineFocusStyle={styles.underlineStyle} value={this.props.name} />
                            <br />
                            <label style={styles.errorLabel}> {this.props.nameErrorLabel} </label>
                          </div>
                        </div>

                        <div className='row'>

                          <div className='col-md-6'>
                            <TextField id='purpose' floatingLabelText={this.props.languageJson.purpose} onChange={this.storePurpose} floatingLabelFocusStyle={{color : grey900}} underlineFocusStyle={styles.underlineStyle} value={this.props.purpose}/>

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
                          <label style={styles.dateSelectLabel}> {this.props.languageJson.calendarLabel} </label>

                        </div><br /><br /></div>
                        <div className="col-xs-12">
                            <div className='row'>{ dateArray }</div>
                          <div className='row center-xs'>
                            <label style={styles.errorLabel}> {this.props.dateArrayErrorLabel} </label>
                          </div>
                        </div>
                        <br />

                        <div className='row col-md-offset-2 center-xs' id="regButton">
                          <RaisedButton label={this.props.languageJson.register} labelColor={grey50} style={buttonStyle} backgroundColor={grey900} disabled={false} onTouchTap={this.validateRegisterEvent} />
                          <br />
                          <br />
                          <br />
                        </div>

                </div>
              </Card>
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
          </MediaQuery>
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
  location: PropTypes.string.isRequired,
  languageJson: PropTypes.object.isRequired
};

export default connect(state => ({
  name: state.name,
  purpose: state.purpose,
  dateArray: state.dateArray,
  dateArrayErrorLabel: state.dateArrayErrorLabel,
  nameErrorLabel: state.nameErrorLabel,
  purposeErrorLabel: state.purposeErrorLabel,
  location: state.location,
  languageJson: state.languageJson
}))(RegisterComponent);
