"use strict";
var babel = require("babel-core");
var shouldIgnoreByBabel = require("./lib/babelrc-util").shouldIgnoreByBabel;
var fs = require("fs");
var minimatch = require("minimatch");
var extend = require("xtend");
var createEspowerPlugin = require("babel-plugin-espower/create");
var sourceMapSupport = require("source-map-support");
var extensions = require.extensions,
    originalLoader = extensions[".js"];
function espowerBabel(options) {
    var separator = (options.pattern.lastIndexOf('/', 0) === 0) ? '' : '/';
    var pattern = options.cwd + separator + options.pattern;
    var babelrc = options.babelrc || {};
    var extension = options.extension || ".js";
    // extend babel option
    babelrc = extend(babelrc, {
        babelrc: false,
        sourceMap: "both",
        ast: false
    });
    // attach espower option
    var espoweredBabelrc = useEspower(babelrc);
    var sourceMaps = {};
    // https://github.com/evanw/node-source-map-support
    // `sourceMaps` is the cached map object of transform by babel
    sourceMapSupport.install({
        handleUncaughtExceptions: false,
        retrieveSourceMap: function (source) {
            var map = sourceMaps && sourceMaps[source];
            if (map) {
                return {
                    url: null,
                    map: map
                };
            } else {
                return null;
            }
        }
    });
    function useEspower(babelOptions) {
        babelOptions.plugins = babelOptions.plugins || [];
        var espowerPluginExists = babelOptions.plugins.some(function (plugin) {
            var pluginName = typeof plugin === "string" ? plugin : plugin.key;
            return pluginName === "babel-plugin-espower";
        });
        if (!espowerPluginExists) {
            babelOptions.plugins.push(createEspowerPlugin(babel, options.espowerOptions));
        }
        return babelOptions;
    }

    extensions[extension] = function (localModule, filepath) {
        var result;
        // https://babeljs.io/docs/usage/api/
        babelrc.filename = filepath;
        // transform the other files
        if (shouldIgnoreByBabel(filepath, babelrc)) {
            originalLoader(localModule, filepath);
            return
        }
        // transform test files using espower's `pattern` value
        if (minimatch(filepath, pattern)) {
            result = babel.transform(fs.readFileSync(filepath, "utf-8"), espoweredBabelrc);
            sourceMaps[filepath] = result.map;
            localModule._compile(result.code, filepath);
        } else {
            result = babel.transform(fs.readFileSync(filepath, "utf-8"), babelrc);
            sourceMaps[filepath] = result.map;
            localModule._compile(result.code, filepath);
        }
    };
}

module.exports = espowerBabel;
