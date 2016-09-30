import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import { grey600, red500, blue500, green500, yellow800} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Table, Column, Cell} from 'fixed-data-table-2';
import MediaQuery from 'react-responsive';
import ResponsiveFixedDataTable from 'responsive-fixed-data-table';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

import { fetchEvent, storePersonalizedDateSelection, storeAttendeeName, storeAttendeeNameErrorLabel,
         updateEvent, toggleCastAttendance, emptyPersonalizedDateSelection, storeUpdateAttendeeId, storeUpdateAttendeeName,
         storeUpdateAttendeeDate, updateAttendee, fetchWeather } from './../actions/registerActions';

let dateStatus;

let styles = {
  formLabel: {
    text: 'bold',
    fontSize: '25px',
    color: grey600
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
    text: 'bold',
    fontSize: '22px',
    color: red500
  },
  paperStyle: {
    width: '50%'
  },
  icon: {
    marginRight: 24
  },
  icon2: {
    marginRight: 10
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
  }
};

let buttonStyle = {
  margin : 12
};


class EventPageComponent extends Component {

// The methods in the constructor are given to bind the function to redux's state object.
  constructor(props) {
    super(props);
    this.handleDateToogle = this.handleDateToogle.bind(this);
    this.storeAttendeeName = this.storeAttendeeName.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.toggleCastAttendance = this.toggleCastAttendance.bind(this);
    this.toggleCastAttendanceButton = this.toggleCastAttendanceButton.bind(this);
    this.updateAttendeeComponent = this.updateAttendeeComponent.bind(this);
    this.updateAttendee = this.updateAttendee.bind(this);
  }

// The below method gets executed after all the components have been successfully rendered on the screen.
  componentDidMount() {
    this.props.dispatch(fetchEvent(this.props.params.eventId));
  }

// Store the selected date to the state object.
// dispatch is the one that invokes the action creators.
  handleDateToogle(date, e) {
    this.props.dispatch(storePersonalizedDateSelection(date, e.target.value));
  }

  callAfterSomeTimeUpdateAttendee() {
    this.props.dispatch(updateAttendee(this.props.updateAttendeeId, this.props.attendeeName, this.props.personalizedDateSelection, this.props.params.eventId));
    cookie.save("name", this.props.attendeeName);
    this.props.dispatch(storeUpdateAttendeeName(''));
    this.props.dispatch(storeUpdateAttendeeId(''));
    this.toggleCastAttendanceButton();
    this.props.dispatch(storeAttendeeName(''));
  }

  fillTheLeftOutDatesAttendee() {
    let count = 0;
    for (let date in this.props.updateAttendeeDate) {
      if (this.props.updateAttendeeDate.hasOwnProperty(date)) {
        for (let key in this.props.personalizedDateSelection) {
          if (this.props.personalizedDateSelection.hasOwnProperty(key)) {
            if (date === key ) {
              count = 1;
            }
          }
        }
        if (count === 0) {
          this.props.dispatch(storePersonalizedDateSelection(date, this.props.updateAttendeeDate[date]));
        }
        count = 0;
      }
    }
  }

  updateAttendee() {
    if (this.props.attendeeName.length === 0) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabel));
    } else if (this.duplicateCheck()) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabelDuplicate));
    } else {

      // populating personalizedDateSelection if user has not chosen any status.
      this.fillTheLeftOutDatesAttendee();

      // A timeout has been used, because There will be a little time taken for storing the default values
      // to the left-out dates. So, having a delay will give a consistency in the application.
      setTimeout((function() {
       this.callAfterSomeTimeUpdateAttendee();
     }).bind(this), 1000);
    }
  }

  updateAttendeeComponent(id, name, date, e){
    this.props.dispatch(storeUpdateAttendeeName(name));
    this.props.dispatch(storeUpdateAttendeeId(id));
    this.props.dispatch(storeUpdateAttendeeDate(date));
    this.props.dispatch(storeAttendeeName(name));
    this.toggleCastAttendanceButton();
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

// This is an helper function to store the dates that have not been selected by the user.
// for instance, there are six dates, and the user selects the status(free, maybe, busy) for the four and
// leaves the remaining dates, then the below method will give default values to the unselected dates by the user.
  fillTheLeftOutDates() {
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

// This cast by attendess will be invoked after an secod for providing delay.
  callAfterSomeTimeUpdate() {
    cookie.save("name", this.props.attendeeName);
    this.props.dispatch(updateEvent(this.props.attendeeName, this.props.personalizedDateSelection, this.props.eventObj._id));
    this.props.dispatch(toggleCastAttendance(false));
    this.props.dispatch(emptyPersonalizedDateSelection());
  }

  duplicateCheck() {
    let count = 0;
    let i = 0;
    for (i = 0; i < this.props.eventObj.attendees.length; i++) {
      if (this.props.attendeeName === this.props.eventObj.attendees[i].attendeeName) {
        count = 1;
      }
    }

    if (count === 1) {
      return true;
    } else {
      return false;
    }
    count = 0;
  }

// stores the attendess selection of dates and his name.
  updateEvent(e) {
    if (this.props.attendeeName.length === 0) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabel));
    } else if (this.duplicateCheck()) {
      this.props.dispatch(storeAttendeeNameErrorLabel(this.props.languageJson.attendeeNameErrorLabelDuplicate));
    } else {

      // populating personalizedDateSelection if user has not chosen any status.
      this.fillTheLeftOutDates();

      // A timeout has been used, because There will be a little time taken for storing the default values
      // to the left-out dates. So, having a delay will give a consistency in the application.
      setTimeout((function() {
       this.callAfterSomeTimeUpdate();
     }).bind(this), 1000);
    }
  }

  fillDateWithWeather() {
    if (this.props.weather.length === 0) {

      return (
        <Column
          header={<Cell>Dates</Cell>}
          cell={props => (
            <Cell {...props}>
              {this.props.eventObj.dateArray[props.rowIndex]}
            </Cell>
          )}
          fixed={true}
          width={180}
        />
      );
    } else {
      // formats the (Sun, Oct 2nd 2016) to (Oct 2 2016) for date validation.
      let formattedEnteredDates = this.props.eventObj.dateArray.map((date) => {
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

        return formattedDate.split(",")[1];
      });

      // checks date with weather array and updates the weather If present.
      let datesInColumn = formattedEnteredDates.map((eDate, i) => {
        let dateInColumn = '';
        for (let j=0; j<this.props.weather.length; j++) {
          let enteredDate = new Date(eDate);
          let weatherDate = new Date(this.props.weather[j].date);
          if ((enteredDate.getDate() === weatherDate.getDate()) && (enteredDate.getMonth() === weatherDate.getMonth()) && (enteredDate.getYear() === weatherDate.getYear())) {
            dateInColumn = this.props.eventObj.dateArray[i] + "  ," + this.props.weather[j].cast;
          }
        }

        if (dateInColumn !== '') {
          return dateInColumn;
        } else {
          return this.props.eventObj.dateArray[i];
        }

      });

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
}

// This method is responsible for calculating the count of free, maybe and busy for a given date.
  fillFreeStatus() {
    let dateStatusArray = this.props.eventObj.dateArray;
    dateStatus = {};
    dateStatus['free'] = {};
    dateStatus['maybe'] = {};
    dateStatus['busy'] = {};
    for (let i=0; i<dateStatusArray.length; i++) {
      dateStatus['free'][dateStatusArray[i]] = 0;
      dateStatus['maybe'][dateStatusArray[i]] = 0;
      dateStatus['busy'][dateStatusArray[i]] = 0;
    }

    for (let j=0; j<this.props.eventObj.attendees.length; j++) {
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
                  orderedDateStausArray.push(<FontIcon className='material-icons' color={green500} style={styles.icon2}>panorama_fish_eye</FontIcon>);
                }
                if (attendee.personalizedDateSelection[key] === 'maybe') {
                  orderedDateStausArray.push(<FontIcon className='material-icons' color={yellow800} style={styles.icon2}>change_history</FontIcon>);
                }
                if (attendee.personalizedDateSelection[key] === 'busy') {
                  orderedDateStausArray.push(<FontIcon className='material-icons' color={red500} style={styles.icon2}>clear</FontIcon>);
                }
              }
            }
          }
        });
        return (
          <Column
            header={<Cell onTouchTap={this.updateAttendeeComponent.bind(this, attendee._id, attendee.attendeeName, attendee.personalizedDateSelection)}>{attendee.attendeeName}</Cell>}
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

// Renders the date for the event for user selection.
  dateToggleSection() {
    let dateArray = this.props.eventObj.dateArray;
    return dateArray.map((date, i) =>{
      return (
        <div className='row'>
          <div className='col-xs-3'>
          </div>
          <div className='col-xs-offset-1 col-xs-2'>
            <label style={styles.dateLabel}> {date} </label>
          </div>
          <div className='col-xs'>
              <RadioButtonGroup name='shipSpeed' style={{ display: 'flex' }} onChange={this.handleDateToogle.bind(this, date)} defaultSelected='busy'>
                  <RadioButton
                    value='free'
                    label='Free'
                    checkedIcon={<FontIcon className='material-icons' color={red500} style={styles.icon}>panorama_fish_eye</FontIcon>}
                    uncheckedIcon={<FontIcon className='material-icons' style={styles.icon}>panorama_fish_eye</FontIcon>}
                    style={styles.block}
                  />
                  <RadioButton
                    value='maybe'
                    label='MayBe'
                    checkedIcon={<FontIcon className='material-icons' color={red500} style={styles.icon}>change_history</FontIcon>}
                    uncheckedIcon={<FontIcon className='material-icons' style={styles.icon}>change_history</FontIcon>}
                    style={styles.block1}
                  />
                  <RadioButton
                    value='busy'
                    label='Busy'
                    checkedIcon={<FontIcon className='material-icons' color={red500} style={styles.icon}>clear</FontIcon>}
                    uncheckedIcon={<FontIcon className='material-icons' style={styles.icon}>clear</FontIcon>}
                    style={styles.block}
                  />
              </RadioButtonGroup>
          </div>
        </div>
      );
    });
  }

  MobiledateToggleSection() {
    let dateArray = this.props.eventObj.dateArray;
    let attendees = this.props.eventObj.attendees;

    return dateArray.map((date, i) =>{
    let freelist = "", maybelist = "", busylist = "";
      attendees.map((attendee, j) => {
        for (let key in attendee.personalizedDateSelection) {
          if (attendee.personalizedDateSelection.hasOwnProperty(key)) {
            if (date === key) {

              if (attendee.personalizedDateSelection[key] === 'free') {
              freelist+= (freelist=="")? attendee.attendeeName  : ", "+attendee.attendeeName;
              }
              if (attendee.personalizedDateSelection[key] === 'maybe') {
              maybelist+= (maybelist=="")? attendee.attendeeName  : ", "+attendee.attendeeName;
              }
              if (attendee.personalizedDateSelection[key] === 'busy') {
              busylist+= (busylist=="")? attendee.attendeeName  : ", "+attendee.attendeeName;
              }
            }
          }
        }
      });

      return (


    <div className = 'row center-xs'>
    <div className='col-sm-8 col-xs-12'>
    {/**<label style={styles.dateLabel}> {date} </label>*/}
    <Card expandable={true}>
      <CardHeader
          style={{paddingLeft:"90px"}}
          title={date}
          actAsExpander={true}
          showExpandableButton={true}
          />
          <CardText expandable={true}>
           Free: {freelist}
           <br></br>
           Maybe: {maybelist}
           <br></br>
           Busy: {busylist}
          </CardText>
        <CardActions>
            <div className='row center-xs'>
              <br></br>
              <br></br>
                <div className='col-xs-12'>

                    <MediaQuery minDeviceWidth={420}> {/** Tablets and phablets: display label for radio buttons*/}
                        <RadioButtonGroup name='shipSpeed' className='row' onChange={this.handleDateToogle.bind(this, date)} defaultSelected='busy'>

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
                    </MediaQuery>

                    <MediaQuery maxDeviceWidth={420}> {/** Smartphones */}
                        <RadioButtonGroup name='shipSpeed' className='row' onChange={this.handleDateToogle.bind(this, date)} defaultSelected='busy'>


                          <RadioButton className='col-xs-4' style={{}} value='free' checkedIcon={< FontIcon className = 'material-icons' color = {
                                green500
                            }
                            style = {
                                styles.icon
                            } > panorama_fish_eye < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' style = {
                                styles.icon
                            } > panorama_fish_eye < /FontIcon>}/>

                            <RadioButton className='col-xs-4' style={{}} value='maybe' checkedIcon={< FontIcon className = 'material-icons' color = {
                                yellow800
                            }
                            style = {
                                styles.icon
                            } > change_history < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' style = {
                                styles.icon
                            } > change_history < /FontIcon>}/>

                            <RadioButton className='col-xs-4' style={{}} value='busy' checkedIcon={< FontIcon className = 'material-icons' color = {
                                red500
                            }
                            style = {
                                styles.icon
                            } > clear < /FontIcon>} uncheckedIcon={< FontIcon className = 'material-icons' style = {
                                styles.icon
                            } > clear < /FontIcon>}/>

                        </RadioButtonGroup>
                    </MediaQuery>
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

  toggleCastAttendanceButton() {
    if (this.props.toggleCastAttendance) {
      this.props.dispatch(toggleCastAttendance(false));
    } else {
      this.props.dispatch(toggleCastAttendance(true));
    }
  }

  updateDateToggleSection() {
    let updateDateCollection = [];
    let i = 0;
    for (let key in this.props.updateAttendeeDate) {
      if (this.props.updateAttendeeDate.hasOwnProperty(key)) {
          updateDateCollection[i++] = (
            <div className='row'>
              <div className='col-xs-3'>
              </div>
              <div className='col-xs-offset-1 col-xs-2'>
                <label style={styles.dateLabel}> {key} </label>
              </div>
              <div className='col-xs'>
                  <RadioButtonGroup name='shipSpeed' style={{ display: 'flex' }} onChange={this.handleDateToogle.bind(this, key)} defaultSelected={this.props.updateAttendeeDate[key]}>
                      <RadioButton
                        value='free'
                        label='Free'
                        checkedIcon={<FontIcon className='material-icons' color={red500} style={styles.icon}>event_available</FontIcon>}
                        uncheckedIcon={<FontIcon className='material-icons' style={styles.icon}>event_available</FontIcon>}
                        style={styles.block}
                      />
                      <RadioButton
                        value='maybe'
                        label='MayBe'
                        checkedIcon={<FontIcon className='material-icons' color={red500} style={styles.icon}>warning</FontIcon>}
                        uncheckedIcon={<FontIcon className='material-icons' style={styles.icon}>warning</FontIcon>}
                        style={styles.block1}
                      />
                      <RadioButton
                        value='busy'
                        label='Busy'
                        checkedIcon={<FontIcon className='material-icons' color={red500} style={styles.icon}>event_busy</FontIcon>}
                        uncheckedIcon={<FontIcon className='material-icons' style={styles.icon}>event_busy</FontIcon>}
                        style={styles.block}
                      />
                  </RadioButtonGroup>
              </div>
            </div>
          );
        } // if
      } // for
      return updateDateCollection;
  }

  toggleCastAttendance() {
    if (this.props.toggleCastAttendance) {
      console.log("cominghere");
      if (this.props.updateAttendeeName !== '' && this.props.updateAttendeeId !== '') {
        console.log("passing update");
        if (document.cookie.indexOf('name') > -1 && cookie.load('name') === this.props.updateAttendeeName ) {
          return (
            <div>
              <div className='row center-xs'>
                <label style={styles.formLabel}> {this.props.languageJson.dateSelectionLabel} </label>
              </div>
              <br />
              <div className='row'>
                <div className='col-xs-offset-5 col-xs-1'>
                  <label style={styles.formLabel}> Name </label>
                </div>
                <div className='col-xs'>
                  <TextField id='name' hintText='Name' onChange={this.storeAttendeeName} value={this.props.attendeeName} />
                  <br />
                  <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
                </div>
              </div>
              <br />
              {this.updateDateToggleSection()}
              <br />
              <div className='row center-xs'>
                <RaisedButton label='Update' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.updateAttendee} />
              </div>
            </div>
          );
        } else {
          return (
            <div>
              <br />
              <div className='row center-xs'>
                <label style={styles.formLabel}> {this.props.languageJson.dateCastSelectionLabel} </label>
              </div>
              <br />
              <div className='row center-xs'>
                <RaisedButton label='Cast Attendance' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.toggleCastAttendanceButton} />
              </div>
            </div>
          );
        }
      } else {
        return (
          <div>
            <div className='row center-xs'>
              <label style={styles.formLabel}> {this.props.languageJson.dateSelectionLabel} </label>
            </div>
            <br />
            <div className='row'>
              <div className='col-xs-offset-5 col-xs-1'>
                <label style={styles.formLabel}> Name </label>
              </div>
              <div className='col-xs'>
                <TextField id='name' hintText='Name' onChange={this.storeAttendeeName} value={this.props.attendeeName} />
                <br />
                <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
              </div>
            </div>
            <br />
            {this.dateToggleSection()}
            <br />
            <div className='row center-xs'>
              <RaisedButton label='Update' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.updateEvent} />
            </div>
          </div>
        );
      }
    } else {
      return (
        <div>
          <br />
          <div className='row center-xs'>
            <label style={styles.formLabel}> {this.props.languageJson.dateCastSelectionLabel} </label>
          </div>
          <br />
          <div className='row center-xs'>
            <RaisedButton label='Cast Attendance' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.toggleCastAttendanceButton} />
          </div>
        </div>
      );
    }
  }

  toggleMobileCastAttendance() {
    if (this.props.toggleCastAttendance) {
      return (
        <div>

          <div className='row center-xs'>
            <div className='col-xs-10'>
              <TextField id='name' hintText='Name' onChange={this.storeAttendeeName} value={this.props.attendeeName} />
              <br />
              <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
            </div>
          </div>
          <br />
          {this.MobiledateToggleSection()}
          <br />
          <div className='row center-xs'>
            <RaisedButton label='Update' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.updateEvent} />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <div className='row center-xs'>
            <RaisedButton label='Cast Attendance' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.toggleCastAttendanceButton} />
          </div>
        </div>
      );
    }

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

    if (Object.keys(this.props.eventObj).length === 0 && this.props.eventObj.constructor === Object) {
      result = (
        <div>
        </div>
      );
    } else {
      if ( this.props.weather.length === 0 ) {
        this.fetchWeather(this.props.eventObj.location);
      }
      let dateArray = this.props.eventObj.dateArray;
      let tableheight= (35 * (dateArray.length + 1))+15;
      result = (

        <div>
          <div>
          <MediaQuery minDeviceWidth={1224} orientation='landscape'>


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
                  {this.fillDateWithWeather()}
                  {this.fillFreeStatus()}
                  {this.fillMaybeStatus()}
                  {this.fillBusyStatus()}
                  {this.fillAttendeeDetails()}
                </ResponsiveFixedDataTable>
              </div>
              </div>
              <br />
              {this.toggleCastAttendance()}


          </MediaQuery>
          <MediaQuery maxDeviceWidth={1224} >
            {/*<div>You are a tablet or mobile phone</div>*/}

            <br></br>
              <div className='row center-xs'>
                <label style={styles.formLabel}> {this.props.eventObj.purpose} </label>
              </div>

              <br></br>

              <div>

                <div className='row center-xs'>
                  <div className='col-xs-10'>
                    <TextField id='name' hintText='Name' onChange={this.storeAttendeeName} value={this.props.attendeeName} />
                    <br />
                    <label style={styles.errorLabel}> {this.props.attendeeNameErrorLabel} </label>
                  </div>
                </div>
                <br />
                <br></br>
                {this.MobiledateToggleSection()}
                <br />
                <div className='row center-xs'>
                  <RaisedButton label='Update' primary={true} style={buttonStyle} disabled={false} onTouchTap={this.updateEvent} />
                </div>
              </div>
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
  toggleCastAttendance: PropTypes.bool.isRequired,
  updateAttendeeId: PropTypes.string.isRequired,
  updateAttendeeName: PropTypes.string.isRequired,
  updateAttendeeDate: PropTypes.object.isRequired,
  languageJson: PropTypes.object.isRequired,
  weather: PropTypes.array.isRequired

};


export default connect(state => ({
  eventObj: state.eventObj,
  attendeeName: state.attendeeName,
  attendeeNameErrorLabel: state.attendeeNameErrorLabel,
  personalizedDateSelection: state.personalizedDateSelection,
  toggleCastAttendance: state.toggleCastAttendance,
  updateAttendeeId: state.updateAttendeeId,
  updateAttendeeName: state.updateAttendeeName,
  updateAttendeeDate: state.updateAttendeeDate,
  languageJson: state.languageJson,
  weather: state.weather
}))(EventPageComponent);
