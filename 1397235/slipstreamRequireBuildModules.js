
var fs = require('fs'),
    path = require('path');

var prepRequireBuild = function(option) {
  (function compileDashboard() {
    var dashboardFiles = "['widgets/dashboard/dashboard', 'widgets/barChart/barChartWidget', 'widgets/donutChart/donutChartWidget', 'widgets/lineChart/lineChartWidget', 'widgets/map/mapWidget', 'widgets/timeRange/timeRangeWidget', 'widgets/timeSeriesChart/timeSeriesChartWidget']";
    var requireString = 'require(' + dashboardFiles + ');';
    fs.writeFileSync('public/assets/js/widgets/dashboard/allDashboard.js', requireString);
      console.log("***************************** Created allDashboard.js *****************************");
  })();

  (function compileWidgets() {
    var p = 'public/assets/js/widgets';
    var filesArr = [];
    var updatePaths = function(paths) {
      var requireString = 'require([' + paths + ']);';
      fs.writeFileSync(path.join(p,'widgets.js'), requireString);
      console.log("***************************** Created widgets.js *****************************");
    };
     var files = fs.readdirSync(p);

     for (var idx = 0, len = files.length; idx < len; idx++) {
          var file = files[idx];
          var fullPath = p + "/" + file;
          var temp;
          if (!(fs.statSync(fullPath).isFile())) {
            filesArr.push((function(){
              var fileName = [];
              fs.readdirSync(fullPath).forEach(function(widgetFile){
                if(/.js$/.test(widgetFile)) {
                  fileName.push('"' + path.join('widgets',file, widgetFile.replace('.js','')) + '"');
                }
              });
              return fileName;
            })());
          }
          if (idx + 1 === len) {
            updatePaths(filesArr);
          }
      }
  })();

  (function compileVendorFiles() {
    var requireString = 'require(["jquery",  "underscore", "backbone", "mockjax", "foundation.accordion", "foundation.dropdown", "jquery.toastmessage", "jqSvgdom"], function(){});';
    fs.writeFileSync('public/assets/js/vendor/vendorFiles.js', requireString);
      console.log("***************************** Created vendorFiles.js *****************************");
  })();

  (function createRequireBuildFile(){
      var rConf = JSON.parse(fs.readFileSync('public/assets/js/conf/requireConf.json', 'utf8'));
      rConf.paths['conf/global_config'] = "empty:";
      var requireConf = 'require.config(' + JSON.stringify(rConf) + ');';
      fs.writeFileSync('requireBuild.js', requireConf);
      console.log("***************************** Created requireBuild.js *****************************");
  })();

  (function createFinalBuildDirectories() {
    var paths =[];
    switch(option) {
      case 'dev':
        paths.push('dist');
        paths.push('dist/slipstream');
        paths.push('dist/slipstream/pretty');
        buildDir();
        break;
      case 'prod':
        paths.push('dist');
        paths.push('dist/slipstream');
        paths.push('dist/slipstream/min');
        buildDir();
        break;
      case 'full':
        paths.push('dist');
        paths.push('dist/slipstream');
        paths.push('dist/slipstream/pretty');
        paths.push('dist/slipstream/min');
        buildDir();
        break;
    }
    function buildDir(){
      paths.forEach(function(path) {
        if(!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
      });
    }
  })();
};

var createRequirePaths = function(mode) {
    var esprima = require('esprima');
    var fs =require('fs');
    var argPropName = 'arguments';
    var dir = (mode === 'prod') ? 'min' : 'pretty';
    var requireConf_Current = JSON.parse(fs.readFileSync('public/assets/js/conf/requireConf.json', 'utf8'));

    findRequireDepNames = function (fileContents, name) {
      var deps = [];

      traverse(esprima.parse(fileContents), function (node) {
        if (node && node.type === 'CallExpression' && node.callee &&
        node.callee.type === 'Identifier' &&
        node.callee.name ===  name &&
        node[argPropName] ) {
            for (var i = 0, len = node[argPropName].length; i < len; i++) {
                if (node[argPropName][i].type === 'ArrayExpression') {
                    var elems = node[argPropName][i].elements;
                    elems.forEach(function(elem) {
                        deps.push(elem.value);
                    });
                    break;
                }
            }
        }
      });

      var fn = new Date().getTime() + '.txt';

      fs.writeFileSync('TEMP/' + fn, deps);
      return deps;
    };

    getNamedDefine = function (fileContents, calleeName) {
        var name = [];
        traverse(esprima.parse(fileContents), function (node) {
          if (node && node.type === 'CallExpression' && node.callee &&
          node.callee.type === 'Identifier' &&
          node.callee.name === calleeName &&
          node[argPropName] && node[argPropName][0] &&
          node[argPropName][0].type === 'Literal') {
              name.push(node[argPropName][0].value);
          }
        });
        return name;
    };

    //From an esprima example for traversing its ast.
    function traverse(object, visitor) {
        var key, child;
        if (!object) {
            return;
        }
        if (visitor.call(null, object) === false) {
            return false;
        }
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                child = object[key];
                if (typeof child === 'object' && child !== null) {
                    if (traverse(child, visitor) === false) {
                        return false;
                    }
                }
            }
        }
    }

    (function init() {
        var requirePaths = {};
        var modules = [];
        var skipModules = ['vendor/vendorFiles'];
        var bldHash = JSON.parse(fs.readFileSync('public/assets/js/build-info.json', 'utf8')).build_hash;
        var cachebust = bldHash ? (".js?v=" + bldHash) : "";
        var origMain = "require(['/assets/js/vendor/vendorFiles.js" + cachebust.replace(".js", "") + "'],function(){" + fs.readFileSync('dist/tmp/' + dir + '/main.js', 'utf8') + "});";
        var fileNames = [
            {
                file: 'dist/tmp/' + dir + '/widgets/widgets.js',
                moduleId: 'widgets/widgets' + cachebust,
                depType: 'define'
            },
            {
                file: 'dist/tmp/' + dir + '/widgets/dashboard/allDashboard.js',
                moduleId: 'widgets/dashboard/allDashboard' + cachebust,
                depType: 'define'
            },
            {
                file: 'dist/tmp/' + dir + '/Slipstream.js',
                moduleId: 'Slipstream',
                depType: 'define'
            },
            {
                file: 'dist/tmp/' + dir + '/vendor/vendorFiles.js',
                moduleId: 'vendorFiles',
                depType: 'define'
            }];

        fileNames.forEach(function (fileName) {
            var data = fs.readFileSync(fileName.file);
            modules = getNamedDefine(data, fileName.depType);
            modules.forEach(function (moduleId) {
                if (skipModules.indexOf(moduleId) < 0) {
                    requireConf_Current.paths[moduleId] = fileName.moduleId;
                }
            });
            requireConf_Current.paths['Slipstream'] = 'Slipstream.min' + cachebust;
            requireConf_Current.paths['conf/global_config'] = 'conf/global_config' + cachebust;
            requireConf_Current.paths['widgets/dashboard/dashboard'] = 'widgets/dashboard/allDashboard' + cachebust;
        });

        var definiton = "define('text!conf/requireConf.json',[],function () { return '" + JSON.stringify(requireConf_Current) + "';});";

        console.log('Updating requireConf.json');
        console.log('---------------------------');
        fs.writeFileSync(path.join('dist/tmp', dir, 'conf', 'requireConf.json'), JSON.stringify(requireConf_Current, null, 2));
        fs.writeFileSync(path.join('dist/tmp', dir, 'main.js'), definiton.concat(origMain));
        console.log('DONE!');
        console.log('---------------------------');
    })();
};


var cleanUp = function(option) {
    var fs= require('fs');
    var paths = [];
    var devPaths = [
      {
        source: 'dist/tmp/pretty/main.js',
        destination: 'dist/slipstream/pretty/main.js'
      },
      {
        source: 'dist/tmp/pretty/Slipstream.js',
        destination: 'dist/slipstream/pretty/Slipstream.min.js'
      },
      {
        source: 'dist/tmp/pretty/vendor/vendorFiles.js',
        destination: 'dist/slipstream/pretty/vendorFiles.js'
      },
      {
        source: 'dist/tmp/pretty/widgets/widgets.js',
        destination: 'dist/slipstream/pretty/widgets.js'
      },
      {
        source: 'dist/tmp/pretty/widgets/dashboard/allDashboard.js',
        destination: 'dist/slipstream/pretty/allDashboard.js'
      }];

      var prodPaths = [
      {
        source: 'dist/tmp/min/main.js',
        destination: 'dist/slipstream/min/main.js'
      },
      {
        source: 'dist/tmp/min/Slipstream.js',
        destination: 'dist/slipstream/min/Slipstream.min.js'
      },
      {
        source: 'dist/tmp/min/vendor/vendorFiles.js',
        destination: 'dist/slipstream/min/vendorFiles.js'
      },
      {
        source: 'dist/tmp/min/widgets/widgets.js',
        destination: 'dist/slipstream/min/widgets.js'
      },
      {
        source: 'dist/tmp/min/widgets/dashboard/allDashboard.js',
        destination: 'dist/slipstream/min/allDashboard.js'
      }];

    (function createFinalBuildDir() {
      switch(option) {
        case 'dev':
          paths = paths.concat(devPaths);
          break;
        case 'prod':
          paths = paths.concat(prodPaths);
          break;
        case 'full':
          paths = paths.concat(prodPaths, devPaths);
          break;
      }
      var pathLen = paths.length;
      paths.forEach(function(path) {
        console.log('working on ' + path.source);
        fs.writeFileSync(path.destination, fs.readFileSync(path.source));
        pathLen --;
        if(pathLen === 0) {
          removeDistSlipstreamDirPostBuildAndCopy('dist/tmp');
        }
      });
    })();

    function removeDistSlipstreamDirPostBuildAndCopy(path){
      if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
          var curPath = path + "/" + file;
          if(fs.lstatSync(curPath).isDirectory()) { // recurse
            removeDistSlipstreamDirPostBuildAndCopy(curPath);
          } else { // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(path);
      }
    };

    (function deleteTempFiles(){
      var files = ['requireBuild.js', 'public/assets/js/widgets/widgets.js', 'public/assets/js/widgets/dashboard/allDashboard.js', 'public/assets/js/vendor/vendorFiles.js'];
      files.forEach(function(file) {
        console.log("-------- Deleting File: " + file + " --------");
        fs.unlinkSync(file);
      });
        console.log("-------- DONE --------");
    })();
};


module.exports = {
    prepRequireBuild: prepRequireBuild,
    createRequirePaths: createRequirePaths,
    cleanUpRequireBuild: cleanUp
}