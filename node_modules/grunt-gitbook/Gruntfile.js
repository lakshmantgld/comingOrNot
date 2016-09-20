var path = require("path");

module.exports = function (grunt) {
    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        gitbook: {
            development: {
                output: path.join(__dirname, "test/dest"),
                input: "test/input",
                title: "Test",
                github: "GitbookIO/grunt-gitbook"
            }
        },
        mochaTest: {
            options: {
                    reporter: 'xunit',
                    captureFile: 'tests.xml'
            },
            files: ['test/*_test.js']
        },
        clean: {
            files: 'test/dest'
        }
    });

    grunt.registerTask('test', [
        'clean',
        'gitbook',
        'mochaTest',
    ]);

    grunt.registerTask('default', 'test');
};