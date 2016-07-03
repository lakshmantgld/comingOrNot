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
	
	// Babel6 does not hack the default behaviour of ES Modules anymore, so we should export
	
	var CopyToClipboard = __webpack_require__(1).default;
	
	module.exports = CopyToClipboard;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _copyToClipboard = __webpack_require__(3);
	
	var _copyToClipboard2 = _interopRequireDefault(_copyToClipboard);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var onClick = function onClick(text, onCopy) {
	  return function () {
	    (0, _copyToClipboard2.default)(text);
	    if (onCopy) {
	      onCopy(text);
	    }
	  };
	};
	
	var CopyToClipboard = _react2.default.createClass({
	  displayName: 'CopyToClipboard',
	
	  propTypes: {
	    text: _react2.default.PropTypes.string.isRequired,
	    children: _react2.default.PropTypes.element.isRequired,
	    onCopy: _react2.default.PropTypes.func
	  },
	
	  render: function render() {
	    var _props = this.props;
	    var text = _props.text;
	    var onCopy = _props.onCopy;
	    var children = _props.children;
	
	    var props = _objectWithoutProperties(_props, ['text', 'onCopy', 'children']);
	
	    var elem = _react2.default.Children.only(children);
	
	    return _react2.default.cloneElement(elem, _extends({}, props, {
	      onClick: onClick(text, onCopy)
	    }));
	  }
	});
	
	exports.default = CopyToClipboard;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var deselectCurrent = __webpack_require__(4);
	
	function copy(text, options) {
	  var reselectPrevious, selection, range, mark, debug, message;
	  if (!options) { options = {}; }
	  debug = options.debug || false;
	  message = options.message || 'Copy to clipboard: Ctrl+C, Enter';
	
	  try {
	    reselectPrevious = deselectCurrent();
	
	    range = document.createRange();
	    selection = document.getSelection();
	
	    mark = document.createElement('mark');
	    mark.textContent = text;
	    // used to conserve newline, etc
	    mark.style.whiteSpace = 'pre';
	    document.body.appendChild(mark);
	
	    range.selectNode(mark);
	    selection.addRange(range);
	
	    var successful = document.execCommand('copy');
	    if (!successful) {
	      throw new Error('copy command was unsuccessful');
	    }
	  } catch (err) {
	    debug && console.error('unable to copy, trying IE specific stuff');
	    try {
	      window.clipboardData.setData('text', text);
	    } catch (err) {
	      debug && console.error('unable to copy, falling back to prompt');
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
	}
	
	module.exports = copy;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var module = module || {};
	
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