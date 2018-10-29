# Dev Environment

To setup the dev environment for Slipstream framework for the first time:

1. Install [Node version 6](https://nodejs.org/en/download/releases/)
2. Make sure your path can find the node and npm commands by adding export PATH="/usr/local/bin:$PATH" to .profile, .bashrc, etc. If all is good, 'node --version' and 'npm --version' should work
3. Install grunt-cli
   * Run ```npm install -g grunt-cli```
4. Grab the slipstream framework from ssd-git or the build tarball
5. Install necessary components for CSS generation
   We use sass to convert .scss files to .css as browsers still understand only CSS
   * Install Ruby
   * Install Ruby Gems
   * Install sass by running '[sudo] ```gem install sass -v 3.2.13```'
   ** Versions of ruby sass greater than 3.2.13 may not work well
6. Install the project dependencies.
   * Run ```npm install```
7. Generate CSS
   * Run ```grunt svg_sprite```
   * Run ```grunt sass:inplace```
8. Install Redis Database
   * Redhat
     * sudo rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-6.rpm  
     * yum install redis -y
   * OSX (using [homebrew](https://brew.sh))
     * brew install redis
9. Start the Redis Database in a seperate shell
   * redis-server
10. Start the Slipstream server
    * Run ```node app.js``` or ```grunt slipstream```
11. Browse to http://localhost:3000