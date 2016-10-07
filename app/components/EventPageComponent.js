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
import ResponsiveFixedDataTable from 'responsive-fixed-data-table';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import { fetchEvent, storePersonalizedDateSelection, storeAttendeeName, storeAttendeeNameErrorLabel,
         registerAttendee, attendeeNameEmptyFlag, attendeeNameExistsFlag,
         registerSuccessFlag, updateSuccessFlag, emptyPersonalizedDateSelection,
         updateAttendee, fetchWeather } from './../actions/registerActions';

let dateStatus;

let styles = {
  m_label: {
    text: 'bold',
    fontSize: '10px',
    color: 'rgb(173, 173, 173)',
    position: 'absolute',
    marginTop: '20px'
  },
  tab_label: {
   marginLeft: "-15px"
  },
  m_style: {

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
    color: grey600
  },
  underlineStyle: {
    borderColor: grey900,
  },
  formLabel2: {
    text: 'bold',
    fontSize: '25px',
    color: blue500
  },
  formLabel3: {
    text: 'bold',
    fontSize: '21.5px',
    color: grey600
  },
  dateLabel: {
    text: 'bold',
    fontSize: '25px',
    color: grey600
  },
  errorLabel: {
    fontSize: '15px',
    color: 'rgba(244, 67, 54, 0.79)'
  },
  paperStyle: {
    width: '50%'
  },
  icon: {
    marginRight: 24
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
 }
};

let buttonStyle = {
  margin : 12
};


class EventPageComponent extends Component {

// The methods in the constructor are given to bind the function to redux's state object.
  constructor(props) {
    super(props);
    this.CountStatus = this.CountStatus.bind(this);
    this.handleDateToogle = this.handleDateToogle.bind(this);
    this.handleRequestClose_NameEmpty = this.handleRequestClose_NameEmpty.bind(this);
    this.handleRequestClose_NameExists = this.handleRequestClose_NameExists.bind(this);
    this.handleRequestClose_RegisterSuccess = this.handleRequestClose_RegisterSuccess.bind(this);
    this.handleRequestClose_UpdateSuccess = this.handleRequestClose_UpdateSuccess.bind(this);
    this.storeAttendeeName = this.storeAttendeeName.bind(this);
    this.registerAttendee = this.registerAttendee.bind(this);
    this.toggleMobileCastAttendance = this.toggleMobileCastAttendance.bind(this);
    this.updateAttendee = this.updateAttendee.bind(this);
  }

// The below method gets executed after all the components have been successfully rendered on the screen.
  componentDidMount() {
    this.props.dispatch(fetchEvent(this.props.params.eventId));
    if (document.cookie.indexOf(this.props.params.eventId) > -1) //If cookie got current event ID.. Directly add his name as update attendee name
    {
    this.props.dispatch(storeAttendeeName(cookie.load(this.props.params.eventId)));//later we need to add the latest name
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
    this.props.dispatch(updateAttendee(attendee._id, this.props.attendeeName, this.props.personalizedDateSelection, this.props.params.eventId));
    cookie.save(this.props.params.eventId, this.props.attendeeName); // Save name in cookie event ID
    this.props.dispatch(storeAttendeeName(this.props.attendeeName));
    this.props.dispatch(updateSuccessFlag(true));
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
    if (this.props.attendeeName.length === 0) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabel));
      this.props.dispatch(attendeeNameEmptyFlag(true)); //If name is empty, bring snackbar
    } else if (this.duplicateCheck()) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabelDuplicate));
      this.props.dispatch(attendeeNameExistsFlag(true)); //If name is duplicate entry, bring snackbar
    } else {
      // populating personalizedDateSelection if user has not chosen any status.
      this.fillTheLeftOutDatesUpdateAttendee();
      // A timeout has been used, because There will be a little time taken for storing the default values
      // to the left-out dates. So, having a delay will give a consistency in the application.
      setTimeout((function() {
       this.callAfterSomeTimeUpdateAttendee();
     }).bind(this), 1000);
    }
  }

  duplicateCheck() {
    let attendees = this.props.eventObj.attendees;
    if (document.cookie.indexOf(this.props.params.eventId) == -1) {
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
        if (this.props.attendeeName.toUpperCase() === attendees[j].attendeeName.toUpperCase() && (attendeeDetails._id !== attendees[j]._id) ) {
          return true;
        }
      }
      return false;

  }
}

// This cast by attendess will be invoked after an secod for providing delay.
  callAfterSomeTimeRegisterAttendee() {
    this.props.dispatch(registerAttendee(this.props.attendeeName, this.props.personalizedDateSelection, this.props.eventObj._id)); // Update in DB
    cookie.save(this.props.params.eventId, this.props.attendeeName); // Save name in cookie event ID
    this.props.dispatch(registerSuccessFlag(true)); //If name is empty, bring snackbar
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
      this.props.dispatch(attendeeNameEmptyFlag(true)); //If name is empty, bring snackbar
    } else if (this.duplicateCheck()) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabelDuplicate));
      this.props.dispatch(attendeeNameExistsFlag(true)); //If name is duplicate entry, bring snackbar
    } else {
      // populating personalizedDateSelection if user has not chosen any status.
      this.fillTheLeftOutDatesRegisterAttendee();

      // A timeout has been used, because There will be a little time taken for storing the default values
      // to the left-out dates. So, having a delay will give a consistency in the application.
      setTimeout((function() {
       this.callAfterSomeTimeRegisterAttendee();
     }).bind(this), 1000);
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
      "47" : "wi wi-storm-showers",
      "3200" : "wi wi-na"
    };
    if (this.props.weather.length === 0) {
    // when weather information from yahoo is not available. render dates alone.
    datesInColumn = this.props.eventObj.dateArray;
    console.log("no weather");
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
                console.log(weathercode);
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
        header={<Cell>May be</Cell>}
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
            return (
                <Chip backgroundColor={green200} style={styles.chip}><Avatar backgroundColor={green500} icon={< FontIcon className = "material-icons" > panorama_fish_eye < /FontIcon>}/>{name}</Chip>
            );
        });
        break;
    case "maybe":
        return list.map((name, k) => {
            return (
                <Chip backgroundColor={yellow200} style={styles.chip}><Avatar backgroundColor={yellow800} icon={< FontIcon className = "material-icons" > change_history < /FontIcon>}/>{name}</Chip>
            );
        });
        break;
    case "busy":
        return list.map((name, k) => {
            return (
                <Chip backgroundColor={red200} style={styles.chip}><Avatar backgroundColor={red500} icon={< FontIcon className = "material-icons" > clear < /FontIcon>}/>{name}</Chip>
            );
        });
        break;
   }

  }

// Generate mobile toggle buttons
  MobileToggleButtons(date,cookie_available){
    if(!cookie_available)
    {
   return ( //Cookie unavailable (ALL BUSY)
    <div>
      <MediaQuery minDeviceWidth={339}>
          {/** Tablets and phablets: display label for radio buttons*/}
          <RadioButtonGroup name='shipSpeed' className='row' onChange={this.handleDateToogle.bind(this, date)} defaultSelected={'busy'}>

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

      <MediaQuery maxDeviceWidth={339}>
          {/** Small screen Smartphones */}
          <RadioButtonGroup name='shipSpeed' className='row' onChange={this.handleDateToogle.bind(this, date)} defaultSelected={'busy'}>

              <RadioButton className='col-xs-offset-1 col-xs-3' value='free' label='Free' style={styles.m_style} iconStyle={styles.m_icon} labelStyle={styles.m_label} checkedIcon={< FontIcon className = 'material-icons' color = {
                  green500
              } style={styles.selected_circle}
               > panorama_fish_eye < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' > panorama_fish_eye < /FontIcon>}/>

             <RadioButton className='col-xs-3' value='maybe' label='Maybe' style={styles.m_style} iconStyle={styles.m_icon} labelStyle={styles.m_label} checkedIcon={< FontIcon className = 'material-icons' color = {
                  yellow800
              } style={styles.selected_triangle} > change_history < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons'> change_history < /FontIcon>}/>

            <RadioButton className='col-xs-3' value='busy' label="Busy" style={styles.m_style} iconStyle={styles.m_icon} labelStyle={styles.m_label} checkedIcon={< FontIcon className = 'material-icons' color = {
                  red500
              } style={styles.selected_cross} > clear < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons'> clear < /FontIcon>}/>

          </RadioButtonGroup>
      </MediaQuery>
    </div>);
    }
    else {
      let attendeeDetails = this.getCookieAttendeeDetails();
      let status='busy'
      for (let attendeeDate in attendeeDetails.personalizedDateSelection) {
          if (attendeeDetails.personalizedDateSelection.hasOwnProperty(attendeeDate)) {
              if (attendeeDate === date) {
                status = attendeeDetails.personalizedDateSelection[attendeeDate];
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

            <MediaQuery maxDeviceWidth={339}>
                {/** Small screen Smartphones */}
                <RadioButtonGroup name='shipSpeed' className='row' onChange={this.handleDateToogle.bind(this, date)} defaultSelected={status}>

                    <RadioButton className='col-xs-offset-1 col-xs-3' value='free' label='Free' style={styles.m_style} iconStyle={styles.m_icon} labelStyle={styles.m_label} checkedIcon={< FontIcon className = 'material-icons' color = {
                        green500
                    } style={styles.selected_circle}
                     > panorama_fish_eye < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' > panorama_fish_eye < /FontIcon>}/>

                   <RadioButton className='col-xs-3' value='maybe' label='Maybe' style={styles.m_style} iconStyle={styles.m_icon} labelStyle={styles.m_label} checkedIcon={< FontIcon className = 'material-icons' color = {
                        yellow800
                    } style={styles.selected_triangle} > change_history < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons'> change_history < /FontIcon>}/>

                  <RadioButton className='col-xs-3' value='busy' label="Busy" style={styles.m_style} iconStyle={styles.m_icon} labelStyle={styles.m_label} checkedIcon={< FontIcon className = 'material-icons' color = {
                        red500
                    } style={styles.selected_cross} > clear < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons'> clear < /FontIcon>}/>

                </RadioButtonGroup>
            </MediaQuery>
        </div>
      );
    }
  }

// Generate Date toggle based on cookie
  MobiledateToggleSection(cookie_available) {
    let dateArray = this.props.eventObj.dateArray; //  Get date list
    let attendees = this.props.eventObj.attendees; //  Get attendees list

    return dateArray.map((date, i) =>{ // for each date create a card
    let freelist = [], maybelist = [], busylist = [];
      attendees.map((attendee, j) => { // for each attendee check status for the given date
        for (let key in attendee.personalizedDateSelection) {
          if (attendee.personalizedDateSelection.hasOwnProperty(key)) {
            if (date === key) {

              if (attendee.personalizedDateSelection[key] === 'free') {
              freelist.push(attendee.attendeeName); // If attendee is free, push in freelist array
              }
              if (attendee.personalizedDateSelection[key] === 'maybe') {
              maybelist.push(attendee.attendeeName);
              }
              if (attendee.personalizedDateSelection[key] === 'busy') {
              busylist.push(attendee.attendeeName);
              }
            }
          }
        }
      });

      let weatherdates = this.renderWithOrWithoutWeather();

      return (


    <div className = 'row'>
    <div className='col-sm-offset-2 col-sm-8 col-xs-12'>
    <Card expandable={true}>
      <CardHeader
          style={{textAlign:"center",paddingLeft:"90px"}}
          title={weatherdates[i]}
          actAsExpander={true}
          showExpandableButton={true}
          />
          <CardText expandable={true}>
            <div style={styles.chipwrapper}>{this.MobileAttendeeChips("free",freelist)}{this.MobileAttendeeChips("maybe",maybelist)}{this.MobileAttendeeChips("busy",busylist)}</div>
          </CardText>
        <CardActions>
            <div className='row '>
              <br></br>
              <br></br>
                <div className='col-xs-12'>

                {this.MobileToggleButtons(date,cookie_available)}

                </div>
            </div>
        </CardActions>
    </Card>
    <br></br>
    </div>
    </div>

      );
    });
  }

  // utility function to get information of stored cookie name
  getCookieAttendeeDetails() {
   let cookieAttendee = cookie.load(this.props.params.eventId);
   for (let i = 0; i < this.props.eventObj.attendees.length; i++) {
    if (cookieAttendee === this.props.eventObj.attendees[i].attendeeName) {
        return this.props.eventObj.attendees[i];
    }
   }
  }

  // helper to render dates according to status and date.
  individualDateSection(date, status) {
    return (
      <div className='col-xs'>
        <RadioButtonGroup name='shipSpeed' className='row' onChange={this.handleDateToogle.bind(this, date)} defaultSelected={status}>

            <RadioButton className='col-xs-4' style={{}} value='free' label='Free' checkedIcon={< FontIcon className = 'material-icons' color = {
                green500
            }
            style = {
                styles.icon
            } > panorama_fish_eye < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' style = {
                styles.icon
            } > panorama_fish_eye < /FontIcon>}/>

            <RadioButton className='col-xs-4' style={{}} value='maybe' label='Maybe' checkedIcon={< FontIcon className = 'material-icons' color = {
                yellow800
            }
            style = {
                styles.icon
            } > change_history < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' style = {
                styles.icon
            } > change_history < /FontIcon>}/>

            <RadioButton className='col-xs-4' style={{}} value='busy' label='Busy' checkedIcon={< FontIcon className = 'material-icons' color = {
                red500
            }
            style = {
                styles.icon
            } > clear < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' style = {
                styles.icon
            } > clear < /FontIcon>}/>

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
            <div className='row'>
                <div className='col-xs-3'></div>
                <div className='col-xs-offset-1 col-xs-2'>
                    <label style={styles.dateLabel}>
                        {datesInColumn[i]}
                    </label>
                </div>
                {this.individualDateSection(selectedDates[i], 'busy')}
            </div>
        );
    }
    return dateToggleElements;
    } else {
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
                        <div className='row'>
                            <div className='col-xs-3'></div>
                            <div className='col-xs-offset-1 col-xs-2'>
                                <label style={styles.dateLabel}>
                                    {datesInColumn[i]}
                                </label>
                            </div>
                            {this.individualDateSection(selectedDates[i], attendeeDetails.personalizedDateSelection[attendeeDate])}
                        </div>
                    );
                }
            }
        }
    }
    return dateToggleElements;
   }
  }

  attendeeSubmissionSection() {
    if (document.cookie.indexOf(this.props.params.eventId) == -1) {
      // cookie not there, render empty name field and default busy states to dates.
      return (
        <div>
          <div className='row center-xs'>
            <label style={styles.formLabel}> {this.props.languageJson.dateSelectionLabel} </label>
          </div>
          <br />
          <div className='row'>
            <div className='col-xs-offset-5 col-xs-1'>
              <label style={styles.formLabel}> {this.props.languageJson.name} </label>
            </div>
            <div className='col-xs'>
              <TextField id='name' hintText='Name' onChange={this.storeAttendeeName} floatingLabelFocusStyle={{color : grey900}} underlineFocusStyle={styles.underlineStyle} value={this.props.attendeeName} />{/** First time event page visitor - Name Input box */}
              <br />
              <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
            </div>
          </div>
          <br />
          {this.dateToggleSection(false)}
          <br />
          <div className='row center-xs'>
            <RaisedButton label='Register' labelColor={grey50} style={buttonStyle} backgroundColor={grey900} disabled={false} onTouchTap={this.registerAttendee} />
          </div>
        </div>
      );
    } else {
      // cookie found, render name and selected dates.
      return (
        <div>
          <div className='row center-xs'>
            <label style={styles.formLabel}> {this.props.languageJson.dateSelectionLabel} </label>
          </div>
          <br />
          <div className='row'>
            <div className='col-xs-offset-5 col-xs-1'>
              <label style={styles.formLabel}> {this.props.languageJson.name} </label>
            </div>
            <div className='col-xs'>
              <TextField id='name' hintText='Name' onChange={this.storeAttendeeName} value={this.props.attendeeName} />{/** First time event page visitor - Name Input box */}
              <br />
              <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
            </div>
          </div>
          <br />
          {this.dateToggleSection(true)}
          <br />
          <div className='row center-xs'>
            <RaisedButton label='Update' disabled={false} labelColor={grey50} style={buttonStyle} backgroundColor={grey900} onTouchTap={this.updateAttendee} />
          </div>
        </div>
      );
    }
  }

  toggleMobileCastAttendance() {
      if (document.cookie.indexOf(this.props.params.eventId) == -1) { //Cookie not found? display virgin page
          return (
              <div>
                <div className='row center-xs'>
                  <div className='col-xs-10'>
                    <TextField id='name' hintText='Name' onChange={this.storeAttendeeName} value={this.props.attendeeName} />
                    <br />
                    <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
                  </div>
                </div>
                <br></br>
                <br></br>
                  <div>{this.MobiledateToggleSection(false)}</div>
                    <br />
                    <div className='row center-xs'>
                      <RaisedButton label='Register' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.registerAttendee} />
                        <Snackbar
                           open={this.props.attendeeNameEmptyFlag}
                           message="Please enter your name"
                           autoHideDuration={3000}
                           onRequestClose={this.handleRequestClose_NameEmpty}
                        />
                        <Snackbar
                           open={this.props.attendeeNameExistsFlag}
                           message="Name already exists. Please enter another name"
                           autoHideDuration={3000}
                           onRequestClose={this.handleRequestClose_NameExists}
                        />
                    </div>
              </div>

          );
      } else { // Cookie found? fill page with cookie data

          return (
              <div>
                <div className='row center-xs'>
                  <div className='col-xs-10'>
                    <TextField id='name' hintText='Name' onChange={this.storeAttendeeName} value={this.props.attendeeName} />
                    <br />
                    <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
                  </div>
                </div>
                <br></br>
                <br></br>
                <div>{this.MobiledateToggleSection(true)}</div>
                  <br />
                  <div className='row center-xs'>
                    <RaisedButton label='Update' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.updateAttendee} />
                      <Snackbar
                         open={this.props.registerSuccessFlag}
                         message="Registered Successfully"
                         autoHideDuration={3000}
                         onRequestClose={this.handleRequestClose_RegisterSuccess}
                      />
                      <Snackbar
                         open={this.props.updateSuccessFlag}
                         message="Updated Successfully"
                         autoHideDuration={3000}
                         onRequestClose={this.handleRequestClose_UpdateSuccess}
                      />
                      <Snackbar
                         open={this.props.attendeeNameEmptyFlag}
                         message="Please enter your name"
                         autoHideDuration={3000}
                         onRequestClose={this.handleRequestClose_NameEmpty}
                      />
                      <Snackbar
                         open={this.props.attendeeNameExistsFlag}
                         message="Name already exists. Please enter another name"
                         autoHideDuration={3000}
                         onRequestClose={this.handleRequestClose_NameExists}
                      />
                  </div>
              </div>
          );
      }
  }

// Handles snackbar (register success)
  handleRequestClose_RegisterSuccess() {
      this.props.dispatch(registerSuccessFlag(false));
    }

// Handles snackbar (update success)
  handleRequestClose_UpdateSuccess() {
      this.props.dispatch(updateSuccessFlag(false));
    }

// Handles snackbar (empty name)
  handleRequestClose_NameEmpty() {
      this.props.dispatch(attendeeNameEmptyFlag(false));
    }

// Handles snackbar (name already exists)
  handleRequestClose_NameExists() {
      this.props.dispatch(attendeeNameExistsFlag(false));
    }

  fetchWeather(location) {
    this.props.dispatch(fetchWeather(location));
  }

// Fill the details about the event.
  getEventInformation() {
    let eventInformation = this.props.eventObj.name + this.props.languageJson.eventInformationPartOne + this.props.eventObj.purpose + this.props.languageJson.eventInformationPartTwo;
    return eventInformation;
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
      if ( (this.props.weather.length === 0) && (this.props.eventObj.location !== '')) {
        this.fetchWeather(this.props.eventObj.location);
      }
      let dateArray = this.props.eventObj.dateArray;
      let tableheight= (35 * (dateArray.length + 2)); // Responsive height of the table based no. of dates
      result = (

        <div>
          <div>

          <MediaQuery minDeviceWidth={1224} orientation='landscape'>
              {/*<div> PC and Desktop code starts </div>*/}

              <br />
              <div className='row center-xs'>
                <label style={styles.formLabel}> {this.getEventInformation()} </label>
              </div>
              <br />
              <div className='row center-xs'>
                <label style={styles.formLabel}> {this.props.languageJson.eventTableLabel} </label>
              </div>
              <br />
              <div className='row'>
                <div className='col-xs-offset-2 col-xs-4'>
                  <label style={styles.formLabel3}> {this.props.languageJson.numberOfPeopleLabel} </label>
                </div>
                <div className='col-xs'>
                  <label style={styles.formLabel2}> {this.props.eventObj.attendees.length} </label>
                </div>
              </div>
              <br />
              <div className='row center-xs'>
                <div className='col-sm-12 col-md-10 col-lg-10 col-xs-12'>
                <ResponsiveFixedDataTable
                  rowsCount={dateArray.length}
                  width={800}
                  rowHeight={35}
                  containerStyle={{minHeight:tableheight}}
                  headerHeight={50}
                >
                  {this.fillDatesInColumn()}
                  {this.fillFreeStatus()}
                  {this.fillMaybeStatus()}
                  {this.fillBusyStatus()}
                  {this.fillAttendeeDetails()}
                </ResponsiveFixedDataTable>
              </div>
              </div>
              <br />
              {this.attendeeSubmissionSection()}
              {/*<div> PC and Desktop code ends </div>*/}

          </MediaQuery>

          <MediaQuery maxDeviceWidth={1224} >

            {/*<div> Tablet & Smartphone code starts </div>*/}

            <br></br>
              <div className='row center-xs'>
                <label style={styles.formLabel}> {this.props.eventObj.purpose} </label>
              </div>

              <br></br>

              <div>

                {this.toggleMobileCastAttendance()}

              </div>
          {/*<div> Tablet & Smartphone code ends </div>*/}
          </MediaQuery>
        </div>
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
  attendeeNameEmptyFlag: PropTypes.bool.isRequired,
  attendeeNameExistsFlag: PropTypes.bool.isRequired,
  registerSuccessFlag: PropTypes.bool.isRequired,
  updateSuccessFlag: PropTypes.bool.isRequired,
  languageJson: PropTypes.object.isRequired,
  weather: PropTypes.array.isRequired
};

export default connect(state => ({
  eventObj: state.eventObj,
  attendeeName: state.attendeeName,
  attendeeNameErrorLabel: state.attendeeNameErrorLabel,
  personalizedDateSelection: state.personalizedDateSelection,
  attendeeNameEmptyFlag: state.attendeeNameEmptyFlag,
  attendeeNameExistsFlag: state.attendeeNameExistsFlag,
  registerSuccessFlag: state.registerSuccessFlag,
  updateSuccessFlag: state.updateSuccessFlag,
  languageJson: state.languageJson,
  weather: state.weather
}))(EventPageComponent);
