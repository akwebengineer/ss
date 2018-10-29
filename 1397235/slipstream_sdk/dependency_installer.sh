#!/bin/bash

###############################################################################
# A script to install dependencies for plugin_manager utility. If Node and NPM is not installed
# this script will create or use the $HOME/local directory to install Node and NPM.
# For OSX, the homebrew package manager will be used for installing JQ command-line parser.    
#
# Author: Sanket Desai <sanketdesai@juniper.net>
#
#
###############################################################################

NODE_VERSION="v4.4.4"
NPM_VERSION="v2.15.1"
SED_VERSION="4.*.*"
SCRIPT=$0
SCRIPTPATH=$(dirname "$SCRIPT")
ABSOLUTEPATH=$( cd $(dirname $SCRIPT) ; pwd )
DEPENDENCY_DIR="$ABSOLUTEPATH/SlipstreamSDK/dependency"
ENV_FILENAME="sdk.env"
sourcefile="$HOME/local/$ENV_FILENAME"

# Function to set path in source file
function setPath {

	if [[ $IsJQInstalled -eq 1 || $IsNPMInstalled -eq 1 || $IsNodeInstalled -eq 1 ]]; then
		if [[ ":$PATH:" != *":$DEPENDENCY_DIR/bin:"* ]]; then
			echo "export PATH=$DEPENDENCY_DIR/bin:$PATH" >> "$sourcefile"
		fi
	fi
	
	if [ -z "$GSED" ]; then
    	  echo "export GSED=$SED" >> "$sourcefile"
	fi  

	source $sourcefile
}

# Function to install Node & NPM
function installNodeNPM {
       
        cd $DEPENDENCY_DIR
	    mv node/bin/node bin/
        ln -s $DEPENDENCY_DIR/node/lib/node_modules/npm/bin/npm-cli.js bin/npm
        chmod +x bin/node
        chmod +x bin/npm
	    cd $ABSOLUTEPATH
}


# Function to install jq command-line parser
function installJQ {

	cd $DEPENDENCY_DIR
	mv jq bin/
	chmod +x bin/jq
	cd $ABSOLUTEPATH

}

# Function to check if program is installed or not
function program_is_installed {
  
  local returnValue=1
  type $1 >/dev/null 2>&1 || { local returnValue=0; }
  return $returnValue
}

# Function to check Sed Version
function checkSedVersion {
  local Sed_V=$(sed --version 2>&1 | awk 'NR==1{print $NF}')

  if [[ $Sed_V != ${SED_VERSION} ]] ; then
     
      return 0;
     
  fi

  return 1;
}

# Function to install GNU-SED in local SDK environment
function installLocalGnuSed {

    if [[ -d "$DEPENDENCY_DIR/sed" ]]; then
    	cd "$DEPENDENCY_DIR/sed"
    	chmod +x ./configure
    	chmod -R 755 build-aux
    	./configure --prefix="$DEPENDENCY_DIR"/gnu-sed/
    	make install
    	cd $ABSOLUTEPATH
    	return 1
    else
    	return 0
    fi
}

# Function to print error and exit
function logError() {
 
  echo
  echo "ERROR:"
  echo $1
  echo 

  exit 2
}

if [[ ! -d "$HOME/local" ]]; then
	mkdir $HOME/local

fi

if [[ ! -f "$sourcefile" ]]; then
	touch "$sourcefile"
fi

if [[ ! -d "$DEPENDENCY_DIR/bin" ]]; then
	mkdir $DEPENDENCY_DIR/bin
fi

IsJQInstalled=0
program_is_installed jq
if [ $? -eq 0 ]; then
	installJQ
	IsJQInstalled=1
fi


IsNodeInstalled=0
program_is_installed node
if [ $? -eq 0 ]; then
	IsNodeInstalled=1
	installNodeNPM	
fi

IsNPMInstalled=0
program_is_installed npm
if [ $? -eq 0 ]; then
	IsNPMInstalled=1
	# if node is installed but npm is not installed, then extract the node and npm binary files and set path.
	if [ $IsNodeInstalled -eq 0 ]; then
		installNodeNPM
	fi
fi

sedInstalledBySDK=0
SED=`which sed`
checkSedVersion
if [ $? -eq 0 ] ; then
	echo "Installing sed 4.2.2"
	installLocalGnuSed
	if [ $? -eq 1 ]; then
		sedInstalledBySDK=1
		SED="$DEPENDENCY_DIR/gnu-sed/bin/sed"
		echo "--- sed Installed successfully"
	else
		logError "Error while installing GNU-SED"
	fi
fi

setPath


program_is_installed r.js
if [ $? -eq 0 ]; then
	if [[ $IsNPMInstalled -eq 1 ]]; then
		NPMPath=$DEPENDENCY_DIR/bin/npm
	else
		NPMPath=`which npm`
	fi
	$NPMPath install requirejs
fi
