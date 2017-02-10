import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
// The below code is for extracting the location of browser. not working in localhost.
//import geolocator from 'geolocator';
import {grey600, red500, grey900, grey50} from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import Chip from 'material-ui/Chip';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import englishJson from '../../en.json';
import MediaQuery from 'react-responsive';
import InfiniteCalendar from 'react-infinite-calendar';
import Geosuggest from 'react-geosuggest';
import {Step, Stepper, StepLabel, StepContent} from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import moment from 'moment';

import {
    storeName,
    storePurpose,
    registerEvent,
    storeDateArray,
    storeDateArrayErrorLabel,
    popDateArray,
    stepIncrease,
    stepDecrease,
    storeNameErrorLabel,
    storePurposeErrorLabel,
    storeLocation,
    changelanguage,
    storeDisableFlag,
    updateNotificationFlag
} from './../actions/registerActions';

let styles = {
    formLabel: {
        text: 'bold',
        fontSize: '25px',
        color: grey600
    },
    errorLabel: {
        text: 'bold',
        fontSize: '16px',
        color: red500
    },
    chip: {
        margin: 4
    },
    underlineStyle: {
        borderColor: grey900
    },
    dateSelectLabel: {
        fontSize: '19px'
    },
    datePush: {
        marginTop: '20px'
    },
    cal: {
        backgroundColor: 'rgba(78, 74, 74, 0.05)'
    }
};
let buttonStyle = {
    margin: 12,
    color: 'rgb(255, 255, 255)'
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
        //this.storeStepIndex = this.storeStepIndex.bind(this);
        this.stepIncrease = this.stepIncrease.bind(this);
        this.stepDecrease = this.stepDecrease.bind(this);
        this.checkDisableFlag = this.checkDisableFlag.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
    }

    componentDidMount() {}

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
    storeDate(date, isSelected, selectedDates) {
        (this.props.dateArray.indexOf(date.format('ddd, MMM Do YYYY')) == -1)
            ? this.props.dispatch(storeDateArray(date.format('ddd, MMM Do YYYY')))
            : this.props.dispatch(popDateArray(date.format('ddd, MMM Do YYYY')));
    }

    storeLocation(location) {
        console.log("storeLocation");
        console.log(location);
        this.props.dispatch(storeLocation({"locationName": location}));
    }

    suggestLocation(location) {
        console.log("suggestLocation");
        console.log(location);
        this.props.dispatch(storeLocation({"locationName": location.label, "lat": location.location.lat, "long": location.location.lng}));
    }

    registerEvent() {
        let formattedEnteredDates = {};
        for (let i = 0; i < this.props.dateArray.length; i++) {
            let date = this.props.dateArray[i];
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
            formattedEnteredDates[formattedDate.split(",")[1]] = date;
        }

        let unorderedDates = Object.keys(formattedEnteredDates);
        let intermediateSortedDates = unorderedDates.sort(function(a, b) {
            return new Date(a) - new Date(b);
        });

        let sortedDates = [];

        for (let j = 0; j < intermediateSortedDates.length; j++) {
            sortedDates[j] = formattedEnteredDates[intermediateSortedDates[j]];
        }

        this.props.dispatch(registerEvent(this.props.name.trim(), this.props.purpose.trim(), sortedDates, this.props.location));
    }

    validateRegisterEvent() {
        if (this.props.name.length === 0) {
            this.props.dispatch(storeNameErrorLabel(this.props.languageJson.nameErrorLabelRequired));
        } else if (this.props.purpose.length === 0) {
            this.props.dispatch(storePurposeErrorLabel(this.props.languageJson.purposeErrorLabelRequired));
        } else if (this.props.dateArray.length === 0) {
            this.props.dispatch(storeDateArrayErrorLabel(this.props.languageJson.dateArrayEmptyErrorLabel));
        } else {
            this.props.dispatch(storeDisableFlag('registerEvent'));
            this.registerEvent();
        }
    }

    renderChip(data) {
        return (
                <Chip key={data}  style={styles.chip}>
                    {data}
                </Chip>
        );
    }

    checkDisableFlag() {
        if (this.props.disableFlag === 'registerEvent') {
            return true;
        } else {
            return false;
        }
    }

    stepIncrease() {
        switch (this.props.stepIndex) {
            case 0:
                if (this.props.name.length === 0 || this.props.name.trim() == '') {
                    this.props.dispatch(storeNameErrorLabel(this.props.languageJson.nameErrorLabelRequired));
                } else if (this.props.purpose.length === 0 || this.props.purpose.trim() == '') {
                    this.props.dispatch(storePurposeErrorLabel(this.props.languageJson.purposeErrorLabelRequired));
                } else {
                    this.props.dispatch(stepIncrease(this.props.stepIndex));
                }
                break;
            case 1:
                this.props.dispatch(stepIncrease(this.props.stepIndex));
                break;
            case 2:
                this.validateRegisterEvent();
                break;
            default:
                console.log("default ");
        }
    }

    stepDecrease() {
        this.props.dispatch(stepDecrease(this.props.stepIndex));
    }

    /**convertStringToDate(dateArray) {
      console.log("convertStringToDate");
      console.log(dateArray);
      let formattedEnteredDates = [];
      for (let i = 0; i < dateArray.length; i++) {
          let date = dateArray[i];
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

      let convertedDatearray = [];
        for(let date of formattedEnteredDates)
        {
          convertedDatearray.push(moment(new Date(date)));
        }
        console.log(convertedDatearray);
        return convertedDatearray;
    }*/

    renderStepActions(step) {
        const stepIndex = this.props.stepIndex;

        return (
            <div style={{
                margin: '12px 16px',
                marginTop: '25px'
            }}>
            {step > 0 && (<FlatButton label={this.props.languageJson.back} disabled={stepIndex === 0} disableTouchRipple={true} disableFocusRipple={true} onTouchTap={this.stepDecrease}/>)}
                <RaisedButton label={stepIndex === 2
                    ? this.props.languageJson.register
                    : this.props.languageJson.next} disableTouchRipple={true} disableFocusRipple={true} primary={true} onTouchTap={this.stepIncrease} style={{
                    marginRight: 12
                }}/>
            </div>
        );
    }
    getStepContent(stepIndex) {
        let today = new Date(); // Get today's date to give minimum limit to the calendar
        let dateArray = this.props.dateArray.map(this.renderChip, this);
        switch (stepIndex) {
            case 0:
                return (

                    <div className='row center-xs'>
                        <div className='col-xs-12'>
                            <TextField id='name' floatingLabelText={this.props.languageJson.name} onChange={this.storeName} floatingLabelFocusStyle={{
                                color: grey900
                            }} underlineFocusStyle={styles.underlineStyle} value={this.props.name}/>
                            <br/>
                            <label style={styles.errorLabel}>
                                {this.props.nameErrorLabel}
                            </label>
                        </div>

                        <div className='col-xs-12'>
                            <TextField id='purpose' floatingLabelText={this.props.languageJson.purpose} onChange={this.storePurpose} floatingLabelFocusStyle={{
                                color: grey900
                            }} underlineFocusStyle={styles.underlineStyle} value={this.props.purpose}/>
                            <br/>
                            <label style={styles.errorLabel}>
                                {this.props.purposeErrorLabel}
                            </label>
                        </div>
                    </div>

                );
            case 1:
                return (
                    <div className='row center-xs'>
                            <div className='col-md-6 col-md-offset-3'>

                                <Geosuggest style={{
                                    'input': {width: 'initial', textAlign: 'inherit'},
                                    'suggests': {},
                                    'suggestItem': {}
                                }} queryDelay={0} placeholder='Event location' initialValue='' onSuggestSelect={this.suggestLocation} onChange={this.storeLocation}/>

                            </div>
                        <br></br>
                    </div>
                );
            case 2:
                return (
                    <div className='row' style={{
                        paddingLeft: "0px",
                        paddingRight: "0px",
                        marginLeft: "0px"
                    }}>
                        {/*<div className='row' style={styles.datePush}>
                  <div className='col-xs-12'>
                      <label style={styles.dateSelectLabel}>
                          {this.props.languageJson.calendarLabel}
                      </label>
                  </div><br/><br/></div>*/}
                        <div className='row'>

                            <div className='col-xs-7'>
                            {this.renderCalendar('landscape', 270)}
                            </div>
                            <div className="col-xs-5" >
                                <div className="row center-xs" style={{maxHeight: '320px',overflowY: 'scroll'}}>
                                    {dateArray}
                                </div>
                                <div className='row center-xs'>
                                    <label style={styles.errorLabel}>
                                        {this.props.dateArrayErrorLabel}
                                    </label>
                                    <Snackbar open={this.checkNotificationFlag()} message={"Server Error!!"} autoHideDuration={3000} onRequestClose={this.handleRequestClose}/>
                                </div>
                            </div>
                        </div>
                        {/**<br/>
              <div className='row col-xs-offset-2 center-xs' id="regButton">
                  <RaisedButton label={this.props.languageJson.register} labelColor={grey50} style={buttonStyle} backgroundColor={grey900} disabled={false} onTouchTap={this.registerEvent}/>
                  <br/>
                  <br/>
                  <br/>
              </div>*/}

                    </div>
                );
            default:
                return 'You\'re a long way from home sonny jim!';
        }
    }

    handleRequestClose() {
        this.props.dispatch(updateNotificationFlag(''));
        this.props.dispatch(storeDisableFlag(''));
    }

    checkNotificationFlag() {
        if (this.props.notificationFlag === 'registerEventServerError') {
            return true;
        } else {
            return false;
        }
    }

    renderCalendar(layout, height) {
      return (
        <InfiniteCalendar theme={{
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
        }} layout={layout} width={'100%'} height={height} rowHeight={55} selectedDates={[new Date()]} onSelect={this.storeDate} keyboardSupport={true}/>
      );
    }

    render() {

        let dateArray = this.props.dateArray.map(this.renderChip, this);
        const contentStyle = {
            margin: '0 16px'
        };

        return (
            <div>

                    {/**Mobile & Tablet code starts*/}
                    <div className="visible-xs visible-sm hidden-md hidden-lg">
                        <br></br>
                        <br></br>

                        <div className='row'>
                            <div className='col-sm-offset-2 col-sm-8 col-xs-12'>
                                <Stepper activeStep={this.props.stepIndex} orientation="vertical">
                                    <Step>
                                        <StepLabel>Enter your name and event name</StepLabel>
                                        <StepContent>

                                            <div className='row'>

                                                <div className='col-xs-12'>
                                                    <TextField id='name' floatingLabelText={this.props.languageJson.name} onChange={this.storeName} floatingLabelFocusStyle={{
                                                        color: grey900
                                                    }} underlineFocusStyle={styles.underlineStyle} value={this.props.name}/>
                                                    <br/>
                                                    <label style={styles.errorLabel}>
                                                        {this.props.nameErrorLabel}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className='row'>

                                                <div className='col-xs-12'>
                                                    <TextField id='purpose' floatingLabelText={this.props.languageJson.purpose} onChange={this.storePurpose} floatingLabelFocusStyle={{
                                                        color: grey900
                                                    }} underlineFocusStyle={styles.underlineStyle} value={this.props.purpose}/>

                                                    <label style={styles.errorLabel}>
                                                        {this.props.purposeErrorLabel}
                                                    </label>
                                                </div>
                                            </div>

                                            {this.renderStepActions(0)}
                                        </StepContent>
                                    </Step>
                                    <Step>
                                        <StepLabel><span>Enter event location <br></br><span style={{'color':'rgba(0, 0, 0, 0.258824)'}}>Optional</span></span></StepLabel>

                                        <StepContent>
                                            <div className='row'>
                                                <div className='col-xs-12'>
                                                    <br></br>
                                                    <Geosuggest style={{
                                                        'input': {},
                                                        'suggests': {},
                                                        'suggestItem': {}
                                                    }} queryDelay={0} placeholder='Event location' initialValue='' onSuggestSelect={this.suggestLocation} onChange={this.storeLocation}/>

                                                </div>
                                            </div>
                                            <br></br>
                                            {this.renderStepActions(1)}
                                        </StepContent>
                                    </Step>
                                    <Step>
                                        <StepLabel>{this.props.languageJson.calendarLabel}</StepLabel>
                                        <StepContent style={{
                                            paddingLeft: "0px",
                                            paddingRight: "0px",
                                            marginLeft: "0px"
                                        }}>
                                            {/*<div className='row' style={styles.datePush}>
                                              <div className='col-xs-12'>
                                                  <label style={styles.dateSelectLabel}>
                                                      {this.props.languageJson.calendarLabel}
                                                  </label>
                                              </div><br/><br/></div>*/}
                                            <div className='row'>

                                                <div className='col-xs-12'>
                                                  <br></br>
                                                  {this.renderCalendar('potrait', 300)}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-xs-12">
                                                    {/**<div className='row'>
                                                        {dateArray}
                                                    </div>*/}
                                                    <div className='row center-xs'>
                                                        <label style={styles.errorLabel}>
                                                            {this.props.dateArrayErrorLabel}
                                                        </label>
                                                        <Snackbar open={this.checkNotificationFlag()} message={"Server Error!!"} autoHideDuration={3000} onRequestClose={this.handleRequestClose}/>
                                                    </div>
                                                </div>
                                            </div>
                                            {/**<br/>
                                          <div className='row col-xs-offset-2 center-xs' id="regButton">
                                              <RaisedButton label={this.props.languageJson.register} labelColor={grey50} style={buttonStyle} backgroundColor={grey900} disabled={false} onTouchTap={this.registerEvent}/>
                                              <br/>
                                              <br/>
                                              <br/>
                                          </div>*/}

                                            {this.renderStepActions(2)}
                                        </StepContent>
                                    </Step>
                                </Stepper>
                            </div>
                        </div>

                    </div>
                    {/**Mobile & Tablet code ends*/}

                    {/*##########################*/}

                    {/*PC & Laptop code starts*/}
                    <div className="visible-md visible-lg hidden-xs hidden-sm">
                        <br></br>
                        <br></br>

                        <div className='row'>
                            <div className='col-md-offset-1 col-md-10 col-sm-12 col-xs-12'>
                                <Stepper activeStep={this.props.stepIndex}>
                                    <Step>
                                        <StepLabel>Enter your name and events name</StepLabel>

                                    </Step>
                                    <Step>
                                        <StepLabel><span style={{'marginTop':'3px'}}>Enter Event location <br></br><span style={{'color':'rgba(0, 0, 0, 0.258824)'}}>Optional</span></span></StepLabel>


                                    </Step>
                                    <Step>
                                        <StepLabel>{this.props.languageJson.calendarLabel}</StepLabel>

                                    </Step>
                                </Stepper>

                                <div style={contentStyle}>

                                    {this.getStepContent(this.props.stepIndex)}
                                    <br></br>
                                    <div className='row center-xs'>
                                        <div className='col-xs-12' style={{
                                            marginTop: 12
                                        }}>
                                            <FlatButton label={this.props.languageJson.back} disabled={this.props.stepIndex === 0} onTouchTap={this.stepDecrease} style={{
                                                marginRight: 12
                                            }}/>
                                            <RaisedButton label={this.props.stepIndex === 2
                                                ? this.props.languageJson.register
                                                : this.props.languageJson.next} primary={true} disabled={this.checkDisableFlag()} onTouchTap={this.stepIncrease}/>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                    {/*PC & Laptop code ends*/}

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
    stepIndex: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired,
    languageJson: PropTypes.object.isRequired,
    disableFlag: PropTypes.string.isRequired,
    notificationFlag: PropTypes.string.isRequired
};

export default connect(state => ({
    name: state.name,
    purpose: state.purpose,
    dateArray: state.dateArray,
    dateArrayErrorLabel: state.dateArrayErrorLabel,
    nameErrorLabel: state.nameErrorLabel,
    purposeErrorLabel: state.purposeErrorLabel,
    stepIndex: state.stepIndex,
    location: state.location,
    languageJson: state.languageJson,
    disableFlag: state.disableFlag,
    notificationFlag: state.notificationFlag
}))(RegisterComponent);
