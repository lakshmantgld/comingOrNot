import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';

import AppBar from 'material-ui/AppBar';
import {grey50} from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import englishJson from '../../en.json';
import japaneseJson from '../../jp.json';

import {changelanguage} from './../actions/registerActions';

let styles = {
    icon2mobile: {
        marginRight: 10,
        marginTop: 14,
        cursor: "pointer"
    },
    icon2desktop: {
        marginRight: 10,
        marginTop: 25,
        fontSize: 45,
        color: "black",
        cursor: "pointer"
    }
}

class Header extends Component {
    constructor(props) {
        super(props);
        this.renderJapanese = this.renderJapanese.bind(this);
        this.renderEnglish = this.renderEnglish.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(changelanguage(englishJson));
    }

    renderEnglish() {
        console.log("json printing");
        console.log(JSON.stringify(englishJson));
        this.props.dispatch(changelanguage(englishJson));
    }

    renderJapanese() {
        console.log("json printing");
        console.log(JSON.stringify(japaneseJson));
        this.props.dispatch(changelanguage(japaneseJson));
    }

    render() {
        let currentURL = window.location.href;
        return (
            <div>

                {/**Mobile & Tablet code starts*/}
                <div className=" hidden-md hidden-lg">
                    <header>
                      <AppBar
                        className='headerBar'
                        style={{backgroundColor: 'black'}}
                        title={<a href='javascript:window.location.reload(true)'>
                        <center className='col-md-offset-2' style={{'position':'absolute'}}> {this.props.languageJson.header} </center>
                          </a>}
                        showMenuIconButton={false}
                        iconElementRight={
                          <div>

                            <a href="https://chirosushi.com/">
                               <img src={require('./../../public/images/ChiroSushi.png')} style={{"width": "65px", "marginBottom": "-2px", "marginRight": "15px", "filter": "invert(100%)"}}/>
                            </a>

                            <IconMenu

                              iconButtonElement={
                                  <FontIcon className='material-icons' color={grey50} style={styles.icon2mobile}>language</FontIcon>
                              }
                              targetOrigin={{horizontal: 'right', vertical: 'top'}}
                              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            >
                              <MenuItem primaryText="日本語" onTouchTap={this.renderJapanese} />
                              <MenuItem primaryText="English" onTouchTap={this.renderEnglish} />
                            </IconMenu>
                          </div>
                        }
                      />
                    </header>
                </div>
                {/**Mobile & Tablet code ends*/}

                {/*##########################*/}

                {/**PC & Laptop code starts*/}
                <div className=" hidden-xs hidden-sm">
                    <header>

                      <div className="row" style={{"paddingTop":"40px"}}>
                        <div className="col-md-offset-1 col-md-6">
                          <div className="box" >
                            <a style={{"text-decoration":"none"}} href='javascript:window.location.reload(true)'>
                            <h1 style={{"font-size":"80px","font-weight":"bolder","display":"inline", "cursor":"pointer", "color":"black"}}>{this.props.languageJson.header}</h1>
                            </a>
                          </div>
                        </div>
                        <div className="col-md-4 end-md" >
                          <div className="box">
                          <div>
                          <a href="https://chirosushi.com/">
                             <img src={require('./../../public/images/ChiroSushi.png')} style={{"width": "30%", "marginBottom": "-5px", "marginRight": "35px" }}/>
                          </a>

                            <IconMenu
                              iconButtonElement={
                                  <FontIcon className='material-icons' style={styles.icon2desktop}>language</FontIcon>
                              }
                              targetOrigin={{horizontal: 'right', vertical: 'top'}}
                              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            >
                              <MenuItem primaryText="日本語" onTouchTap={this.renderJapanese} />
                              <MenuItem primaryText="English" onTouchTap={this.renderEnglish} />
                            </IconMenu>
                          </div>
                          </div>
                        </div>
                      </div>

                    </header>
                </div>
                {/**PC & Laptop code ends*/}

            </div>
        );
    }
}

Header.propTypes = {
    languageJson: PropTypes.object.isRequired
};

export default connect(state => ({languageJson: state.languageJson}))(Header);
