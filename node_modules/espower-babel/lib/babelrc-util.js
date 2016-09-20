"use strict";

var fs = require('fs');
var path = require('path');
var extend = require('xtend');
var util = require('babel-core').util;
/**
 * look up ".babelrc" file and merge options.
 * @param {string} loc the location of file
 * @param {Object} opts the options is merged .babelrc
 * @returns {Object}
 */
function resolveBabelrc(loc, opts) {
    var babelrc;
    opts = opts !== undefined ? opts : {};

    try {
        babelrc = JSON.parse(fs.readFileSync(path.join(loc, '.babelrc'), 'utf-8'));
        opts = extend(babelrc, opts);
    } catch (e) {
        // not found .babelrc then ignore error
    }

    return opts;
}

/**
 * decide ignore or not by Babel's only/ignore options.
 * @param filename
 * @param babelrc
 * @returns {boolean}
 */
function shouldIgnoreByBabel(filename, babelrc) {
    if (!babelrc.ignore && !babelrc.only) {
        return /node_modules/.test(filename);
    } else {
        var ignore = babelrc.ignore ? util.arrayify(babelrc.ignore, util.regexify) : null;
        var only = babelrc.only ? util.arrayify(babelrc.only, util.regexify) : null;
        return util.shouldIgnore(filename, ignore, only);
    }
}

module.exports = {
    resolveBabelrc: resolveBabelrc,
    shouldIgnoreByBabel: shouldIgnoreByBabel
};
