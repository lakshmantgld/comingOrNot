var src = ['Gruntfile.js', 'app.js', 'bin/www', 'routes/*.js', 'models/*.js', 'lib/*.js', 'test/**/*.js'];
var srcClient = ['./app/**/*.js'];

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-gitbook');

  grunt.initConfig({
    jshint: {
      files: src,
      options: {
        jshintrc: '.jshintrc',
        force: true
      }
    },
    jscs: {
      src: src,
      options: {
        config: '.jscsrc',
        esnext: true, // If you use ES6 http://jscs.info/overview.html#esnext
        verbose: true, // If you need output with rule names http://jscs.info/overview.html#verbose
        fix: true, // Autofix code style violations when possible.
        requireCurlyBraces: ['if']
      }
    },
    jsdoc: {
      dist: {
        src: src,
        options: {
          destination: 'doc'
        }
      }
    },
    gitbook: {
      dist: {
        input: './../book'
      }
    },
    watch: {
      scripts: {
        files: src,
        tasks: ['jshint', 'jscs'],
        options: {
          spawn: false
        }
      },
      client: {
        files: srcClient,
        tasks: ['browserify'],
        options: {
          spawn: false
        }
      }
    },
    browserify: {
      react: {
        files: {
          './public/js/app.js': './app/main.js'
        },
        options: {
          transform: [['babelify', {presets: ['es2015', 'react']}]],
          browerifyOptions: {
            debug: true
          }
        }
      }
    },
    copy: {
      flexbox: {
        src: 'bower_components/flexboxgrid/css/flexboxgrid.css',
        dest: 'public/css/flexboxgrid.css'
      },
      materialIcons: {
        files: [
          {
            src: 'bower_components/material-design-icons/iconfont/material-icons.css',
            dest: 'public/fonts/material-icons.css'
          },
          {
            src: ['bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff',
                  'bower_components/material-design-icons/iconfont/MaterialIcons-Regular.woff2',
                  'bower_components/material-design-icons/iconfont/MaterialIcons-Regular.ttf'],
            dest: 'public/fonts/',
            expand: true,
            flatten: true,
            filter: 'isFile'
          }
        ]
      }
    }
  });

  grunt.registerTask('doc', ['jsdoc', 'gitbook']);
  grunt.registerTask('default',['jscs', 'jshint', 'browserify', 'copy']);
};
