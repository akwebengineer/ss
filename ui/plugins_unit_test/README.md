# Plugins unit-tests and code-coverage

In the ui folder, there is a plugins_unit_tests folder, which contains a node server and grunt files for running unit-tests and code-coverage for plugin files. Plugin developers write unit-tests (mocha-chai based code) under their plugin folder (like ui/testplugin/test/test_file1.js). These unit-test files need to be included in the plugins_unit_tests/public/main.js file, which calls the mocha.run() function.  

<br />
###Steps for plugin developers:
1. In terminal or command-prompt window, run cmd: ***npm install*** to get needed npm modules for node server and grunt.
2. In terminal or command-prompt window, run cmd: ***grunt get-widgetlib***, to get the slipstream's widgetlib (http://ssd-git-01.juniper.net:8080/SlipStream/nightly-builds/latest/SPoG_Framework.tar.gz) and expand widgetlib and slipstream SDk files.

#####See results in a browser window do following:
1. In terminal or command-prompt window, run cmd: ***node app.js***, which start this node server on port 4000).
2. In a browser, browse to url: ***http://localhost:4000***.
 
#####See results in a terminal or command-prompt windows do following:
4. In terminal or command-prompt window, run cmd: ***grunt unit-tests***.
5. In terminal or command-prompt window, run cmd: ***grunt code-coverage***.

###Steps for build system (ci):
Include following in the build script:
1. ***npm install***, needed to get needed third party libraries.
2. ***grunt runt-unit-tests***, runs the unit-tests and prints results to console.
3. ***grunt runt-unit-tests-ci***, runs the unit-tests and prints results to console and to the tap file: plugins-unit-tests.tap
4. ***grunt all***: runs the unit-tests and code-coverage and prints results to console.

<br />
####Links to some samples files:
1. To write some unit-tests, see: https://ssd-git.juniper.net/secmgt/ui/blob/orpheus/plugins/security-management/js/vpn/tests/extranetDevicesTests.js
2. To include your unit-tests files, see: https://ssd-git.juniper.net/secmgt/ui/blob/orpheus/plugins_unit_test/public/main.js

 
