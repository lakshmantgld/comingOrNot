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
    icon2: {
        marginRight: 10,
        marginTop: 14
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
                        <AppBar className='headerBar' style={{
                            backgroundColor: 'black'
                        }} title={< a href = 'javascript:window.location.reload(true)' > <center className='col-md-offset-2' style={{
                            'position': 'absolute'
                        }}>
                            {this.props.languageJson.header}
                        </center> < /a>} showMenuIconButton={false} iconElementRight={< IconMenu iconButtonElement = { < div > <iframe src="https://ghbtns.com/github-btn.html?user=Lakshman-LD&repo=LetsMeetUp&type=star&count=false" frameborder="0" scrolling="0" width="70px" height="20px" style={{
                            'border': 'none'
                        }}></iframe> < FontIcon className = 'material-icons' color = {
                                grey50
                            }
                            style = {
                                styles.icon2
                            } > language < /FontIcon> </div >
                        }
                        targetOrigin = {{horizontal: 'right', vertical: 'top'}}anchorOrigin = {{horizontal: 'right', vertical: 'top'}} > <MenuItem primaryText="Japanese" onTouchTap={this.renderJapanese}/> < MenuItem primaryText = "English" onTouchTap = {
                            this.renderEnglish
                        } /> </IconMenu>}/>
                    </header>
                </div>
                {/**Mobile & Tablet code ends*/}

                {/*##########################*/}

                {/**PC & Laptop code starts*/}
                <div className=" hidden-xs hidden-sm">
                    <header>
                        <AppBar className='headerBar' style={{
                            backgroundColor: 'black'
                        }} title={< a href = 'javascript:window.location.reload(true)' > <center className='col-md-offset-1' style={{
                            'marginLeft': '120px'
                        }}>
                            {this.props.languageJson.header}
                        </center> < /a>} showMenuIconButton={false} iconElementRight={< IconMenu iconButtonElement = { < div > <iframe src="https://ghbtns.com/github-btn.html?user=Lakshman-LD&repo=LetsMeetUp&type=star&count=false" frameborder="0" scrolling="0" width="100px" height="20px" style={{
                            'border': 'none'
                        }}></iframe> < FontIcon className = 'material-icons' color = {
                                grey50
                            }
                            style = {
                                styles.icon2
                            } > language < /FontIcon> </div >
                        }
                        targetOrigin = {{horizontal: 'right', vertical: 'top'}}anchorOrigin = {{horizontal: 'right', vertical: 'top'}} > <MenuItem primaryText="Japanese" onTouchTap={this.renderJapanese}/> < MenuItem primaryText = "English" onTouchTap = {
                            this.renderEnglish
                        } /> </IconMenu>}/>
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
