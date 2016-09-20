/**
 * empower - Power Assert feature enhancer for assert function/object.
 *
 * https://github.com/power-assert-js/empower
 *
 * Copyright (c) 2013-2016 Takuto Wada
 * Licensed under the MIT license.
 *   https://github.com/power-assert-js/empower/blob/master/MIT-LICENSE.txt
 */
var empowerCore = require('empower-core');
var defaultOptions = require('./lib/default-options');
var capturable = require('./lib/capturable');
var assign = require('core-js/library/fn/object/assign');
var define = require('./lib/define-properties');

/**
 * Enhance Power Assert feature to assert function/object.
 * @param assert target assert function or object to enhance
 * @param formatter power assert format function
 * @param options enhancement options
 * @return enhanced assert function/object
 */
function empower (assert, formatter, options) {
    var config = assign(defaultOptions(), options);
    var eagerEvaluation = !(config.modifyMessageOnRethrow || config.saveContextOnRethrow);
    var empowerCoreConfig = assign(config, {
        modifyMessageBeforeAssert: function (beforeAssertEvent) {
            var message = beforeAssertEvent.originalMessage;
            if (!eagerEvaluation) {
                return message;
            }
            return buildPowerAssertText(formatter, message, beforeAssertEvent.powerAssertContext);
        },
        onError: function (errorEvent) {
            var e = errorEvent.error;
            if (e.name !== 'AssertionError') {
                throw e;
            }
            if (!errorEvent.powerAssertContext) {
                throw e;
            }
            // console.log(JSON.stringify(errorEvent, null, 2));
            if (config.modifyMessageOnRethrow) {
                e.message = buildPowerAssertText(formatter, errorEvent.originalMessage, errorEvent.powerAssertContext);
            }
            if (config.saveContextOnRethrow) {
                e.powerAssertContext = errorEvent.powerAssertContext;
            }
            throw e;
        }
    });
    var enhancedAssert = empowerCore(assert, empowerCoreConfig);
    define(enhancedAssert, capturable());
    return enhancedAssert;
}

function buildPowerAssertText (formatter, message, context) {
    // console.log(message);
    var powerAssertText = formatter(context);
    return message ? message + ' ' + powerAssertText : powerAssertText;
};

empower.defaultOptions = defaultOptions;
module.exports = empower;
