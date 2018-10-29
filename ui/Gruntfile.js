var path = require('path');
var fs = require('fs');
module.exports = function (grunt) {

  var tasks = [], createTasks = function (minify) {

    var f , ll, moduleMap = {}, jsonFiles =  grunt.file.expand({cwd:'plugins'},"**/*plugin.json", "!dashboard/**/*"), plugin,
      _config = {
        clean: {
          release: ["dist"]
        },
        requirejs: {

        }

      };
    tasks = ['clean'];
    for (f = 0, ll = jsonFiles.length; f < ll; ++f) {
      plugin = grunt.file.readJSON('plugins/' + jsonFiles[f]);
      var activities = plugin.activities || [], i, l = activities.length, module;

      for (i = 0; i < l; ++i) {
        module = activities[i].module;
        if (moduleMap[module] === true) {
          continue;
        } else {
          moduleMap[module] = true;
        }
        grunt.log.writeln(module);

        moduleName = module.split('/');
        moduleName = moduleName[moduleName.length - 1];
        var temp = {
          options: {
            baseUrl: 'plugins',
            mainConfigFile: 'build/main.js',
            findNestedDependencies: true,
            name: jsonFiles[f].replace('/plugin.json', '') + '/js/' + module,
            out: 'dist/' + moduleName + '.combined.js',
            optimize: 'none'
          }
        }
        if (minify === true) {
          temp.options.optimize = 'uglify';
          temp.options.out = 'dist/' + moduleName + '.min.js';
          _config['requirejs']['ugly' + moduleName] = temp;
          tasks[tasks.length] = 'requirejs:' + 'ugly' + moduleName;
        } else {
          tasks[tasks.length] = 'requirejs:' + 'pretty' + moduleName;
          _config['requirejs']['pretty' + moduleName] = temp;
        }


      }

    }
    return _config;
  }
  grunt.registerTask('dev', 'This will combine all files but not minify', function () {

    var jsonFiles = grunt.file.expand("plugins/**/*plugin.json");

    var config = createTasks(false);
    grunt.initConfig(config);
    grunt.registerTask('pretty', tasks);
    grunt.task.run('pretty');

  });
  grunt.registerTask('min', 'This will combine all files and minify them', function () {

    var config = createTasks(true);
    grunt.initConfig(config);
    grunt.registerTask('ugly', tasks);
    grunt.task.run('ugly');

  });

  grunt.registerTask('merge', 'This will create a merged version of msgs.properties for every plugin', function(){
    var msgFiles = grunt.file.expand("plugins/**/*msg.json"), i, l, ll;


    grunt.log.writeln(msgFiles);
    for (i = 0,l = msgFiles.length; i <l ; ++i) {
      var filesToMerge = grunt.file.readJSON(msgFiles[i]).import, filePropertyMap = {};
      var msgFilePath = msgFiles[i].split('msg.json')[0];
      for (j=0, ll = filesToMerge.length; j < ll ; ++j) {
        var filePath = msgFilePath + filesToMerge[j];
        grunt.log.writeln(filePath);
        var eachFileContent = fs.readFileSync(filePath).toString();
        var array = eachFileContent.split("\n");
        for(line in array) {
          var text = array[line].trim();
          if(text.indexOf('#') !== 0 && text.indexOf('=') > -1) {
            //This is valid property
            var key = text.split('=')[0].trim();
            if(undefined !== filePropertyMap[key]) {
              grunt.fail.fatal(grunt.util.error('Duplicate key #' + key +'# in line # '+ line +' with line content##  ' + text +' in file ' + filePath));
            }
            filePropertyMap[key] = true;
          }
        }
        grunt.log.writeln('File parisng success for :: ' +  filePath);
        //If file parsing is successful then append the file content
        var combinedFileDir = msgFiles[i].split('msg.json')[0]+'/nls';
        var combinedFileName = combinedFileDir + '/msgs.properties';
        if(j === 0) {
          //First file to be merged means do a new file create
          try {
            if(fs.statSync(combinedFileName).isFile()) {
              fs.unlinkSync(combinedFileName);
              console.log("Existing file :: " + combinedFileName + ' deleted. An new file will be created');
            }
          } catch (e) {
            console.log("File :: " + combinedFileName + " does not exist. Will be created");
          }
        }
          var fileContentSep = "\n\n\n######This is System generated file##### Appended file :: " + filePath +"\n\n\n";
          try {
            fs.statSync(combinedFileDir).isDirectory();
          } catch (e){
            fs.mkdirSync(combinedFileDir);
          }
          fs.appendFileSync(combinedFileName, fileContentSep);
          fs.appendFileSync(combinedFileName, eachFileContent);
      }
    }
  });

  // Load the plugin that provides the requirejs optimization task
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-writefile');
  grunt.loadNpmTasks('grunt-contrib-clean');

};
