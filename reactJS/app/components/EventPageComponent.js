import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { grey600, red500, red200, blue500, green500, green200, yellow800, yellow200, grey900, grey50} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Table, Column, Cell} from 'fixed-data-table-2';
import MediaQuery from 'react-responsive';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Dialog from 'material-ui/Dialog';
import CopyToClipboard from 'react-copy-to-clipboard';
import IconButton from 'material-ui/IconButton';

import { fetchEvent, storePersonalizedDateSelection, storeAttendeeName, storeAttendeeNameErrorLabel,
         registerAttendee, updateNotificationFlag, emptyPersonalizedDateSelection,
         updateAttendee, fetchWeather, storeDisableFlag} from './../actions/registerActions';

let dateStatus;

let styles = {
  m_label: {
    text: 'bold',
    fontSize: '10px',
    color: 'rgb(173, 173, 173)',
    position: 'absolute',
    marginTop: '20px',
    width:'66%'
  },
  tab_label: {
   marginLeft: "-12px"
  },
  percentange_box: {
  padding: "10px",
  backgroundColor: "rgb(245, 245, 245)",
  borderRadius: "10px"
  },
  selected_circle: {
  textShadow: "rgb(59, 255, 59) 0px 0px 5px"
  },
  selected_triangle: {
  textShadow: "rgb(249, 169, 40) 0px 0px 5px"
  },
  selected_cross: {
  textShadow: "rgb(245, 82, 70) 0px 0px 5px"
  },
  formLabel: {
    text: 'bold',
    fontSize: '25px',
    color: '#000'
  },
  EventName: {
    text: 'bold',
    fontSize: '45px',
    color: '#000'
  },
  EventOrganizerName: {
    text: 'bold',
    fontSize: '35px',
    color: '#000',
    marginTop: '5px'
  },
  organizerNameLabel: {
    text: 'bold',
    fontSize: '16px',
    color: '#000'
  },
  LocationLabel: {
    fontSize: '18px',
    color: '#000',
    cursor: 'pointer'
  },
  underlineStyle: {
    borderColor: grey900,
  },
  underlineStyleforDesktop: {
    bottom: "-7px",
    borderBottom: "3px",
    borderBottomColor: "##d2d2d2",
    borderBottomStyle: "solid"
  },
  underlineFocussedStyleforDesktop: {
    bottom: "-7px",
    borderBottom: "3px",
    borderBottomColor: "black",
    borderBottomStyle: "solid"
  },
  formLabel3: {
    text: 'bold',
    fontSize: '25px',
    marginRight: '5px',
    color: '#000',
    float: 'right',
    marginTop: '50px'
  },
  dateLabel: {
    text: 'bold',
    fontSize: '25px',
    color: '#000'
  },
  errorLabel: {
    fontSize: '15px',
    color: 'rgba(244, 67, 54, 0.79)'
  },
  DesktoperrorLabel: {
    fontSize: '30px',
    marginTop: '10px',
    color: 'rgba(244, 67, 54, 0.79)'
  },
  paperStyle: {
    width: '50%'
  },
  block: {
    maxWidth: 100,
    marginBottom: 16
  },
  block1: {
    maxWidth: 115,
    marginBottom: 16
  },
  radioButton: {
    marginBottom: 16,
  },
  chip: {
   margin: 4,
 },
  chipwrapper: {
   display: 'flex',
   flexWrap: 'wrap',
 },
 highlightchip: {
   margin: 4,
   boxShadow: "0px 1px 5px #b7b6b6"
 },
 person: {
   color:"#828282",
   marginTop: "8px",
   fontSize: "15px"
 },
 uncheckedRectangle : {
   borderColor: "#A1A1A1",
   borderRadius: "50px",
   borderStyle: "solid",
   color: "#A1A1A1",
   paddingLeft: "10px",
   paddingRight: "10px",
   display: "inline-flex",
   verticalAlign: "middle",
   alignItems: "center"
 },
 checkedFreeRectangle : {
   borderColor: "#1bbb00",
   borderStyle: "solid",
   backgroundColor:"#1bbb00",
   boxShadow: "0 1px 7px 0 #1bbb00",
   borderRadius: "50px",
   color: "#fff",
   paddingLeft: "10px",
   paddingRight: "10px",
   display: "inline-flex",
   verticalAlign: "middle",
   alignItems: "center"
 },
 checkedMaybeRectangle : {
   borderColor: "#FFBC00",
   borderStyle: "solid",
   backgroundColor:"#FFBC00",
   boxShadow: "0 1px 7px 0 #FFBC00",
   borderRadius: "50px",
   color: "#fff",
   paddingLeft: "10px",
   paddingRight: "10px",
   display: "inline-flex",
   verticalAlign: "middle",
   alignItems: "center"
 },
 checkedBusyRectangle : {
   borderColor: "#FF4848",
   borderStyle: "solid",
   backgroundColor:"#FF4848",
   boxShadow: "0 1px 7px 0 #FF4848",
   borderRadius: "50px",
   color: "#fff",
   paddingLeft: "10px",
   paddingRight: "10px",
   display: "inline-flex",
   verticalAlign: "middle",
   alignItems: "center"
 },
 checkedSymbol : {
  fontWeight: "bolder"
 },
 uncheckedSymbol : {
   fontWeight: "bolder"
 },
 checkedText : {
   color: "#fff",
   fontSize : "30px",
   paddingLeft: "8px",
   userSelect: "none"
 },
 uncheckedText : {
   color: "#A1A1A1",
   fontSize : "30px",
   paddingLeft: "8px",
   userSelect: "none"
 }

};

let buttonStyle = {
  margin : 12,
  backgroundColor : "rgb(33, 33, 33)"
};


class EventPageComponent extends Component {

// The methods in the constructor are given to bind the function to redux's state object.
  constructor(props) {
    super(props);
    this.CountStatus = this.CountStatus.bind(this);
    this.handleDateToogle = this.handleDateToogle.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.storeAttendeeName = this.storeAttendeeName.bind(this);
    this.registerAttendee = this.registerAttendee.bind(this);
    this.toggleMobileCastAttendance = this.toggleMobileCastAttendance.bind(this);
    this.updateAttendee = this.updateAttendee.bind(this);
    this.checkDisableFlag = this.checkDisableFlag.bind(this);
    this.checkDisableUpdateFlag = this.checkDisableUpdateFlag.bind(this);
    this.checkAttendeeDateSelectionWithPresentSelection = this.checkAttendeeDateSelectionWithPresentSelection.bind(this);
  }

// The below method gets executed after all the components have been successfully rendered on the screen.
  componentDidMount() {
    RadioButton.defaultProps.disableTouchRipple = true;
    RadioButton.defaultProps.disableFocusRipple = true
    this.props.dispatch(fetchEvent(this.props.params.eventId));
    if (document.cookie.indexOf(encodeURI(this.props.params.eventId)) > -1) //If cookie got current event ID.. Directly add his name as update attendee name
    {
    this.props.dispatch(storeAttendeeName(cookie.load(encodeURI(this.props.params.eventId))));//later we need to add the latest name
    }
  }

// Store the selected date by the use to the personalizedDateSelection object.
// dispatch is the one that invokes the action creators.
  handleDateToogle(date, e) {
    this.props.dispatch(storePersonalizedDateSelection(date, e.target.value));
  }

  callAfterSomeTimeUpdateAttendee() {
    // for updating the attendee
    let attendee = this.getCookieAttendeeDetails();
    this.props.dispatch(updateAttendee(attendee.attendeeId, this.props.attendeeName, this.props.personalizedDateSelection, this.props.params.eventId));
    // let opt={};
    // opt.expires=new Date(2020, 1, 1, 0, 0, 1);
    // cookie.save(this.props.params.eventId, this.props.attendeeName, opt); // Save name in cookie event ID
    this.props.dispatch(storeAttendeeName(this.props.attendeeName));
    // this.props.dispatch(updateNotificationFlag('updateSuccess'));
  }

  fillTheLeftOutDatesUpdateAttendee() {
    let attendeeDetails = this.getCookieAttendeeDetails();
    let count = 0;
    for (let date in attendeeDetails.personalizedDateSelection) {
      if (attendeeDetails.personalizedDateSelection.hasOwnProperty(date)) {
        for (let key in this.props.personalizedDateSelection) {
          if (this.props.personalizedDateSelection.hasOwnProperty(key)) {
            if (date === key ) {
              count = 1;
            }
          }
        }
        if (count === 0) {
          this.props.dispatch(storePersonalizedDateSelection(date, attendeeDetails.personalizedDateSelection[date]));
        }
        count = 0;
      }
    }
  }

  updateAttendee() {
    console.log("coming inside update attendee");
    if (this.props.attendeeName.length === 0) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabel));
      this.props.dispatch(updateNotificationFlag('attendeeNameEmpty')); //If name is empty, bring snackbar
    } else if (this.duplicateCheck()) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabelDuplicate));
      this.props.dispatch(updateNotificationFlag('attendeeNameExists')); //If name is duplicate entry, bring snackbar
    } else {
      this.props.dispatch(storeDisableFlag('updateAttendee'));
      // populating personalizedDateSelection if user has not chosen any status.
      this.fillTheLeftOutDatesUpdateAttendee();
      // A timeout has been used, because There will be a little time taken for storing the default values
      // to the left-out dates. So, having a delay will give a consistency in the application.
      setTimeout((function() {
       this.callAfterSomeTimeUpdateAttendee();
     }).bind(this), 1000);
    }
  }

  // this function compares the attendee's date selection with present date selection, which decides the diablitiy of update button.
  checkAttendeeDateSelectionWithPresentSelection() {
    let attendeeDetails = this.getCookieAttendeeDetails();
    let presentAttendeeDetails = this.props.personalizedDateSelection;
    let pastAttendeeDetails = attendeeDetails.personalizedDateSelection;
    let returnValue = false;
    let count = 0;
    let originalLength = Object.keys(presentAttendeeDetails).length;
    if (Object.keys(presentAttendeeDetails).length === 0 && presentAttendeeDetails.constructor === Object) {
      returnValue = false;
    } else {
      for (let date in presentAttendeeDetails) {
        if (presentAttendeeDetails.hasOwnProperty(date)) {
          if (presentAttendeeDetails[date] === pastAttendeeDetails[date]){
            count ++;
          }
        }
      }
      if (count !== originalLength) {
        returnValue = true;
      }
    }
    return returnValue;
  }

  checkDisableUpdateFlag() {
    let cookieAttendee = cookie.load(encodeURI(this.props.params.eventId));
    if (this.props.disableFlag === 'updateAttendee') {
      // console.log("post update disable condition passes");
      return true;
    } else if (this.props.attendeeName !== cookieAttendee || this.checkAttendeeDateSelectionWithPresentSelection()) {
      // console.log("pre update siable condition passes");
      return false;
    } else {
      return true;
    }
  }

  duplicateCheck() {
    let attendees = this.props.eventObj.attendees;
    if (document.cookie.indexOf(encodeURI(this.props.params.eventId)) == -1) {
      // In case no cookie, just find if duplicate exists.
      for (let i = 0; i < attendees.length; i++) {
        if (this.props.attendeeName.toUpperCase() === attendees[i].attendeeName.toUpperCase()) {
          return true;
        }
      }
      return false;

    } else {
      // In case of cookie, add another codition so that it does not compare to same attendee.
      let attendeeDetails = this.getCookieAttendeeDetails();

      for (let j = 0; j < attendees.length; j++) {
        if (this.props.attendeeName.toUpperCase() === attendees[j].attendeeName.toUpperCase() && (attendeeDetails.attendeeId !== attendees[j].attendeeId) ) {
          return true;
        }
      }
      return false;

  }
}

// This cast by attendess will be invoked after an secod for providing delay.
  callAfterSomeTimeRegisterAttendee() {
    this.props.dispatch(registerAttendee(this.props.attendeeName, this.props.personalizedDateSelection, this.props.params.eventId)); // Update in DB
    // this.props.dispatch(updateNotificationFlag('registerSuccess')); //If name is empty, bring snackbar
  //   setTimeout((function() {
  //     cookie.save(this.props.params.eventId, this.props.attendeeName); // Save name in cookie event ID
  //  }).bind(this), 800);
  }

// This is an helper function to store the dates that have not been selected by the user.
// for instance, there are six dates, and the user selects the status(free, maybe, busy) for the four and
// leaves the remaining dates, then the below method will give default values to the unselected dates by the user.
  fillTheLeftOutDatesRegisterAttendee() {
    let count = 0;
    this.props.eventObj.dateArray.map((date, i) => {
      for (let key in this.props.personalizedDateSelection) {
        if (this.props.personalizedDateSelection.hasOwnProperty(key)) {
          if (date === key ) {
            count = 1;
          }
        }
      }
      if (count === 0) {
        this.props.dispatch(storePersonalizedDateSelection(date, 'busy'));
      }
      count = 0;
    });
  }

// stores the attendess selection of dates and his name.
  registerAttendee(e) {
    if (this.props.attendeeName.length === 0) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabel));
      this.props.dispatch(updateNotificationFlag('attendeeNameEmpty')); //If name is empty, bring snackbar
    } else if (this.duplicateCheck()) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabelDuplicate));
      this.props.dispatch(updateNotificationFlag('attendeeNameExists')); //If name is duplicate entry, bring snackbar
    } else {
      this.props.dispatch(storeDisableFlag('registerAttendee'));
      // populating personalizedDateSelection if user has not chosen any status.
      this.fillTheLeftOutDatesRegisterAttendee();

      // A timeout has been used, because There will be a little time taken for storing the default values
      // to the left-out dates. So, having a delay will give a consistency in the application.
      setTimeout((function() {
       this.callAfterSomeTimeRegisterAttendee();
     }).bind(this), 1000);
    }
  }

  checkDisableFlag() {
   if(this.props.disableFlag === 'registerAttendee' || this.props.disableFlag === 'updateAttendee'){
     console.log("disable aairchu");
     return true;
   } else {
     return false;
   }
  }

  // Will store attendeeName and invoke error action in case of failed edge case.
  storeAttendeeName(e) {
      if (e.target.value.length >= '40') {
        this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabel))
      } else {
        this.props.dispatch(storeAttendeeNameErrorLabel(''));
        this.props.dispatch(storeAttendeeName(e.target.value));
      }
  }

  // this is for rendering the dates both in event table and in attendance submission section
  renderWithOrWithoutWeather() {

    let datesInColumn = [];
    let weathercode;
    let weather=
    {
      "0" : "wi wi-tornado",
      "1" : "wi wi-tornado",
      "2" : "wi wi-tornado",
      "3" : "wi wi-thunderstorm",
      "4" : "wi wi-thunderstorm",
      "5" : "wi wi-snow-wind",
      "6" : "wi wi-sleet",
      "7" : "wi wi-snow-wind",
      "8" : "wi wi-sleet",
      "9" : "wi wi-sleet",
      "10" : "wi wi-rain-mix",
      "11" : "wi wi-showers",
      "12" : "wi wi-showers",
      "13" : "wi wi-snow",
      "14" : "wi wi-snow-wind",
      "15" : "wi wi-snow-wind",
      "16" : "wi wi-snow",
      "17" : "wi wi-snow-wind",
      "18" : "wi wi-snow-wind",
      "19" : "wi wi-snow-wind",
      "20" : "wi wi-fog",
      "21" : "wi wi-day-haze",
      "22" : "wi wi-smoke",
      "23" : "wi wi-strong-wind",
      "24" : "wi wi-windy",
      "25" : "wi wi-snowflake-cold",
      "26" : "wi wi-cloudy",
      "27" : "wi wi-night-alt-cloudy",
      "28" : "wi wi-day-cloudy",
      "29" : "wi wi-night-alt-cloudy",
      "30" : "wi wi-day-cloudy",
      "31" : "wi wi-night-clear",
      "32" : "wi wi-day-sunny",
      "33" : "wi wi-night-alt-cloudy",
      "34" : "wi wi-day-sunny",
      "35" : "wi wi-rain-mix",
      "36" : "wi wi-hot",
      "37" : "wi wi-storm-showers",
      "38" : "wi wi-storm-showers",
      "39" : "wi wi-storm-showers",
      "40" : "wi wi-showers",
      "41" : "wi wi-snow",
      "42" : "wi wi-rain-mix",
      "43" : "wi wi-snow-wind",
      "44" : "wi wi-cloud",
      "45" : "wi wi-storm-showers",
      "46" : "wi wi-rain-mix",
      "47" : "wi wi-storm-showers"
    };
    if (this.props.weather.length === 0) {
    // when weather information from yahoo is not available. render dates alone.
    datesInColumn = this.props.eventObj.dateArray;
    // console.log("no weather");
    } else {
    // After weather info from yahoo, add forecast images to date.
    // formats the (Sun, Oct 2nd 2016) to (Oct 2 2016) for date validation.
    let formattedEnteredDates = [];
    for (let i = 0; i < this.props.eventObj.dateArray.length; i++) {
        let date = this.props.eventObj.dateArray[i];
        let formattedDate;

        if (date.indexOf("th") !== -1) {
            formattedDate = date.replace("th", "");
        } else if (date.indexOf("st") !== -1) {
            formattedDate = date.replace("st", "");
        } else if (date.indexOf("nd") !== -1) {
            formattedDate = date.replace("nd", "");
        } else {
            formattedDate = date.replace("rd", "");
        }
        formattedEnteredDates[i] = formattedDate.split(",")[1];
    }

    for (let i = 0; i < formattedEnteredDates.length; i++) {
        let dateInColumn = '';
        for (let j = 0; j < this.props.weather.length; j++) {
            let enteredDate = new Date(formattedEnteredDates[i]);
            let weatherDate = new Date(this.props.weather[j].date);
            if ((enteredDate.getDate() === weatherDate.getDate()) && (enteredDate.getMonth() === weatherDate.getMonth()) && (enteredDate.getYear() === weatherDate.getYear())) {
                dateInColumn = this.props.eventObj.dateArray[i]; //+ ", " + this.props.weather[j].code;
                weathercode = this.props.weather[j].code;
            }
        }

        if (dateInColumn !== '') {
            datesInColumn.push(
              <div>{dateInColumn}<i className={weather[weathercode]}></i></div>
            );
        } else {
            datesInColumn.push(<div>{this.props.eventObj.dateArray[i]}<i className={weather["3200"]}></i></div>);
        }
        weathercode = '';
    }
   }
   return datesInColumn;
  }

  // this renders the date in table from the return value of renderWithOrWithoutWeather.
  fillDatesInColumn() {
    let datesInColumn = this.renderWithOrWithoutWeather();

    return (
      <Column
        header={<Cell>Dates</Cell>}
        cell={props => (
          <Cell {...props}>
            {datesInColumn[props.rowIndex]}
          </Cell>
        )}
        fixed={true}
        width={190}
      />
    );
  }

// This method is responsible for calculating the count of free, maybe and busy for a given date.
  CountStatus() {

    let dateStatusArray = this.props.eventObj.dateArray;
    dateStatus = {};
    dateStatus['free'] = {};
    dateStatus['maybe'] = {};
    dateStatus['busy'] = {};
    for (let i = 0; i < dateStatusArray.length; i++) {
        dateStatus['free'][dateStatusArray[i]] = 0;
        dateStatus['maybe'][dateStatusArray[i]] = 0;
        dateStatus['busy'][dateStatusArray[i]] = 0;
    }

    for (let j = 0; j < this.props.eventObj.attendees.length; j++) {
        let attendeesDateSelection = this.props.eventObj.attendees[j].personalizedDateSelection;
        for (let key in attendeesDateSelection) {
            if (attendeesDateSelection.hasOwnProperty(key)) {
                for (let dateStatuskey in dateStatus['free']) {
                    if (dateStatus['free'].hasOwnProperty(dateStatuskey)) {
                        if ((key === dateStatuskey) && (attendeesDateSelection[key] === 'free')) {
                            dateStatus['free'][dateStatuskey] = dateStatus['free'][dateStatuskey] + 1;
                        }
                        if ((key === dateStatuskey) && (attendeesDateSelection[key] === 'maybe')) {
                            dateStatus['maybe'][dateStatuskey] = dateStatus['maybe'][dateStatuskey] + 1;
                        }
                        if ((key === dateStatuskey) && (attendeesDateSelection[key] === 'busy')) {
                            dateStatus['busy'][dateStatuskey] = dateStatus['busy'][dateStatuskey] + 1;
                        }
                    }
                }
            }
        }
    }
  }

// Generate column to list free status count for each date
  fillFreeStatus() {

    this.CountStatus(); // Count status for each date and stores in dateStatus array

    let arrFree = Object.keys(dateStatus['free']).map(function (key) {return dateStatus['free'][key]});

    return (
      <Column
        header={<Cell>Free</Cell>}
        cell={props => (
          <Cell {...props}>
            {arrFree[props.rowIndex]}
          </Cell>
        )}
        width={80}
      />
    );
  }

// Generate column to list maybe status count for each date
  fillMaybeStatus() {

    let arrMaybe = Object.keys(dateStatus['maybe']).map(function (key) {return dateStatus['maybe'][key]});

    return (
      <Column
        header={<Cell>Maybe</Cell>}
        cell={props => (
          <Cell {...props}>
            {arrMaybe[props.rowIndex]}
          </Cell>
        )}
        width={80}
      />
    );

  }

// Generate column to list maybe status count for each date
  fillBusyStatus() {

    let arrBusy = Object.keys(dateStatus['busy']).map(function (key) {return dateStatus['busy'][key]});

    return (
      <Column
        header={<Cell>Busy</Cell>}
        cell={props => (
          <Cell {...props}>
            {arrBusy[props.rowIndex]}
          </Cell>
        )}
        width={80}
      />
    );

  }

  // Fills the attendess selection in the event table.
  fillAttendeeDetails() {
    let attendees = this.props.eventObj.attendees;
    let dateArray = this.props.eventObj.dateArray;
    if (attendees.length !== 0) {
      let attendeesColumn = attendees.map((attendee, i) => {
        let orderedDateStausArray = [];
        dateArray.map((date, i) => {
          for (let key in attendee.personalizedDateSelection) {
            if (attendee.personalizedDateSelection.hasOwnProperty(key)) {
              if (date === key) {
                if (attendee.personalizedDateSelection[key] === 'free') {
                  orderedDateStausArray.push(<FontIcon className='material-icons' color={green500}>panorama_fish_eye</FontIcon>);
                }
                if (attendee.personalizedDateSelection[key] === 'maybe') {
                  orderedDateStausArray.push(<FontIcon className='material-icons' color={yellow800}>change_history</FontIcon>);
                }
                if (attendee.personalizedDateSelection[key] === 'busy') {
                  orderedDateStausArray.push(<FontIcon className='material-icons' color={red500}>clear</FontIcon>);
                }
              }
            }
          }
        });
        return (
          <Column
            header={<Cell>{attendee.attendeeName}</Cell>}
            cell={props => (
              <Cell {...props}>
                {orderedDateStausArray[props.rowIndex]}
              </Cell>
            )}
            width={100}
          />
        );
      });
      return attendeesColumn;
    } else {
      return null;
    }
  }

// Generate Chips based on status and list
  MobileAttendeeChips(status,list) {

   switch (status) {
    case "free":
        return list.map((name, k) => {
          if(name==this.props.attendeeName || name=="You")
          {
            return (
                <Chip backgroundColor={green200} style={styles.highlightchip}><Avatar backgroundColor={green500} icon={< FontIcon className = "material-icons" > panorama_fish_eye < /FontIcon>}/>{name}</Chip>
            );
          }
          else
          {
            return (
                <Chip backgroundColor={green200} style={styles.chip}><Avatar backgroundColor={green500} icon={< FontIcon className = "material-icons" > panorama_fish_eye < /FontIcon>}/>{name}</Chip>
            );
          }
        });
        break;
    case "maybe":
        return list.map((name, k) => {
          if(name==this.props.attendeeName || name=="You")
          {
            return (
                <Chip backgroundColor={yellow200} style={styles.highlightchip}><Avatar backgroundColor={yellow800} icon={< FontIcon className = "material-icons" > change_history < /FontIcon>}/>{name}</Chip>
            );
          }
          else {
            return (
                <Chip backgroundColor={yellow200} style={styles.chip}><Avatar backgroundColor={yellow800} icon={< FontIcon className = "material-icons" > change_history < /FontIcon>}/>{name}</Chip>
            );
          }
        });
        break;
    case "busy":
        return list.map((name, k) => {
          if(name==this.props.attendeeName || name=="You")
          {
            return (
                <Chip backgroundColor={red200} style={styles.highlightchip}><Avatar backgroundColor={red500} icon={< FontIcon className = "material-icons" > clear < /FontIcon>}/>{name}</Chip>
            );
          }
          else {
            return (
                <Chip backgroundColor={red200} style={styles.chip}><Avatar backgroundColor={red500} icon={< FontIcon className = "material-icons" > clear < /FontIcon>}/>{name}</Chip>
            );
          }
        });
        break;
   }

  }

  // Generate Desktop toggle buttons
  DesktopToggleButtons(date,cookie_available){
      let status='busy'
      if(cookie_available && this.getCookieAttendeeDetails())
      {
        let attendeeDetails = this.getCookieAttendeeDetails();

        for (let attendeeDate in attendeeDetails.personalizedDateSelection) {
            if (attendeeDetails.personalizedDateSelection.hasOwnProperty(attendeeDate)) {
                if (attendeeDate === date) {
                  status = attendeeDetails.personalizedDateSelection[attendeeDate];
                }
              }
            }
      }

        return ( //Cookie available (respective status based on attendee)
          <div>
                  <RadioButtonGroup name='shipSpeed' className='row' onChange={this.handleDateToogle.bind(this, date)} defaultSelected={status}>

                      <RadioButton
                      className='col-xs-4 end-xs'
                      value='free'
                      style={{"height":"40px","width":"30%"}}
                      checkedIcon={
                          <div style={styles.checkedFreeRectangle}>
                              < FontIcon
                                className = 'material-icons'
                                color = {"white"}
                                style={styles.checkedSymbol}>
                                panorama_fish_eye
                              < /FontIcon>
                              <span style={styles.checkedText}>Free</span>
                            </div>
                          }
                      uncheckedIcon={
                        <div style={styles.uncheckedRectangle}>
                            < FontIcon
                              className = 'material-icons'
                              color = {"#A1A1A1"}
                              style={styles.uncheckedSymbol}>
                              panorama_fish_eye
                            < /FontIcon>
                            <span style={styles.uncheckedText}>Free</span>
                          </div>
                          }
                      />

                      <RadioButton
                      className='col-xs-4'
                      style={{"height":"40px","width":"30%"}}
                      value='maybe'
                      checkedIcon={
                          <div style={styles.checkedMaybeRectangle}>
                              < FontIcon
                                className = 'material-icons'
                                color = {"white"}
                                style={styles.checkedSymbol}>
                                change_history
                              < /FontIcon>
                              <span style={styles.checkedText}>Maybe</span>
                            </div>
                          }
                      uncheckedIcon={
                        <div style={styles.uncheckedRectangle}>
                            < FontIcon
                              className = 'material-icons'
                              color = {"#A1A1A1"}
                              style={styles.uncheckedSymbol}>
                              change_history
                            < /FontIcon>
                            <span style={styles.uncheckedText}>Maybe</span>
                          </div>
                          }
                      />

                      <RadioButton
                      className='col-xs-4'
                      style={{"height":"40px","width":"25%"}}
                      value='busy'
                      checkedIcon={
                          <div style={styles.checkedBusyRectangle}>
                              < FontIcon
                                className = 'material-icons'
                                color = {"white"}
                                style={styles.checkedSymbol}>
                                clear
                              < /FontIcon>
                              <span style={styles.checkedText}>Busy</span>
                            </div>
                          }
                      uncheckedIcon={
                        <div style={styles.uncheckedRectangle}>
                            < FontIcon
                              className = 'material-icons'
                              color = {"#A1A1A1"}
                              style={styles.uncheckedSymbol}>
                              clear
                            < /FontIcon>
                            <span style={styles.uncheckedText}>Busy</span>
                          </div>
                          }
                      />

                  </RadioButtonGroup>
          </div>
        );

    }

// Generate mobile toggle buttons
  MobileToggleButtons(date,cookie_available){
    let status='busy'
    if(cookie_available && this.getCookieAttendeeDetails())
    {
      let attendeeDetails = this.getCookieAttendeeDetails();

      for (let attendeeDate in attendeeDetails.personalizedDateSelection) {
          if (attendeeDetails.personalizedDateSelection.hasOwnProperty(attendeeDate)) {
              if (attendeeDate === date) {
                status = attendeeDetails.personalizedDateSelection[attendeeDate];
              }
            }
          }
    }

      return ( //Cookie available (respective status based on attendee)
        <div>
            <MediaQuery minDeviceWidth={339}>
                {/** Tablets and phablets: display label for radio buttons*/}
                <RadioButtonGroup name='shipSpeed' className='row' onChange={this.handleDateToogle.bind(this, date)} defaultSelected={status}>

                    <RadioButton className='col-xs-4' style={{}} value='free' label='Free' labelStyle={styles.tab_label} checkedIcon={< FontIcon className = 'material-icons' color = {
                        green500
                    } style={styles.selected_circle} > panorama_fish_eye < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons'> panorama_fish_eye < /FontIcon>}/>

                    <RadioButton className='col-xs-4' style={{}} value='maybe' label='Maybe' labelStyle={styles.tab_label} checkedIcon={< FontIcon className = 'material-icons' color = {
                        yellow800
                    } style={styles.selected_triangle}
                     > change_history < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons'> change_history < /FontIcon>}/>

                    <RadioButton className='col-xs-4' value='busy' label='Busy' labelStyle={styles.tab_label} checkedIcon={< FontIcon className = 'material-icons' color = {
                        red500
                    } style={styles.selected_cross} > clear < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' > clear < /FontIcon>}/>

                </RadioButtonGroup>
            </MediaQuery>

            <MediaQuery maxDeviceWidth={339} style={{"paddingLeft":"7px"}}>
                {/** Small screen Smartphones */}
                <RadioButtonGroup name='shipSpeed' className='row' onChange={this.handleDateToogle.bind(this, date)} defaultSelected={status}>

                    <RadioButton className='col-xs-offset-1 col-xs-3' value='free' label='Free' style={{}} labelStyle={styles.m_label} checkedIcon={< FontIcon className = 'material-icons' color = {
                        green500
                    } style={styles.selected_circle}
                     > panorama_fish_eye < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' > panorama_fish_eye < /FontIcon>}/>

                   <RadioButton className='col-xs-3' value='maybe' label='Maybe' style={{}} labelStyle={styles.m_label} checkedIcon={< FontIcon className = 'material-icons' color = {
                        yellow800
                    } style={styles.selected_triangle} > change_history < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons'> change_history < /FontIcon>}/>

                  <RadioButton className='col-xs-3' value='busy' label="Busy" style={{}} labelStyle={styles.m_label} checkedIcon={< FontIcon className = 'material-icons' color = {
                        red500
                    } style={styles.selected_cross} > clear < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons'> clear < /FontIcon>}/>

                </RadioButtonGroup>
            </MediaQuery>
        </div>
      );

  }

  renderLightSaberGraph(free_count,maybe_count,busy_count){
    return(
           <div style={{display:"flex"}}>
          <div style={{backgroundColor: "rgb(44, 212, 44)",height: "2px",width: free_count,boxShadow: "0px 0px 4px rgb(59, 255, 59)",WebkitTransition: "width 2s ease-in-out",MozTransition: "width 2s ease-in-out",OTransition: "width 2s ease-in-out",transition: "width 2s ease-in-out"}}></div>
          <div style={{backgroundColor: "rgb(253, 189, 55)",height: "2px",width: maybe_count,boxShadow: "0px 0px 4px rgb(253, 189, 55)",WebkitTransition: "width 2s ease-in-out",MozTransition: "width 2s ease-in-out",OTransition: "width 2s ease-in-out",transition: "width 2s ease-in-out"}}></div>
          <div style={{backgroundColor: "rgba(244, 67, 54, 0.79)",height: "2px",width: busy_count,boxShadow: "0px 0px 4px rgba(244, 67, 54, 0.79)",WebkitTransition: "width 2s ease-in-out",MozTransition: "width 2s ease-in-out",OTransition: "width 2s ease-in-out",transition: "width 2s ease-in-out"}}></div>
          </div>
    );
  }

  renderDesktopLightSaberGraph(free_count,maybe_count,busy_count){
    return(
           <div style={{display:"flex"}}>
          <div style={{backgroundColor: "rgb(44, 212, 44)",height: "4px",width: free_count,boxShadow: "0px 0px 4px rgb(59, 255, 59)",WebkitTransition: "width 2s ease-in-out",MozTransition: "width 2s ease-in-out",OTransition: "width 2s ease-in-out",transition: "width 2s ease-in-out"}}></div>
          <div style={{backgroundColor: "rgb(253, 189, 55)",height: "4px",width: maybe_count,boxShadow: "0px 0px 4px rgb(253, 189, 55)",WebkitTransition: "width 2s ease-in-out",MozTransition: "width 2s ease-in-out",OTransition: "width 2s ease-in-out",transition: "width 2s ease-in-out"}}></div>
          <div style={{backgroundColor: "rgba(244, 67, 54, 0.79)",height: "4px",width: busy_count,boxShadow: "0px 0px 4px rgba(244, 67, 54, 0.79)",WebkitTransition: "width 2s ease-in-out",MozTransition: "width 2s ease-in-out",OTransition: "width 2s ease-in-out",transition: "width 2s ease-in-out"}}></div>
          </div>
    );
  }

  // Generate Date toggle based on cookie
  DesktopdateToggleSection(cookie_available) {
      let dateArray = this.props.eventObj.dateArray; //  Get date list
      let attendees = this.props.eventObj.attendees; //  Get attendees list


      return dateArray.map((date, i) =>{ // for each date create a card
      let freelist = [], maybelist = [], busylist = [];
      let free_count=0,maybe_count=0,busy_count=0,defaultBusy_check=1;
      let free_percent=0,maybe_percent=0,busy_percent=0
      let total = attendees.length; // No. of attendees for the event as per DB
        attendees.map((attendee, j) => { // for each attendee check status for the given date
          for (let key in attendee.personalizedDateSelection) {
            if (attendee.personalizedDateSelection.hasOwnProperty(key)) {
              if (date === key) {
                switch(attendee.personalizedDateSelection[key])
                {
                  case "free":
                    free_count++;
                    (cookie_available && this.getCookieAttendeeDetails().attendeeId == attendee.attendeeId)?freelist.push(this.props.attendeeName):freelist.push(attendee.attendeeName);
                  break;
                  case "maybe":
                    maybe_count++;
                    (cookie_available && this.getCookieAttendeeDetails().attendeeId == attendee.attendeeId)?maybelist.push(this.props.attendeeName):maybelist.push(attendee.attendeeName);
                  break;
                  case "busy":
                    busy_count++;
                    (cookie_available && this.getCookieAttendeeDetails().attendeeId == attendee.attendeeId)?busylist.push(this.props.attendeeName):busylist.push(attendee.attendeeName);
                  break;
                }

              }
            }
          }
        });

       //This block of code is to check for current status selection and create realtime lightsaber graph

       if(!cookie_available) // New User
       {
         total = total +1; // Increment by 1 coz we create graph including this new user
       for(let key in this.props.personalizedDateSelection){
         if(date==key)
         {
           defaultBusy_check=0; // Check if User changed status from default busy
           switch(this.props.personalizedDateSelection[key])
           {
             case "free": free_count++; freelist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName); break;
             case "maybe": maybe_count++; maybelist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName); break;
             case "busy": busy_count++; busylist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName); break;
           }
         }
       }

        //Increase busy count +1 if date is checked busy (default)
        if(defaultBusy_check==1) {
          busy_count++;
          busylist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName);
        }

      }

      else { // Old User

        let attendeeDetails = this.getCookieAttendeeDetails();

        for (let attendeeDate in attendeeDetails.personalizedDateSelection) {
            if (attendeeDetails.personalizedDateSelection.hasOwnProperty(attendeeDate)) {
                if (attendeeDate === date) {
                  status = attendeeDetails.personalizedDateSelection[attendeeDate]; // Get his previous status which is stored in DB
                  for(let key in this.props.personalizedDateSelection){
                    if(date==key && this.props.personalizedDateSelection[key]!=status) // If user is changing his mind , then update graph
                    {
                      // Increment his/her new decision
                      switch(this.props.personalizedDateSelection[key])
                      {
                        case "free": free_count++; freelist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName); break;
                        case "maybe": maybe_count++; maybelist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName); break;
                        case "busy": busy_count++; busylist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName); break;
                      }

                      // Decrement his/her old decision
                      switch(status)
                      {
                        case "free": free_count--; freelist=freelist.filter(e => e !== this.props.attendeeName); break;
                        case "maybe": maybe_count--; maybelist=maybelist.filter(e => e !== this.props.attendeeName); break;
                        case "busy": busy_count--; busylist=busylist.filter(e => e !== this.props.attendeeName); break;
                      }

                    }
                  }
                }
              }
            }

      }

        free_percent=parseFloat(((free_count*100)/total).toFixed(1)).toString() + "%";
        maybe_percent=parseFloat(((maybe_count*100)/total).toFixed(1)).toString() + "%";
        busy_percent=parseFloat(((busy_count*100)/total).toFixed(1)).toString() + "%";

        let weatherdates = this.renderWithOrWithoutWeather();

        return (

      <div className = 'row'>
      <div className='col-sm-offset-1 col-md-10'>
      <Card expandable={true} style={{"boxShadow":"rgba(0, 0, 0, 0.43) 0px 1px 6px, rgba(0, 0, 0, 0.17) 0px 1px 4px"}}>

      <CardHeader
      showExpandableButton={true} >
      <div className ="row" style={{"marginBottom":"17px"}}>
        <div className="col-xs-5" style={{"fontSize":"35px"}}>
          {weatherdates[i]}
        </div>
        <div className="col-xs-7">
          {this.DesktopToggleButtons(date,cookie_available)}
        </div>
        </div>
      </CardHeader>


            <CardText expandable={true}>
                <div className = 'row center-xs' style={styles.percentange_box}>
                  <div className = 'col-xs-4'>
                    <span style={{"color":"rgb(0, 189, 0)","fontSize":"20px"}}>{free_percent}</span>
                    <br></br>
                    <span style={{"color":"rgb(0, 189, 0)","fontSize":"14px"}}>{free_count}</span>

                  </div>
                  <div className = 'col-xs-4'>
                    <span style={{"color":"rgb(226, 159, 18)","fontSize":"20px"}}>{maybe_percent}</span>
                    <br></br>
                    <span style={{"color":"rgb(226, 159, 18)","fontSize":"14px"}}>{maybe_count}</span>

                  </div>
                  <div className = 'col-xs-4'>
                    <span style={{"color":"rgb(216, 51, 38)","fontSize":"20px"}}>{busy_percent}</span>
                    <br></br>
                    <span style={{"color":"rgb(216, 51, 38)","fontSize":"14px"}}>{busy_count}</span>

                  </div>
                </div>
              <br></br>
              <div className = 'row center-xs'>
                <div style={{"display": "flex","flexWrap": "wrap","paddingTop":"20px","paddingBottom":"20px"}}>
                  {this.MobileAttendeeChips("free",freelist)}
                  {this.MobileAttendeeChips("maybe",maybelist)}
                  {this.MobileAttendeeChips("busy",busylist)}
                </div>
              </div>
            </CardText>

              <div className ="row" style={{"marginTop":"-10px"}}>
                <div className="col-xs-12">
                  {this.renderDesktopLightSaberGraph(free_percent,maybe_percent,busy_percent)}
               </div>
               <br></br>
             </div>

      </Card>
      <br></br>
      <br></br>
      </div>
      </div>

        );
      });
    }

// Generate Date toggle based on cookie
  MobiledateToggleSection(cookie_available) {
    let dateArray = this.props.eventObj.dateArray; //  Get date list
    let attendees = this.props.eventObj.attendees; //  Get attendees list


    return dateArray.map((date, i) =>{ // for each date create a card
    let freelist = [], maybelist = [], busylist = [];
    let free_count=0,maybe_count=0,busy_count=0,defaultBusy_check=1;
    let free_percent=0,maybe_percent=0,busy_percent=0
    let total = attendees.length; // No. of attendees for the event as per DB
      attendees.map((attendee, j) => { // for each attendee check status for the given date
        for (let key in attendee.personalizedDateSelection) {
          if (attendee.personalizedDateSelection.hasOwnProperty(key)) {
            if (date === key) {
              switch(attendee.personalizedDateSelection[key])
              {
                case "free":
                  free_count++;
                  (cookie_available && this.getCookieAttendeeDetails().attendeeId == attendee.attendeeId)?freelist.push(this.props.attendeeName):freelist.push(attendee.attendeeName);
                break;
                case "maybe":
                  maybe_count++;
                  (cookie_available && this.getCookieAttendeeDetails().attendeeId == attendee.attendeeId)?maybelist.push(this.props.attendeeName):maybelist.push(attendee.attendeeName);
                break;
                case "busy":
                  busy_count++;
                  (cookie_available && this.getCookieAttendeeDetails().attendeeId == attendee.attendeeId)?busylist.push(this.props.attendeeName):busylist.push(attendee.attendeeName);
                break;
              }

            }
          }
        }
      });

     //This block of code is to check for current status selection and create realtime lightsaber graph

     if(!cookie_available) // New User
     {
       total = total +1; // Increment by 1 coz we create graph including this new user
     for(let key in this.props.personalizedDateSelection){
       if(date==key)
       {
         defaultBusy_check=0; // Check if User changed status from default busy
         switch(this.props.personalizedDateSelection[key])
         {
           case "free": free_count++; freelist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName); break;
           case "maybe": maybe_count++; maybelist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName); break;
           case "busy": busy_count++; busylist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName); break;
         }
       }
     }

      //Increase busy count +1 if date is checked busy (default)
      if(defaultBusy_check==1) {
        busy_count++;
        busylist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName);
      }

    }

    else { // Old User

      let attendeeDetails = this.getCookieAttendeeDetails();

      for (let attendeeDate in attendeeDetails.personalizedDateSelection) {
          if (attendeeDetails.personalizedDateSelection.hasOwnProperty(attendeeDate)) {
              if (attendeeDate === date) {
                status = attendeeDetails.personalizedDateSelection[attendeeDate]; // Get his previous status which is stored in DB
                for(let key in this.props.personalizedDateSelection){
                  if(date==key && this.props.personalizedDateSelection[key]!=status) // If user is changing his mind , then update graph
                  {
                    // Increment his/her new decision
                    switch(this.props.personalizedDateSelection[key])
                    {
                      case "free": free_count++; freelist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName); break;
                      case "maybe": maybe_count++; maybelist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName); break;
                      case "busy": busy_count++; busylist.push(this.props.attendeeName.length==0?"You":this.props.attendeeName); break;
                    }

                    // Decrement his/her old decision
                    switch(status)
                    {
                      case "free": free_count--; freelist=freelist.filter(e => e !== this.props.attendeeName); break;
                      case "maybe": maybe_count--; maybelist=maybelist.filter(e => e !== this.props.attendeeName); break;
                      case "busy": busy_count--; busylist=busylist.filter(e => e !== this.props.attendeeName); break;
                    }

                  }
                }
              }
            }
          }

    }

      free_percent=parseFloat(((free_count*100)/total).toFixed(1)).toString() + "%";
      maybe_percent=parseFloat(((maybe_count*100)/total).toFixed(1)).toString() + "%";
      busy_percent=parseFloat(((busy_count*100)/total).toFixed(1)).toString() + "%";

      let weatherdates = this.renderWithOrWithoutWeather();

      return (

    <div className = 'row'>
    <div className='col-sm-offset-2 col-sm-8 col-xs-12'>
    <Card expandable={true}>
      <CardHeader
          style={{textAlign:"center"}}
          titleStyle={{fontSize:"20px",fontWeight:"bolder"}}
          textStyle={{paddingRight:"0px"}}
          title={weatherdates[i]}
          actAsExpander={true}
          showExpandableButton={true}
          />
          <CardText expandable={true}>
              <div className = 'row center-xs' style={styles.percentange_box}>
                <div className = 'col-xs-4'>
                  <span style={{"color":"rgb(0, 189, 0)","fontSize":"20px"}}>{free_percent}</span>
                  <br></br>
                  <span style={{"color":"rgb(0, 189, 0)","fontSize":"14px"}}>{free_count}</span>

                </div>
                <div className = 'col-xs-4'>
                  <span style={{"color":"rgb(226, 159, 18)","fontSize":"20px"}}>{maybe_percent}</span>
                  <br></br>
                  <span style={{"color":"rgb(226, 159, 18)","fontSize":"14px"}}>{maybe_count}</span>

                </div>
                <div className = 'col-xs-4'>
                  <span style={{"color":"rgb(216, 51, 38)","fontSize":"20px"}}>{busy_percent}</span>
                  <br></br>
                  <span style={{"color":"rgb(216, 51, 38)","fontSize":"14px"}}>{busy_count}</span>

                </div>
              </div>
            <br></br>
            <div className = 'row'><div style={styles.chipwrapper}>{this.MobileAttendeeChips("free",freelist)}{this.MobileAttendeeChips("maybe",maybelist)}{this.MobileAttendeeChips("busy",busylist)}</div></div>
          </CardText>
          <MediaQuery minDeviceWidth={339}>
            <div className ="row">
              <div className="col-xs-12">
        <CardActions>
             {this.renderLightSaberGraph(free_percent,maybe_percent,busy_percent)}
                <br></br>
                {this.MobileToggleButtons(date,cookie_available)}
        </CardActions>
        </div>
      </div>
      </MediaQuery>
      <MediaQuery maxDeviceWidth={339}>
        <CardText style={{"paddingBottom":"20px"}}>
             {this.renderLightSaberGraph(free_percent,maybe_percent,busy_percent)}
                <br></br>
                {this.MobileToggleButtons(date,cookie_available)}
        </CardText>
      </MediaQuery>
    </Card>
    <br></br>
    </div>
    </div>

      );
    });
  }

  // utility function to get information of stored cookie name
  getCookieAttendeeDetails() {
   let cookieAttendee = cookie.load(encodeURI(this.props.params.eventId));
   for (let i = 0; i < this.props.eventObj.attendees.length; i++) {
    if (cookieAttendee === this.props.eventObj.attendees[i].attendeeName) {
        return this.props.eventObj.attendees[i];
    }
   }
  }

  // helper to render dates according to status and date.
  individualDateSection(date, status) {
    return (
      <div className='col-xs-5'>
        <RadioButtonGroup name='shipSpeed' className='row' onChange={this.handleDateToogle.bind(this, date)} defaultSelected={status}>

            <RadioButton className='col-xs-4' style={{}} value='free' label='Free' checkedIcon={< FontIcon className = 'material-icons' color = {
                green500
            } style={styles.selected_circle} > panorama_fish_eye < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' > panorama_fish_eye < /FontIcon>}/>

            <RadioButton className='col-xs-4' style={{}} value='maybe' label='Maybe' checkedIcon={< FontIcon className = 'material-icons' color = {
                yellow800
            } style={styles.selected_triangle} > change_history < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' > change_history < /FontIcon>}/>

            <RadioButton className='col-xs-4' style={{}} value='busy' label='Busy' checkedIcon={< FontIcon className = 'material-icons' color = {
                red500
            } style={styles.selected_cross} > clear < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' > clear < /FontIcon>}/>

        </RadioButtonGroup>
      </div>
    );
  }

  // render date section based on cookie availability
  dateToggleSection(cookieAvailable) {
    if (cookieAvailable !== true) {
    // initially all dates should be under busy
    let selectedDates = this.props.eventObj.dateArray;
    let datesInColumn = this.renderWithOrWithoutWeather();
    let dateToggleElements = [];
    for (let i = 0; i < datesInColumn.length; i++) {
        dateToggleElements[i] = (
          <div><div className='row'>
                <div className='col-xs-offset-2 col-xs-3'>
                    <label style={styles.dateLabel}>
                        {datesInColumn[i]}
                    </label>
                </div>
                {this.individualDateSection(selectedDates[i], 'busy')}
            </div><br></br></div>
        );
    }
    return dateToggleElements;
  } else if (cookieAvailable && (this.getCookieAttendeeDetails())) {
    // render dates based of cookie user selection.
    let dateToggleElements = [];
    let attendeeDetails = this.getCookieAttendeeDetails();
    let datesInColumn = this.renderWithOrWithoutWeather();
    let selectedDates = this.props.eventObj.dateArray;

    for (let i = 0; i < selectedDates.length; i++) {
        for (let attendeeDate in attendeeDetails.personalizedDateSelection) {
            if (attendeeDetails.personalizedDateSelection.hasOwnProperty(attendeeDate)) {
                if (attendeeDate === selectedDates[i]) {
                    dateToggleElements[i] = (
                        <div><div className='row'>

                            <div className='col-xs-offset-2 col-xs-3'>
                                <label style={styles.dateLabel}>
                                    {datesInColumn[i]}
                                </label>
                            </div>
                            {this.individualDateSection(selectedDates[i], attendeeDetails.personalizedDateSelection[attendeeDate])}
                        </div><br></br></div>
                    );
                }
            }
        }
    }
    return dateToggleElements;
  } else {
    return (
      <div>
      </div>
    );
  }
  }

  toggleDesktopCastAttendance() {
      if (document.cookie.indexOf(encodeURI(this.props.params.eventId)) == -1) { //Cookie not found? display virgin page
          return (
              <div>
                <div className='row'>
                  <div className="col-md-offset-1 col-md-6 start-md">

                    <TextField id='name'
                    floatingLabelText={this.props.languageJson.attendeeName}
                    floatingLabelStyle={{"fontSize":"50px", "color": "#949494"}}
                    style={{"fontSize":"50px","width":"350px"}}
                    floatingLabelShrinkStyle={{"fontSize":"20px", "color":"black","top":"25px"}}
                    floatingLabelFocusStyle={{color: grey900}}
                    underlineStyle={styles.underlineStyleforDesktop}
                    underlineFocusStyle={styles.underlineFocussedStyleforDesktop}
                    onChange={this.storeAttendeeName}
                    value={this.props.attendeeName} />
                    <br />

                    <div style={styles.DesktoperrorLabel}> {this.props.attendeeNameErrorLabel} </div>

                  </div>
                <div className="col-md-4">
                    <div style={styles.formLabel3}> {this.props.languageJson.numberOfPeopleLabel + " " + this.props.eventObj.attendees.length} </div>
                </div>

                </div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                  <div>{this.DesktopdateToggleSection(false)}</div>
                  <br/>
                    <div className='row center-xs'>
                      <RaisedButton label='Register' backgroundColor={"rgb(33, 33, 33)"} labelColor={"white"} labelStyle={{"fontSize":"30px","paddingLeft":"40px","paddingRight":"40px"}} buttonStyle={{"height":"56px"}} disabled={this.checkDisableFlag()} onTouchTap={this.registerAttendee} />
                        <Snackbar
                           open={this.checkNotificationFlag()}
                           message={this.getNotificationTitle()}
                           autoHideDuration={3000}
                           onRequestClose={this.handleRequestClose}
                        />
                    </div>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
              </div>

          );
      } else { // Cookie found? fill page with cookie data

          return (
              <div>
                <div className='row'>
                  <div className="col-md-offset-1 col-md-6 start-md">

                    <TextField id='name'
                    floatingLabelText={this.props.languageJson.attendeeName}
                    floatingLabelStyle={{"fontSize":"50px", "color": "red"}}
                    style={{"fontSize":"50px","width":"350px"}}
                    floatingLabelShrinkStyle={{"fontSize":"20px", "color":"black","top":"25px"}}
                    floatingLabelFocusStyle={{color: grey900}}
                    underlineStyle={styles.underlineStyleforDesktop}
                    underlineFocusStyle={styles.underlineFocussedStyleforDesktop}
                    onChange={this.storeAttendeeName}
                    value={this.props.attendeeName} />
                    <br />

                    <div style={styles.DesktoperrorLabel}> {this.props.attendeeNameErrorLabel} </div>

                  </div>
                <div className="col-md-4">
                    <div style={styles.formLabel3}> {this.props.languageJson.numberOfPeopleLabel + " " + this.props.eventObj.attendees.length} </div>
                </div>

                </div>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div>{this.DesktopdateToggleSection(true)}</div>
                <br/>
                  <div className='row center-xs'>
                    <RaisedButton label={this.props.languageJson.update} backgroundColor={"rgb(33, 33, 33)"} labelColor={"white"} labelStyle={{"fontSize":"30px","paddingLeft":"40px","paddingRight":"40px"}} buttonStyle={{"height":"56px"}} disabled={this.checkDisableUpdateFlag()} onTouchTap={this.updateAttendee} />
                      <Snackbar
                         open={this.checkNotificationFlag()}
                         message={this.getNotificationTitle()}
                         autoHideDuration={3000}
                         onRequestClose={this.handleRequestClose}
                      />
                  </div>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
              </div>
          );
      }
  }

  toggleMobileCastAttendance() {
      if (document.cookie.indexOf(encodeURI(this.props.params.eventId)) == -1) { //Cookie not found? display virgin page
          return (
              <div>
                <div className='row center-xs'>
                  <div className='col-xs-10'>
                    <TextField id='name' floatingLabelText={this.props.languageJson.attendeeName} floatingLabelStyle={{"fontSize":"30px"}} style={{"fontSize":"20px"}} floatingLabelShrinkStyle={{"fontSize":"15px"}} floatingLabelFocusStyle={{
                        color: grey900
                    }} underlineFocusStyle={styles.underlineStyle} onChange={this.storeAttendeeName} value={this.props.attendeeName} />
                    <br />
                    <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
                  </div>
                </div>
                <br></br>
                <br></br>
                  <div>{this.MobiledateToggleSection(false)}</div>
                    <div className='row center-xs'>
                      <RaisedButton label='Register' backgroundColor={"rgb(33, 33, 33)"} labelColor={"white"} style={buttonStyle} disabled={this.checkDisableFlag()} onTouchTap={this.registerAttendee} />
                        <Snackbar
                           open={this.checkNotificationFlag()}
                           message={this.getNotificationTitle()}
                           autoHideDuration={3000}
                           onRequestClose={this.handleRequestClose}
                        />
                    </div>
              </div>

          );
      } else { // Cookie found? fill page with cookie data

          return (
              <div>
                <div className='row center-xs'>
                  <div className='col-xs-10'>
                    <TextField id='name' floatingLabelText={this.props.languageJson.attendeeName} floatingLabelStyle={{"fontSize":"30px"}} style={{"fontSize":"20px"}} floatingLabelShrinkStyle={{"fontSize":"15px"}} floatingLabelFocusStyle={{color: grey900}} underlineFocusStyle={styles.underlineStyle} onChange={this.storeAttendeeName} value={this.props.attendeeName} />
                    <br />
                    <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
                  </div>
                </div>
                <br></br>
                <br></br>
                <div>{this.MobiledateToggleSection(true)}</div>
                  <div className='row center-xs'>
                    <RaisedButton label='Update' backgroundColor={"rgb(33, 33, 33)"} labelColor={"white"} style={buttonStyle} disabled={this.checkDisableUpdateFlag()} onTouchTap={this.updateAttendee} />
                      <Snackbar
                         open={this.checkNotificationFlag()}
                         message={this.getNotificationTitle()}
                         autoHideDuration={3000}
                         onRequestClose={this.handleRequestClose}
                      />
                  </div>
              </div>
          );
      }
  }

  // To check whether the flag exists for Modal - Desktop
  checkDesktopNotificationFlag() {
    if (this.props.notificationFlag === 'registerSuccess' || this.props.notificationFlag === 'updateSuccess' || this.props.notificationFlag === 'registerAttendeeServerError' || this.props.notificationFlag === 'updateAttendeeServerError') {
      return true;
    } else {
      return false;
    }
  }

  // To check whether the flag exists for snack bar - Mobile
  checkNotificationFlag() {
    if (this.props.notificationFlag === 'registerSuccess' || this.props.notificationFlag === 'updateSuccess' || this.props.notificationFlag === 'attendeeNameEmpty' || this.props.notificationFlag === 'attendeeNameExists' || this.props.notificationFlag === 'registerAttendeeServerError' || this.props.notificationFlag === 'updateAttendeeServerError') {
      return true;
    } else {
      return false;
    }
  }

  getNotificationTitle(){
    if (this.props.notificationFlag === 'registerSuccess') {
      return "Registered Successfully";
    } else if(this.props.notificationFlag === 'updateSuccess'){
      return "Updated Successfully";
    } else if(this.props.notificationFlag === 'attendeeNameExists'){
      return "Attendee name already Exists!!";
    } else if(this.props.notificationFlag === 'attendeeNameEmpty'){
      return "Please enter your name!!";
    } else if(this.props.notificationFlag === 'registerAttendeeServerError'){
      return "Server Error!! Please try again after some time!!";
    } else if(this.props.notificationFlag === 'updateAttendeeServerError'){
      return "Server Error!! Please try again after some time!!";
    } else {
      return false;
    }
  }

// Handles snackbar, In case of timeout oand screen touch
  handleRequestClose() {
      this.props.dispatch(updateNotificationFlag(''));
      this.props.dispatch(storeDisableFlag(''));
    }

  fetchWeather(location) {
    this.props.dispatch(fetchWeather(location));
  }

// Fill the details about the event.
  getEventInformation() {
    let eventInformation = this.props.eventObj.purpose +" by "+ this.props.eventObj.name  ;
    return eventInformation;
  }

  getGoogleMapsURL() {
    let x = "http://maps.google.com/?q=" + this.props.eventObj.location.lat + "," + this.props.eventObj.location.long;
    return x;
  }

  renderLocation() {
    if ((this.props.eventObj.location.locationName !== null)) {
      return (
            <a target="_blank" href={this.getGoogleMapsURL()} style={{'textDecoration':'none'}}>
              <label style={styles.LocationLabel}> <FontIcon className='material-icons'  style={{'fontSize':'13px','color':'#000'}}>location_on</FontIcon> <span style={{'fontSize':'13px'}}>{this.props.eventObj.location.locationName} </span></label>
            </a>
      );
    }
  }

  renderLocationforDesktop() {
    if ((this.props.eventObj.location.locationName !== null)) {
      return (
            <a target="_blank" href={this.getGoogleMapsURL()} style={{'textDecoration':'none'}}>
              <label style={styles.LocationLabel}> <FontIcon className='material-icons'  style={{'fontSize':'16px','color':'#000'}}>location_on</FontIcon> <span style={{'fontSize':'16px'}}>{this.props.eventObj.location.locationName} </span></label>
            </a>
      );
    }
  }

  renderShareCardforDesktop() {
    let eventId = this.props.params.eventId;
    let eventShareURL = window.location.origin + '/event/' + encodeURI(eventId);
      return (
        <div>
              <Card style ={{"padding": "5px", "borderRadius": "18px"}}>
                <div className="row" style={{"paddingLeft":"1rem","paddingTop":"10px", "fontSize":"24px"}}>

                 Copy link to share
                </div>
                <div className="row">
                <div className="col-xs-10" style={{"paddingRight":"0px"}}>
                  <TextField
                  id='shareUrl'
                  underlineShow={false}
                  value={eventShareURL}
                  fullWidth={true}
                  inputStyle={{"backgroundColor":"rgb(234, 234, 234)","marginTop":"10px","height":"55%"}}
                /></div>
              <div className="col-xs-2" style={{"paddingLeft":"0px"}}>
                <CopyToClipboard text={eventShareURL}>

                  <IconButton tooltip="Copy URL" iconStyle={{"color":"#000"}} style={{"width":"20px","height":"20px","padding": "initial","paddingTop": "11px","paddingLeft": "10px"}}>
                    <FontIcon className="material-icons">content_copy</FontIcon>
                  </IconButton>
                </CopyToClipboard>

              </div>

                </div>
              </Card>
        </div>
      );
  }

  renderShareCard() {
    let eventId = this.props.params.eventId;
    let eventShareURL = window.location.origin + '/event/' + encodeURI(eventId);
      return (
        <div>
          <div className='row center-xs'>
            <span className='col-lg-4 col-md-4 col-sm-8 col-xs-10' >
              <Card>
                <div className="row" style={{"paddingLeft":"1rem","paddingTop":"10px"}}>

                 Copy link to share
                </div>
                <div className="row">
                <div className="col-xs-10" style={{"paddingRight":"0px"}}>
                  <TextField
                  id='shareUrl'
                  underlineShow={false}
                  value={eventShareURL}
                  fullWidth={true}
                  inputStyle={{"backgroundColor":"rgb(234, 234, 234)","marginTop":"10px","height":"55%"}}
                /></div>
              <div className="col-xs-2" style={{"paddingLeft":"0px"}}>
                <CopyToClipboard text={eventShareURL}>

                  <IconButton tooltip="Copy URL" iconStyle={{"color":"#000"}} style={{"width":"20px","height":"20px","padding": "initial","paddingTop": "11px","paddingLeft": "5px"}}>
                    <FontIcon className="material-icons">content_copy</FontIcon>
                  </IconButton>
                </CopyToClipboard>

              </div>

                </div>
              </Card>
          </span>
          </div>
        </div>
      );
  }

// Render the whole EventPage App. Starting point of this component.
  render() {

    let result;

    if (Object.keys(this.props.eventObj).length === 0 && this.props.eventObj.constructor === Object) { //Before fetching from DB
      result = (
        <div>
        </div>
      );
    } else {
      if ((this.props.weather.length === 0) && (this.props.eventObj.location.locationName !== null)) {
        this.fetchWeather(this.props.eventObj.location.locationName);
      }
      let dateArray = this.props.eventObj.dateArray;
      let tableheight= (35 * (dateArray.length + 2)); // Responsive height of the table based no. of dates
      result = (

        <div>

            {/**PC and Desktop code starts */}
          <div className="visible-md visible-lg hidden-xs hidden-sm">
          <br/>
          <br/>
              <div className='row'>
                <div className="col-md-offset-1 col-md-7 start-md">
                    <label style={styles.EventName}> {this.props.eventObj.purpose} </label>
                    <br/>
                    <div style={styles.EventOrganizerName}>  {"By " + this.props.eventObj.name} </div>
                    <div style={{"marginTop":"7px"}}>
                    {this.renderLocationforDesktop()}
                    </div>
                </div>
                <div className="col-md-3" style={{"marginTop":"30px"}}>
                  {this.renderShareCardforDesktop()}
                </div>
              </div>
              <div className='row center-xs'>
              <Dialog
                title={this.getNotificationTitle()}
                actions={
                  <RaisedButton label='Ok'
                   backgroundColor={"rgb(33, 33, 33)"}
                   labelColor={"white"}
                   style={buttonStyle}
                   disabled={false}
                   onTouchTap={this.handleRequestClose}
                  />
                }
                modal={true}
                open={this.checkDesktopNotificationFlag()}
              >
              </Dialog>

              </div>
              <br />
              <br />
              <br />
              {this.toggleDesktopCastAttendance()}

          </div>
          {/**PC and Desktop code ends */}

          {/*##########################*/}

          {/**Mobile & Tablet code starts*/}

          <div  className="visible-xs visible-sm hidden-md hidden-lg">

            <br></br>
              <div className='row center-xs'>
                <label style={styles.formLabel}> {this.props.eventObj.purpose} </label>
              </div>
              <div className='row center-xs'>
              <label style={styles.organizerNameLabel}>{"by "+this.props.eventObj.name}</label>
              </div>
              <div>
                <div className='row center-xs'>
                    <span className='col-xs-8' style={{'cursor':'pointer'}}>
                        {this.renderLocation()}
                    </span>
                </div>
              </div>

              <br></br>
              {this.renderShareCard()}
              <div>

                {this.toggleMobileCastAttendance()}
                <br></br>
                <br></br>

              </div>

        </div>
        {/**Mobile & Tablet code ends*/}

        </div>
      );
    }
    return result;
  }
}

EventPageComponent.propTypes = {
  eventObj: PropTypes.object.isRequired,
  attendeeName: PropTypes.string.isRequired,
  attendeeNameErrorLabel: PropTypes.string.isRequired,
  personalizedDateSelection: PropTypes.object.isRequired,
  languageJson: PropTypes.object.isRequired,
  weather: PropTypes.array.isRequired,
  notificationFlag: PropTypes.string.isRequired,
  disableFlag: PropTypes.string.isRequired
};

export default connect(state => ({
  eventObj: state.eventObj,
  attendeeName: state.attendeeName,
  attendeeNameErrorLabel: state.attendeeNameErrorLabel,
  personalizedDateSelection: state.personalizedDateSelection,
  languageJson: state.languageJson,
  weather: state.weather,
  notificationFlag: state.notificationFlag,
  disableFlag: state.disableFlag
}))(EventPageComponent);
