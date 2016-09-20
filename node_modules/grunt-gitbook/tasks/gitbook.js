module.exports = function(grunt) {
    var fs = require('fs'),
            gitbook = require('gitbook'),
            path = require('path');

    grunt.registerMultiTask('gitbook', 'gitbook builder', function() {
        var config = this.data;
        var done = this.async();
        
        gitbook.generate.folder(config)
        .then(function() {
            done();
        }, done);
    });
};