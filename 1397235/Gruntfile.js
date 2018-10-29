var path = require('path');
var slipstreamBuildModule = require('./slipstreamRequireBuildModules.js');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      release: ["dist"],
      deploy: ["deploy"],
      ci: ["*.tap"],
      instrument: ["public/test/instrument"],
      coverage: ["test/coverage/report"],
      slipstream_ui: ["dist/ui"],
      slipstream_sdk: ["public/slipstream_sdk", "SlipstreamSDK.tar", "public/slipstream_sdk_OSX", "public/slipstream_sdk_CentOS", "SlipstreamSDK_OSX.tar", "SlipstreamSDK_CentOS.tar"]
    },
    env: {
        options: {
               //Shared Options Hash
        },
        dev: {
             build_number : grunt.option('bldno') || 'dev build',
             build_hash : grunt.option('bldhash')  || '',
             build_timestamp : grunt.option('bldtime') || 'dev build',
             build_version: grunt.option('bldversion') || '0.0.1'
        },
    },

    requirejs: {
      ugly: {
        options: {
          mainConfigFile: 'requireBuild.js',
          dir: 'dist/tmp/min',
          optimize: 'uglify',
          baseUrl: 'public/assets/js',
          findNestedDependencies: true,
          fileExclusionRegExp: /^\explorer|scss|css/,
          modules: [
            {
              name: 'vendor/vendorFiles'
            },
            {
                name: 'Slipstream',
                include: ['widgets/login/loginWidget', 'widgets/confirmationDialog/confirmationDialogWidget'],
                exclude: ['jquery', 'vendor/vendorFiles', 'conf/global_config', 'editable']
            },
            {
                name: 'compiledWidgets',
                exclude: ['Slipstream', 'vendor/vendorFiles', 'jquery', 'foundation', 'widgets/login/loginWidget', 'widgets/confirmationDialog/confirmationDialogWidget', 'widgets/dashboard/allDashboard', 'widgets/barChart/barChartWidget', 'widgets/donutChart/donutChartWidget', 'widgets/lineChart/lineChartWidget', 'widgets/map/mapWidget', 'widgets/timeRange/timeRangeWidget', 'widgets/timeSeriesChart/timeSeriesChartWidget', 'editable']
            },
            {
                name: 'widgets/dashboard/allDashboard',
                include: ['widgets/dashboard/dashboard', 'widgets/barChart/barChartWidget', 'widgets/donutChart/donutChartWidget', 'widgets/lineChart/lineChartWidget', 'widgets/map/mapWidget', 'widgets/timeRange/timeRangeWidget', 'widgets/timeSeriesChart/timeSeriesChartWidget'],
                exclude: ['Slipstream', 'vendor/vendorFiles', 'jquery', 'foundation', 'compiledWidgets', 'editable']
            }
          ],
          onBuildRead: function (id, path, contents) {
            // Exclude all files under vendor/blanket directory
              if (/vendor\/blanket\//.test(path)) {
                return " ";
              }
              // Exclude all files under widgets/*/react directory
              if (/widgets\//.test(path) && /\/react\//.test(path)) {
                  return " ";
              }
              // Work around for r.js bug.  See https://github.com/jrburke/requirejs/issues/1342
              if (id === 'select2') {
                return contents.replace(/define.amd\s*=\s*\{/, 'define.amdTEMP = {');
              }

              if ( /test\/run/.test(id)) {
                return contents.replace('#!/usr/bin/env node', '//#!/usr/bin/env node');
              }
              return contents;
          },
          // Work around for r.js bug.  See https://github.com/jrburke/requirejs/issues/1342
          onBuildWrite: function (id, path, contents) {
              // Work around for r.js bug.  See https://github.com/jrburke/requirejs/issues/1342
              if (id === 'select2') {
                return contents.replace(/define.amdTEMP\s*=\s*\{/, 'define.amd = {');
              }

              if (/extendedValidator/.test(id)) {
                var insert = "if (typeof define !== 'function') { var define = (function(){ return require('amdefine')(module, require);})();}";
                return insert.concat(contents);
              }
              return contents;
          }
        }
      },
      pretty:{
        options: {
          mainConfigFile: 'requireBuild.js',
          dir: 'dist/tmp/pretty',
          optimize: 'none',
          baseUrl: 'public/assets/js',
          findNestedDependencies: true,
          fileExclusionRegExp: /^\explorer|scss|css/,
          modules: [
            {
              name: 'vendor/vendorFiles'
            },
            {
                name: 'Slipstream',
                include: ['widgets/login/loginWidget'],
                exclude: ['jquery', 'vendor/vendorFiles']
            },
            {
                name: 'compiledWidgets',
                exclude: ['Slipstream', 'vendor/vendorFiles', 'jquery', 'foundation', 'widgets/login/loginWidget', 'widgets/dashboard/allDashboard', 'widgets/barChart/barChartWidget', 'widgets/donutChart/donutChartWidget', 'widgets/lineChart/lineChartWidget', 'widgets/map/mapWidget', 'widgets/timeRange/timeRangeWidget', 'widgets/timeSeriesChart/timeSeriesChartWidget']
            },
            {
                name: 'widgets/dashboard/allDashboard',
                include: ['widgets/dashboard/dashboard', 'widgets/barChart/barChartWidget', 'widgets/donutChart/donutChartWidget', 'widgets/lineChart/lineChartWidget', 'widgets/map/mapWidget', 'widgets/timeRange/timeRangeWidget', 'widgets/timeSeriesChart/timeSeriesChartWidget'],
                exclude: ['Slipstream', 'vendor/vendorFiles', 'jquery', 'foundation', 'compiledWidgets']
            }
          ],
          onBuildRead: function (id, path, contents) {
            // Exclude all files under vendor/blanket directory
              if (/vendor\/blanket\//.test(path)) {
                return " ";
              }
              // Work around for r.js bug.  See https://github.com/jrburke/requirejs/issues/1342
              if (id === 'select2') {
                return contents.replace(/define.amd\s*=\s*\{/, 'define.amdTEMP = {');
              }

              if ( /test\/run/.test(id)) {
                return contents.replace('#!/usr/bin/env node', '//#!/usr/bin/env node');
              }
              return contents;
          },
          onBuildWrite: function (id, path, contents) {
              // Work around for r.js bug.  See https://github.com/jrburke/requirejs/issues/1342
              if (id === 'select2') {
                return contents.replace(/define.amdTEMP\s*=\s*\{/, 'define.amd = {');
              }

              if (/extendedValidator/.test(id)) {
                var insert = "if (typeof define !== 'function') { var define = (function(){ return require('amdefine')(module, require);})();}";
                return insert.concat(contents);
              }
              return contents;
          }
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'tgz',
          archive: 'dist/<%= pkg.name %>.tar.gz'
        },
        src: ['dist/**']
      },
      total: {
        options: {
          mode: 'tgz',
          archive: 'dist/<%= pkg.name %>_total.tar.gz'
        },
        src: ['dist/all/**']
      },
      slipstream_sdk_OSX: {
        options: {
          mode: 'tar',
          archive: 'SlipstreamSDK_OSX.tar'
        },
        files: [{
          src: ['**'],
          cwd: 'public/slipstream_sdk_OSX/',
          expand: true
          }
        ]
      },
      slipstream_sdk_CentOS: {
        options: {
          mode: 'tar',
          archive: 'SlipstreamSDK_CentOS.tar'
        },
        files: [{
          src: ['**'],
          cwd: 'public/slipstream_sdk_CentOS/',
          expand: true
          }
        ]
      },
      slipstream_ui: {
        options: {
          mode: 'tar',
          archive: 'SlipstreamUI.tar'
        },
        files: [{
          src: ['**'],
          cwd: 'dist/ui/',
          expand: true
          }
        ]
      }
    },
    mochaTest: {
      'framework-server-unit-tests': {
        options: {
          reporter: 'spec',
          slow: 1000
        },
        src: ['test/unit/**/*.js']
      },
      'framework-server-functional-tests': {
        options: {
          reporter: 'spec',
          slow: 1000
        },
        src: ['test/functional/**/*.js']
      },
      'ci-framework-server-unit-tests': {
        options: {
          reporter: 'tap',
          captureFile: './framework-server-unit-tests.tap',
          slow: 1000
        },
        src: ['test/unit/**/*.js']
      },
      'ci-framework-server-functional-tests': {
        options: {
          reporter: 'tap',
          captureFile: './framework-server-functional-tests.tap',
          slow: 1000
        },
        src: ['test/functional/**/*.js']
      }
    },
    blanket_mocha: {
      test: {
        src: ["public/test/testRunnerIndex.html"]
      },
      options: {
        threshold: 90,
        run: false,
        reporter: 'List',
        bail: false,
        log: true,
        logErrors: true,
        excludedFiles: [
          "public/assets/js/vendor/"
        ],
        modulePattern: "./public/assets/js/(.*?)/"
      }
    },
    express: {
      slipstream: {
        options: {
          port: 3000,
          bases: path.resolve('public'),
          server: path.resolve('./app')
        }
      }
    },
    mocha_phantomjs: {
      all: {
        options: {
          reporter: 'spec',
          timeout: 60000,
          urls: ['http://localhost:3000/test/testRunnerIndex.html']
        }
      },
      ci: {
        options: {
          reporter: 'tap',
          timeout: 60000,
          output: './framework-client-unit-tests.tap',
          urls: ['http://localhost:3000/test/testRunnerIndex.html']
        }
      }
    },
    // Uni-test coverage Istanbul integration.
    instrument: {
        files : ['public/assets/js/widgets/**/*.js',
                 '!public/assets/js/widgets/**/react/**/*.js',
                 'public/assets/js/lib/**/*.js',
                 'public/assets/js/modules/**/*.js',
                 'public/assets/js/entities/**/*.js',
                 'public/assets/js/sdk/**/*.js',
                 'public/assets/js/apps/**/*.js'
                 ],
        options : {
          lazy : true,
          log: true,
          basePath : 'public/test/instrument/'
        }
    },
    connect: {
      server: {
        options: {
          port: 3000,
          base: 'public'
        }
      }
    },
    mocha: {
      test: {
        options: {
          urls: ['http://localhost:3000/test/codeCoverage.html'],
          reporter: 'Spec',
          log: true,
          logErrors: true,
          coverage: {
            jsonReport: 'test/results/coverage/json',
            htmlReport: 'test/results/coverage/html'
          }
        },
        dest: 'test/results/report/spec.out'
      }
    },
    retire: {
      js: ['public/assets/js/vendor/**'],
      node: ['node_modules/*'],
      options: {
        verbose: false,
        ignore: 'public/assets/js/vendor/MutationObserver.js/test,public/assets/js/vendor/blanket/test,public/assets/js/vendor/hogan.js/test,public/assets/js/vendor/modernizr/test'
      }
    },
    watch: {
      jsFiles: {
        files: ['lib/**/*.js', 'modules/**/*.js', 'routes/**/*.js', 'test/**/*.js', 'public/assets/js/**/*.js', 'public/assets/test/**/*.js', '!public/assets/js/vendor/**/*.js'],
        tasks: ['mochaTest:framework-server-unit-tests', 'mochaTest:framework-server-functional-tests', 'express:slipstream', 'mocha']
      }
    },
    sass: {
      options: {
        style: 'expanded',
        trace: 'true'
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'public/assets/css/',
          src: ['app.scss'],
          dest: 'dist/slipstream/stylesheets/',
          ext: '.css'
        }]
      },
      inplace: {
        files: [{
          expand: true,
          cwd: 'public/assets/css/',
          src: ['app.scss'],
          dest: 'public/assets/css/',
          ext: '.css'
        }]
      }
    },
    cssmin: {
      css: {
        src: 'dist/slipstream/stylesheets/app.css',
        dest: 'dist/slipstream/stylesheets/app.min.css'
      }
    },
    copy: {
      assetsfiles: {
        files: [{
          src: ['public/assets/js/**',
                '!public/assets/js/vendor/**',
                '!public/assets/js/widgets/**/*.js',
                '!public/assets/js/lib/**/*.js',
                '!public/assets/js/modules/**/*.js',
                '!public/assets/js/entities/**/*.js',
                '!public/assets/js/sdk/**/*.js',
                '!public/assets/js/apps/**/*.js'
          ],
          dest: 'public/test/instrument',
          expand: true
        }]
      },
      ui: {
        files: [
          {
            src: ['**', '!SlipstreamSDK.tar', '!SlipstreamUI.tar', '!node_modules/**', '!dist/**', '!scripts/**','!slipstream_sdk/**', '!public/slipstream_sdk/**', '!test/**', '!rpms/**', '!docs/**', '!Gruntfile.js', '!jsdoc.conf.json', '!slipstreamRequireBuildModules.js', '!public/test/**', '!public/help/**','!public/assets/js/Slipstream.js', '!public/assets/js/main.debug.js', '!public/assets/js/apps/**', '!public/assets/js/entities/**', '!public/assets/js/explorer/**', '!public/assets/js/modules/**', '!public/assets/js/sdk/**', '!public/assets/js/vendor/**', '!public/assets/js/widgets/**', '!public/assets/js/lib/**', 'public/assets/js/lib/validator/**', 'public/assets/js/lib/module_loader/**'],
            dest: 'dist/ui/',
            expand:true
          },
          {
            nonull: true,
            expand:true,
            src: ['main.js'],
            dest: 'dist/ui/public/assets/js/',
            cwd: 'public/assets/js',
            rename: function(dest, src) {
               var newPath = dest + "/" + src.replace('main.js', 'main.debug.js');
               return newPath;
            }
          },
          {
            nonull: true,
            expand:true,
            src: ['main.js'],
            dest: 'dist/ui/public/assets/js/',
            cwd: 'dist/slipstream/min'
          },
          {
            nonull: true,
            expand:true,
            src: ['Slipstream.min.js'],
            dest: 'dist/ui/public/assets/js/',
            cwd: 'dist/slipstream/min'
          },
          {
            nonull: true,
            expand:true,
            src: ['link.js', 'require.js', 'text.js'],
            dest: 'dist/ui/public/assets/js/vendor/require',
            cwd: 'public/assets/js/vendor/require'
          },
          {
            nonull: true,
            expand:true,
            src: ['vendorFiles.js'],
            dest: 'dist/ui/public/assets/js/vendor',
            cwd: 'dist/slipstream/min'
          },
          {
            nonull: true,
            expand:true,
            src: ['**'],
            dest: 'dist/ui/public/assets/js/vendor/',
            cwd: 'public/assets/js/vendor',
            filter: function(filepath) {
              if(filepath.match('.css') || filepath.match('.woff2') || filepath.match('editable.js') || filepath.match('svg4everybody.js') || filepath.match('backbone.syphon.js')){
                return true;
              }
              return false;
            },
            rename: function(dest, src) {
               var newPath = dest + src;
               return newPath;
            }
          },
          {
            nonull: true,
            expand:true,
            src: ['widgets.js'],
            dest: 'dist/ui/public/assets/js/widgets',
            cwd: 'dist/slipstream/min'
          },
          {
            nonull: true,
            expand:true,
            src: ['allDashboard.js'],
            dest: 'dist/ui/public/assets/js/widgets/dashboard',
            cwd: 'dist/slipstream/min'
          }
        ]
      },
      sdk: {
        files: [
          {
            src: ['app.js', 'config.js', 'package.json', 'public/**', 'README.md', 'scripts/**', 'modules/**', 'routes/**', 'lib/**', 'views/**', 'node_modules/**', 'appProvider/**', 'appRoutes/**'],
            dest: 'dist/sdk/',
            expand:true,
            filter: function(filepath) {
              // add plugins directory:
              if(filepath.match('public/assets/js/sdk')){
                return true;
              }

              return false;
            }
          }
        ]
      },
      minified: {
        files: [
          {
            src: ['app.js', 'config.js', 'package.json', 'public/**', 'README.md', 'scripts/**', 'modules/**', 'routes/**', 'lib/**', 'views/**', 'node_modules/**', 'appProvider/**', 'appRoutes/**'],
            dest: 'dist/mini/',
            expand:true,
            filter: function(filepath) {
              return true;
              var doNotSkip = true;
              // add plugins directory:
              if(filepath.match('test')){
                return true;
              }
              if(filepath.match('public/assets/js/apps')){
                return false;
              }
              if(filepath.match('public/assets/js/fake_data')){
                return false;
              }
              if(filepath.match('public/assets/js/modules')){
                return false;
              }
              if(filepath.match('public/assets/js/views')){
                return false;
              }
              if(filepath.match('public/assets/js/entities')){
                return false;
              }
              if(filepath.match('public/assets/js/sdk')){
                return false;
              }
              if(filepath.match('public/assets/js/widgets')){
                return false;
              }
              return doNotSkip;
            }
          },
          {
            nonull: true,
            expand:true,
            src: ['main.js'],
            dest: 'dist/mini/public/assets/js/',
            cwd: 'public/assets/js',
            rename: function(dest, src) {
               var newPath = dest + "/" + src.replace('main.js', 'main.debug.js');
               return newPath;
            }
          },
          {
            nonull: true,
            expand:true,
            src: ['main.js'],
            dest: 'dist/mini/public/assets/js/',
            cwd: 'dist/slipstream/min'
          },
          {
            nonull: true,
            expand:true,
            src: ['Slipstream.min.js'],
            dest: 'dist/mini/public/assets/js/',
            cwd: 'dist/slipstream/min'
          },
          {
            nonull: true,
            expand:true,
            src: ['vendorFiles.js'],
            dest: 'dist/mini/public/assets/js/vendor',
            cwd: 'dist/slipstream/min'
          },
          {
            nonull: true,
            expand:true,
            src: ['widgets.js'],
            dest: 'dist/mini/public/assets/js/widgets',
            cwd: 'dist/slipstream/min'
          },
          {
            nonull: true,
            expand:true,
            src: ['allDashboard.js'],
            dest: 'dist/mini/public/assets/js/widgets/dashboard',
            cwd: 'dist/slipstream/min'
          }
        ]
      },
      widgetlib: {
          files: [
              {
                  src: ['js/vendor/**', 'js/sdk/**', 'js/modules/i18n.js', 'js/modules/template_renderer.js', 'js/modules/view_adapter.js', 'js/lib/**', 'js/widgets/**'],
                  dest: 'dist/widgetlib/',
                  expand:true,
                  cwd: 'public/assets'
              },
              {
                  src: ['nls/**'],
                  dest: 'dist/widgetlib/assets',
                  expand:true,
                  cwd: 'public/assets'
              },
              {
                  src: ['build-info.json'],
                  dest: 'dist/widgetlib',
                  expand:true,
                  cwd: 'public/assets/js'
              },
              {
                  src: ['css/app.css'],
                  dest: 'dist/widgetlib',
                  rename: function(dest, src) {
                      return dest + "/" + src.replace(/app/, "slipstream");
                  },
                  expand:true,
                  cwd: 'public/assets'
              },
              {
                  src: ['js/Slipstream_widgetlib.js'],
                  dest: 'dist/widgetlib',
                  rename: function(dest, src) {
                      return dest + "/" + src.replace(/Slipstream_widgetlib/, "slipstream");
                  },
                  expand:true,
                  cwd: 'public/assets'
              },
              {
                  src: ['assets/images/**'],
                  dest: 'dist/widgetlib',
                  expand:true,
                  cwd: 'public'
              }
          ]
      },
      slipstream_sdk:{
        files: [
            {
              src: ['widgetlib/**'],
              dest: 'public/slipstream_sdk',
              expand:true,
              cwd: 'dist'
            },
            {
              src: ['explorer/**'],
              dest: 'public/slipstream_sdk',
              expand:true,
              cwd: 'public/assets/js/'
            },
            {
              src: ['scripts/plugin_manager.sh', 'scripts/minification.sh'],
              dest: 'public/slipstream_sdk/Plugin_Manager',
              expand:true

            }
          ]
      },
      sdk_OSX: {
        files: [
            {
              src: ['**'],
              dest: 'public/slipstream_sdk_OSX',
              expand: true,
              cwd: 'public/slipstream_sdk/'
            },
            {
              src: ['**'],
              dest: 'public/slipstream_sdk_OSX/dependency',
              expand: true,
              cwd: 'scripts/dependency_modules/dependency_OSX/'
            },
            {
              src: ['**'],
              dest: 'dist/slipstream_sdk_OSX',
              expand:true,
              cwd: 'slipstream_sdk/'
            }
        ]
      },
      sdk_CentOS: {
        files: [
          {
              src: ['**'],
              dest: 'public/slipstream_sdk_CentOS',
              expand: true,
              cwd: 'public/slipstream_sdk/'
            },
            {
              src: ['**'],
              dest: 'public/slipstream_sdk_CentOS/dependency',
              expand: true,
              cwd: 'scripts/dependency_modules/dependency_CentOS/'
            },
            {
              src: ['**'],
              dest: 'dist/slipstream_sdk_CentOS',
              expand:true,
              cwd: 'slipstream_sdk/'
            }
        ]
      }
    },
    jsdoc: {
      client: {
        src: ['public/assets/js/**/*.js', 'public/test/**/*.js', '!public/assets/js/vendor/**/*.js'],
        options: {
          destination: 'dist/documentation/api/client/'
        }
      },
      server: {
        src: ['lib/**/*.js', 'modules/**/*.js', 'routes/**/*.js'],
        options: {
          destination: 'dist/documentation/api/server/'
        }
      }
    },
    'exec': {
      deploy: {
        command: 'cd deploy && npm install && chmod +x scripts/launch_server.sh && npm start'
      },
      chgperm: {
         command: 'cd dist && find . -name \'*.sh\' | xargs chmod +x'
      },
      tarpkg:{
          command: 'tar cfz ./<%= pkg.name %>.tar.gz dist/*'
      },
      tarwidgets:{
          command: 'tar cfz ./slipstream_widgetlib.tar.gz dist/widgetlib/*'
      },
      createSDKinstaller_OSX:{
          command: 'cat SlipstreamSDK_OSX.tar >> dist/slipstream_sdk_OSX/sdk_installer.sh && chmod +x dist/slipstream_sdk_OSX/./sdk_installer.sh && chmod +x dist/slipstream_sdk_OSX/./dependency_installer.sh'
      },
      createSDKinstaller_CentOS:{
          command: 'cat SlipstreamSDK_CentOS.tar >> dist/slipstream_sdk_CentOS/sdk_installer.sh && chmod +x dist/slipstream_sdk_CentOS/./sdk_installer.sh && chmod +x dist/slipstream_sdk_CentOS/./dependency_installer.sh'
      }
    },
    svg_sprite : {
        /**
         * The background sprite contains those images that are library-managed and cannot be
         * transitioned to inline SVGs
         */
        bg: {
            expand : true,
            cwd : 'public/assets/images/background',
            src : ['icon_*.svg'],
            dest : 'public/assets',
            options : {
                mode : {
                  view: {
                       bust: false,
                       render: {
                           scss:  {
                               template: "public/assets/css/sprite_bg_tmpl.scss"
                           }
                       },
                       dest: 'css/sprite_bg',
                       sprite: '../../images/icon-bg-sprite.svg',
                       prefix: '.%s-bg'
                  }
                }
            }
        },
        inline: {
            expand : true,
            cwd : 'public/assets/images',
            src : ['icon_*.svg'],
            dest : 'public/assets',
            options : {
                mode : {
                  view: {
                       bust: false,
                       render: {
                          scss:  {
                              template: "public/assets/css/sprite_inline_tmpl.scss"
                          }
                       },
                       dest: 'css/sprite_inline',
                       prefix: '.%s',
                  },
                  symbol: {
                      bust: false,
                      sprite: '../images/icon-inline-sprite.svg',
                  }
                }
            }
        }
    },
 //assemble task
    assemble: {
      options: {
        flatten: true,
        helpers: 'public/assets/js/explorer/assemble/helpers/helper-*.js',
        //assets: 'public/assets/js/testPages/tabs/dest/assets',
        layoutdir: 'public/assets/js/explorer/assemble/layouts'
        //partials: ['public/assets/js/testPages/tabs/src/partials/*.hbs', './*.md']
      },
      html1: {
        options: {
          layout: 'documentation.hbs',
        },
        // files: {
        //   'public/assets/js/explorer/about/': ['public/assets/js/explorer/about/*.hbs']
        // }
        files:[
          {
            expand: true,
            cwd: 'public/assets/js/widgets/',
            src: ['*/tests/explorer/doc.hbs'],
            dest: 'public/assets/js/widgets/'
          }
        ]
      }
    }
  });

  // Load the plugin that provides the requirejs optimization task
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-writefile');

  // Plugin to launch a server
  grunt.loadNpmTasks('grunt-express');

  // Plugins related to testing
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks("grunt-blanket-mocha");

  // Plugins related to code coverage
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-istanbul');
  grunt.loadNpmTasks("grunt-mocha-phantom-istanbul");

  // Plugin for watch
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Sass plugin
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Misc plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('assemble'); //assemle plugin

  // Doc related plugin
  grunt.loadNpmTasks('grunt-jsdoc');

  // exec plugin
  grunt.loadNpmTasks('grunt-exec');

  // third-party code checks against
  grunt.loadNpmTasks('grunt-nsp-package');  // task: validate-package
  grunt.loadNpmTasks('grunt-retire');       // tasks: retire, retire:js, retire:node

  grunt.loadNpmTasks('grunt-svg-sprite');

  // Register test related tasks
  grunt.registerTask('framework-server-unit-tests', ['mochaTest:framework-server-unit-tests']);
  grunt.registerTask('ci-framework-server-unit-tests', ['mochaTest:ci-framework-server-unit-tests']);

  grunt.registerTask('framework-server-functional-tests', ['mochaTest:framework-server-functional-tests']);
  grunt.registerTask('ci-framework-server-functional-tests', ['mochaTest:ci-framework-server-functional-tests']);

  grunt.registerTask('framework-client-unit-tests', ['express:slipstream', 'mocha_phantomjs:all']);
  grunt.registerTask('ci-framework-client-unit-tests', ['express:slipstream', 'mocha_phantomjs:ci']);

  grunt.registerTask('unit-tests', ['mochaTest:framework-server-unit-tests', 'framework-client-unit-tests' /*, 'blanket_mocha'*/ ]);
  grunt.registerTask('ci-unit-tests', ['mochaTest:ci-framework-server-unit-tests', 'ci-framework-client-unit-tests' /*, 'blanket_mocha'*/ ]);
  grunt.registerTask('functional-tests', ['mochaTest:framework-server-functional-tests']);
  grunt.registerTask('ci-functional-tests', ['mochaTest:ci-framework-server-functional-tests']);

  grunt.registerTask('server-tests', ['mochaTest:framework-server-unit-tests', 'mochaTest:framework-server-functional-tests']);
  grunt.registerTask('client-tests', ['framework-client-unit-tests' /*, 'blanket_mocha'*/ ]);

  grunt.registerTask('ci-server-tests', ['mochaTest:ci-framework-server-unit-tests', 'mochaTest:ci-framework-server-functional-tests']);
  grunt.registerTask('ci-client-tests', ['ci-framework-client-unit-tests' /*, 'blanket_mocha'*/ ]);


  grunt.registerTask('tests', ['server-tests', 'client-tests']);

  grunt.registerTask('ci-tests', ['ci-server-tests', 'ci-client-tests']);

  // Register code coverage task
  grunt.registerTask('code-coverage', [/*'express:slipstream', */'copy:assetsfiles', 'instrument', 'mocha:test', 'clean:instrument']);

  // Register task for launching server
  grunt.registerTask('slipstream', ['express:slipstream', 'express-keepalive']);

  //Build Task
   grunt.registerTask('createbldinfo', 'Creating build information file', function(arg) {
    grunt.log.write("Build_Number is " );
    grunt.log.write(grunt.config('env')['dev']['build_number']);
    grunt.log.write('\r\n');
    grunt.log.write("Build_Timestamp is " );
    grunt.log.write(grunt.config('env')['dev']['build_timestamp']);
    grunt.log.write('\r\n');
    grunt.log.write("Build_Hash is " );
    grunt.log.write(grunt.config('env')['dev']['build_hash']);
    grunt.log.write('\r\n');
    grunt.log.write("Build_Version is " );
    grunt.log.write(grunt.config('env')['dev']['build_version']);
    grunt.log.write('\r\n');
    var info = '{\r\n"build_number": ',
        outfile = "public/assets/js/build-info.json";
    info += '"' + grunt.config('env')['dev']['build_number'] + '"';
    info += ',\r\n';
    info += '"build_timestamp": ';
    info += '"' + grunt.config('env')['dev']['build_timestamp'] + '"';
    info += ',\r\n';
    info += '"build_hash": ';
    info += '"' + grunt.config('env')['dev']['build_hash'] + '"';
    info += ',\r\n';
    info += '"build_version": ';
    info += '"' + grunt.config('env')['dev']['build_version'] + '"';
    info += '\r\n}';
    grunt.file.write( outfile, [info] );
   });

   grunt.registerTask('create_widgetlib_requireConf', 'Creating widgetlib require configuration', function(option) {
      var fs = require('fs'),
          path = require('path');

      var requireConf = JSON.parse(fs.readFileSync('public/assets/js/conf/requireConf.json', 'utf8'));
      var requireConfModule = "define(function() { return " + JSON.stringify(requireConf) + ";})";
      fs.writeFileSync('dist/widgetlib/js/requireConf.js', requireConfModule);
   })


grunt.registerTask('prepRJSBuild','Task that creates temporary files required for rjs optimizer', function(option){
  slipstreamBuildModule.prepRequireBuild(option);
});

grunt.registerTask('createRequirePaths', '', function(mode){
  slipstreamBuildModule.createRequirePaths(mode);
});

grunt.registerTask('cleanUpRequireBuild', 'Task to clean up temporary files required for rjs optimizer', function(option){
  slipstreamBuildModule.cleanUpRequireBuild(option);
});
  // Aggregate tasks

  // file massaging + requirejs
  grunt.registerTask('rjs-full', ['prepRJSBuild:full', 'requirejs', 'createRequirePaths:dev', 'createRequirePaths:prod', 'cleanUpRequireBuild:full']);

  grunt.registerTask('rjs-dev', ['prepRJSBuild:dev', 'requirejs:pretty', 'createRequirePaths:dev', 'cleanUpRequireBuild:dev']);

  grunt.registerTask('rjs-prod', ['prepRJSBuild:prod', 'requirejs:ugly', 'createRequirePaths:prod', 'cleanUpRequireBuild:prod']);

  // default task
  grunt.registerTask('default', ['clean', 'svg_sprite', 'sass', 'cssmin', 'rjs-prod', 'tests', 'copy']);

  // jenkins task
  grunt.registerTask('jenkins', ['clean', 'svg_sprite', 'sass', 'cssmin', 'rjs-prod' /*,'jsdoc'*/]);

  grunt.registerTask('copy_widgetlib', ['copy:widgetlib', 'create_widgetlib_requireConf']);

  grunt.registerTask('jenkinsCopy', ['copy:assetsfiles', 'copy:sdk', 'copy:ui', 'copy:minified', 'copy_widgetlib']);

  grunt.registerTask('nodespog', ['exec:chgperm', 'exec:tarpkg', 'exec:tarwidgets']);

  // perform checks for retired or vulnerable js-files or npm packages (third-party/open-source code)
  grunt.registerTask('check-thirdparty', ['validate-package', 'retire']);

  // Build task
  grunt.registerTask('build-all', ['ci-framework-server-unit-tests', 'mochaTest:ci-framework-server-functional-tests', 'ci-framework-client-unit-tests', 'jenkins']);

  // perform a full build.  An archived file of the entire dist folder will be created.
  grunt.registerTask('full', ['clean', 'svg_sprite', 'sass', 'cssmin', 'rjs-prod', 'tests', /*'jsdoc',*/ 'copy', 'compress']);

  // perform a build - no need to generate an uglified version of the js file.
  grunt.registerTask('dev', ['clean', 'svg_sprite', 'sass:inplace', 'rjs-dev']);

  // perform a build where the artifacts can be tested and validated after uglifying.
  grunt.registerTask('buildAllDist', ['clean',  'svg_sprite', 'sass', 'cssmin', 'rjs-prod', 'copy', 'compress']);
  grunt.registerTask('buildMinified', ['clean', 'svg_sprite', 'sass', 'cssmin', 'rjs-prod', 'copy:minified']);

  // create Slipstream_SDK
  grunt.registerTask('createUI',  ['compress:slipstream_ui']);
  grunt.registerTask('createSDK', ['copy:slipstream_sdk', 'copy:sdk_OSX', 'copy:sdk_CentOS', 'compress:slipstream_sdk_OSX', 'compress:slipstream_sdk_CentOS', 'exec:createSDKinstaller_OSX', 'exec:createSDKinstaller_CentOS', 'clean:slipstream_sdk']);
};

