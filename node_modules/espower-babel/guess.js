const COMPILER_NAME = require('./package.json').name + '/guess';
var path = require('path'),
    resolveBabelrc = require('./lib/babelrc-util').resolveBabelrc,
    pattern = 'test/**/*.js',
    packageData,
    testDir,
    babelrc,
    extension = '.js';

// When guess.js is loaded in a process
// with an argument like <extension>:espower-babel/guess,
// such as `mocha --compilers <extension>:espower-babel/guess`,
// override extension with the specified one.
process.argv.forEach(function (arg) {
    if (arg.indexOf(':') === -1) {
        return;
    }

    var parts = arg.split(':');
    var ext = parts[0];
    var compilerPath = parts[1];

    // We should handle the relative path `./guess`
    // to make our very own tests work.
    if (compilerPath === './guess') {
        var compilerFullPath;

        try {
            compilerFullPath = require.resolve(compilerPath);
        } catch(err) {}

        if (compilerFullPath !== module.filename) {
            return;
        }

        compilerPath = COMPILER_NAME;
    }

    if (compilerPath !== COMPILER_NAME) {
        return;
    }

    extension = '.' + ext;
});

packageData = require(path.join(process.cwd(), 'package.json'));
if (packageData &&
    typeof packageData.directories === 'object' &&
    typeof packageData.directories.test === 'string') {
    testDir = packageData.directories.test;
    pattern = testDir + ((testDir.lastIndexOf('/', 0) === 0) ? '' : '/') + '**/*' + extension;
}

babelrc = resolveBabelrc(process.cwd(), {});

require('./index')({
    cwd: process.cwd(),
    pattern: pattern,
    babelrc: babelrc,
    extension: extension
});
