(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["CopyToClipboard"] = factory(require("react"));
	else
		root["CopyToClipboard"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _require = __webpack_require__(1);
	
	var CopyToClipboard = _require.CopyToClipboard;
	
	
	module.exports = CopyToClipboard;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.CopyToClipboard = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _copyToClipboard = __webpack_require__(3);
	
	var _copyToClipboard2 = _interopRequireDefault(_copyToClipboard);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var CopyToClipboard = exports.CopyToClipboard = _react2.default.createClass({
	  displayName: 'CopyToClipboard',
	
	  propTypes: {
	    text: _react2.default.PropTypes.string.isRequired,
	    children: _react2.default.PropTypes.element.isRequired,
	    onCopy: _react2.default.PropTypes.func,
	    options: _react2.default.PropTypes.shape({
	      debug: _react2.default.PropTypes.bool,
	      message: _react2.default.PropTypes.string
	    })
	  },
	
	  onClick: function onClick(event) {
	    var _props = this.props;
	    var text = _props.text;
	    var onCopy = _props.onCopy;
	    var children = _props.children;
	    var options = _props.options;
	
	    var elem = _react2.default.Children.only(children);
	
	    (0, _copyToClipboard2.default)(text, options);
	    if (onCopy) {
	      onCopy(text);
	    }
	
	    // Bypass onClick if it was present
	    if (elem && elem.props && typeof elem.props.onClick === 'function') {
	      elem.props.onClick(event);
	    }
	  },
	  render: function render() {
	    var _props2 = this.props;
	    var _text = _props2.text;
	    var _onCopy = _props2.onCopy;
	    var _options = _props2.options;
	    var children = _props2.children;
	
	    var props = _objectWithoutProperties(_props2, ['text', 'onCopy', 'options', 'children']);
	
	    var elem = _react2.default.Children.only(children);
	
	    return _react2.default.cloneElement(elem, _extends({}, props, { onClick: this.onClick }));
	  }
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var deselectCurrent = __webpack_require__(4);
	
	var defaultMessage = 'Copy to clipboard: #{key}, Enter';
	
	function format(message) {
	  var copyKey = (/mac os x/i.test(navigator.userAgent) ? '⌘' : 'Ctrl') + '+C';
	  return message.replace(/#{\s*key\s*}/g, copyKey);
	}
	
	function copy(text, options) {
	  var debug, message, reselectPrevious, range, selection, mark, success = false;
	  if (!options) { options = {}; }
	  debug = options.debug || false;
	  try {
	    reselectPrevious = deselectCurrent();
	
	    range = document.createRange();
	    selection = document.getSelection();
	
	    mark = document.createElement('span');
	    mark.textContent = text;
	    mark.setAttribute('style', [
	      // reset user styles for span element
	      'all: unset',
	      // prevents scrolling to the end of the page
	      'position: fixed',
	      'top: 0',
	      'clip: rect(0, 0, 0, 0)',
	      // used to preserve spaces and line breaks
	      'white-space: pre',
	      // do not inherit user-select (it may be `none`)
	      '-webkit-user-select: text',
	      '-moz-user-select: text',
	      '-ms-user-select: text',
	      'user-select: text',
	    ].join(';'));
	
	    document.body.appendChild(mark);
	
	    range.selectNode(mark);
	    selection.addRange(range);
	
	    var successful = document.execCommand('copy');
	    if (!successful) {
	      throw new Error('copy command was unsuccessful');
	    }
	    success = true;
	  } catch (err) {
	    debug && console.error('unable to copy using execCommand: ', err);
	    debug && console.warn('trying IE specific stuff');
	    try {
	      window.clipboardData.setData('text', text);
	      success = true;
	    } catch (err) {
	      debug && console.error('unable to copy using clipboardData: ', err);
	      debug && console.error('falling back to prompt');
	      message = format('message' in options ? options.message : defaultMessage);
	      window.prompt(message, text);
	    }
	  } finally {
	    if (selection) {
	      if (typeof selection.removeRange == 'function') {
	        selection.removeRange(range);
	      } else {
	        selection.removeAllRanges();
	      }
	    }
	
	    if (mark) {
	      document.body.removeChild(mark);
	    }
	    reselectPrevious();
	  }
	
	  return success;
	}
	
	module.exports = copy;


/***/ },
/* 4 */
/***/ function(module, exports) {

	
	module.exports = function () {
	  var selection = document.getSelection();
	  if (!selection.rangeCount) {
	    return function () {};
	  }
	  var active = document.activeElement;
	
	  var ranges = [];
	  for (var i = 0; i < selection.rangeCount; i++) {
	    ranges.push(selection.getRangeAt(i));
	  }
	
	  switch (active.tagName.toUpperCase()) { // .toUpperCase handles XHTML
	    case 'INPUT':
	    case 'TEXTAREA':
	      active.blur();
	      break;
	
	    default:
	      active = null;
	      break;
	  }
	
	  selection.removeAllRanges();
	  return function () {
	    selection.type === 'Caret' &&
	    selection.removeAllRanges();
	
	    if (!selection.rangeCount) {
	      ranges.forEach(function(range) {
	        selection.addRange(range);
	      });
	    }
	
	    active &&
	    active.focus();
	  };
	};


/***/ }
/******/ ])
});
;
//# sourceMappingURL=react-copy-to-clipboard.js.map