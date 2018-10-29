var path = require('path');

module.exports = function(grunt) {


  var generateMainGenFile = function(filesList, pluginName) {
    var mainFile = grunt.file.read('./public/main.js');
    var files = 'var srcCode = [ '; // + ' ;\n';
    for (var i=0; i< filesList.length; i++) {
      files = files + '\n "' + filesList[i] + '", ';
    }
    mainFile = files + ' ];\n '  + mainFile;

    grunt.file.write('./public/main-'+pluginName+'.js', mainFile);
  };

  var getPluginsToTestListMap = function () {
    var pluginsToTestMap = {}, testFiles, directories, currentPlugin;
    grunt.file.recurse('./public/installed_plugins', function(path, a, directory) {
      if (path.indexOf ('.json')  < 0) {
        if (path.indexOf('/tests/') > 0) {
          directories = directory.split('/');
          currentPlugin = directories[0];
          testFiles = pluginsToTestMap[currentPlugin];
          if (testFiles === undefined) {
            testFiles = [];
            pluginsToTestMap[currentPlugin] = testFiles;
          }
          path = path.replace('public/','/');
          testFiles.push(path);
        }
      }
    });
    return pluginsToTestMap;
  };

  var generateCoverageHTML = function(pluginName) {
    var coverageFile = grunt.file.read('./public/coverage.html');
    coverageFile = coverageFile.replace('main-gen', 'main-'+pluginName);
    grunt.file.write('./public/coverage-'+pluginName+'.html', coverageFile);
  };

  var pluginsToTestMap = getPluginsToTestListMap(), keys = Object.keys(pluginsToTestMap),
      testUrls = [],  baseUrl = 'http://127.0.0.1:4000/coverage-', htmlExtension = '.html', i,
      mochaConfig = {}, taskList = [];

  for (i = 0; i < keys.length; i++) {
    var pluginName = keys[i];
    console.log('processing - ' + pluginName);
    var testFiles = pluginsToTestMap[pluginName];
    generateMainGenFile(testFiles, pluginName);
    generateCoverageHTML(pluginName);
    var pluginTestUrl = baseUrl + pluginName + htmlExtension;
    testUrls.push(pluginTestUrl);
    mochaConfig[pluginName] = {
      options: {
        urls: [pluginTestUrl],
        logErrors: true,
        reporter: 'XUnit',
      },
      dest: './target/site/unit-test/xunit-' + pluginName + '.xml'
    };
    taskList.push('mocha:'+pluginName);
  }

  var initConfig = {
    pkg: grunt.file.readJSON('package.json'),


    copy: {
      main: {
        files: [
          { expand: true, cwd: 'dist/widgetlib', src: ['**/*'], dest: 'public/widgetlib'},
          { expand: true, cwd: 'dist/sdk/public/assets/js/sdk', src: ['**/*'], dest: 'public/widgetlib/js/sdk'}
        ]
      },
      plugins: {
        files: [{
           cwd: '../plugins',
           src: ['**/*', '!**/tests/**/*.js'],
           dest: 'public/installed_plugins',
           expand: true
        }]
      },
      testfiles: {
        files: [{
           cwd: '../plugins',
           src: ['**/tests/**/*.js'],
           dest: 'public/installed_plugins',
           expand: true
        }]
      }
    },

    clean: {
      widgetlib: ['dist'],
      instrument: ['./public/plugins'],
      plugins: ['./public/installed_plugins'],
      coverage: ['./public/coverage/report']
    },

    express: {
      slipstream: {
        options: {
          port: 4000,
          bases: path.resolve('./public')
        }
      }
    },

    mocha_phantomjs: {
      all: {
        options: {
          reporter: 'spec',
          urls: ['http://127.0.0.1:4000']
        }
      },
      ci: {
        options: {
          reporter: 'tap',
          timeout: 30000,
          output: './plugins-unit-tests.tap',
          urls: ['http://127.0.0.1:4000/coverage.html']
        }
      }
    },

    // Unit-test coverage Istanbul integration.
    // Inline instrumentation of js files.
    instrument: {
        files : 'public/installed_plugins/**/*.js',
        options : {
          basePath : '.'
        }
    },
    mocha: mochaConfig
  };
  grunt.initConfig(initConfig);


  //task to list all files and add them to main-gen.js
  grunt.registerTask('load-all-files', function () {
    var filesList = [],
        excludedPlugins = {
          'sd-device-management' : 1
        };

    grunt.file.recurse('./public/installed_plugins', function(path, a, directory) {
      var directories = directory.split('/');
      if (!excludedPlugins [directories[0]]) {
        if (path.indexOf ('.json')  < 0) {
          if (path.indexOf('.js') > 0) {
            path = path.replace('public/','/');
            filesList.push(path);
          }
        }
      }
    });
    var mainFile = grunt.file.read('./public/main.js');

    var files = 'var srcCode = [ '; // + ' ;\n';
    for (var i=0; i< filesList.length; i++) {
      files = files + '\n "' + filesList[i] + '", ';
    }

    mainFile = files + ' ];\n '  + mainFile;

    grunt.file.write('./public/main-gen.js', mainFile);

  });


  //task to list all test files files and add them to main-gen.js
  grunt.registerTask('load-test-files', function () {
    var filesList = [], testList = grunt.file.read('./public/uiUTTest.txt');

    testList = testList? testList.trim() : "";
    if (testList.length) {
      filesList =testList.split(",");
    }

    if (filesList && filesList.length > 0) {
      for (var i = 0; i < filesList.length; i++) {
        var file = filesList[i];
        if (file) {
          filesList[i] = file.trim();
        }
      }
    } else {
      grunt.file.recurse('./public/installed_plugins', function(path, a, directory) {
        var directories = directory.split('/');
        if (path.indexOf ('.json')  < 0) {
          if (path.indexOf('/tests/') > 0) {
            path = path.replace('public/','/');
            filesList.push(path);
          }
        }
      });
    }

    var mainFile = grunt.file.read('./public/main.js');
    var files = 'var srcCode = [ '; // + ' ;\n';
    for (var i=0; i< filesList.length; i++) {
      files = files + '\n "' + filesList[i] + '", ';
    }
    mainFile = files + ' ];\n '  + mainFile;

    grunt.file.write('./public/main-gen.js', mainFile);

  });



  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-keepalive');
  // Plugins related to code coverage
  grunt.loadNpmTasks('grunt-istanbul');
  grunt.loadNpmTasks("grunt-mocha-phantom-istanbul");
  grunt.loadNpmTasks("grunt-mocha-phantomjs");

  grunt.registerTask('execute-ut', taskList);

  grunt.registerTask('prepare-tests', ['clean:plugins', 'copy:plugins', 'copy:testfiles',  'load-test-files']);
  grunt.registerTask('run-unit-tests-ci', ['clean:plugins', 'copy:plugins', 'copy:testfiles',  'load-test-files']);
  grunt.registerTask('ut', ['clean:plugins', 'copy:plugins', 'copy:testfiles', 'load-all-files',  'express:slipstream', 'keepalive']);
  grunt.registerTask('coverage', ['clean:plugins', 'copy:plugins', 'instrument',  'copy:testfiles', 'load-all-files', 'express:slipstream',  'mocha:test']);
};
