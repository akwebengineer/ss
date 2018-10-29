#!/bin/bash

###############################################################################
# An installer script for Slipstream SDK. If no commandline argument is given, 
# this script will create a directory named SlipstreamSDK in current location.
# Absolute path of the directory is required if the SlipstreamSDK has to be created to a specific 
# location. The script will use a dependency installer script to install any dependency 
# required by plugin_manager tool. 
#
# Author: Sanket Desai <sanketdesai@juniper.net>
#
#
###############################################################################

SCRIPT=$0
SCRIPTPATH=$( cd $(dirname $SCRIPT) ; pwd )

if [[ "$1" != '' ]]; then
	DESTINATION="$1/SlipstreamSDK"
else
	DESTINATION="$SCRIPTPATH/SlipstreamSDK"
fi

mkdir -p ${DESTINATION}

TEMPFILE=`mktemp`

archive=$(awk '/^__ARCHIVE__/ {print NR + 1; exit 0; }' "${0}")

tail -n +$((archive)) $0 >> "$TEMPFILE"

tar -xvf "$TEMPFILE" -C ${DESTINATION}

rm "$TEMPFILE"

$SCRIPTPATH/./dependency_installer.sh

if [[ "$?" -eq '2' ]]; then
	echo "Error while installing dependencies"
	exit 1
else
	echo "Installation complete. Please refresh the bash or start working in new one."
	exit 0

fi

__ARCHIVE__
