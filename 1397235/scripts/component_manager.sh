#!/bin/bash

###############################################################################
# Utility script to hoist component's metadata into plugin's manifest file
#
# Author: Sanket Desai <sanketdesai@juniper.net>
#
###############################################################################

PLUGIN=$1
PLUGIN_NAME=`echo $PLUGIN | awk -F'/' '{print $NF}'`
component_file="component.json"
plugin_file="plugin.json"
component_dir="$PLUGIN/shared/components"

declare -a component_name component_loader

function exists () {

	if [[ -d $component_dir ]]; then
		return 1
	else 
		return 0
	fi
}

function fullLoaderPath () {

	local component_name=$1
	local loader_file=$2
	if [[ $loader_file == *\/* ]];
	then
  		echo $loader_file
  	else
  		echo $PLUGIN_NAME/shared/components/$component_name/js/$loader_file
	fi

}

function parseComponent () {

	local COMPONENT_JSON=`jq -s . $(find $component_dir -maxdepth 2 -type f -iname '*.json')`
	
	COMPONENT_JSON=$(echo "$COMPONENT_JSON" | jq -rc '.[]' | while IFS='' read pair;do
	    loaderFile=$(echo $pair | jq -r .loader)
	    name=$(echo $pair | jq -r .name)
	    loaderFullPath=$(fullLoaderPath $name $loaderFile)
	    modified_stack=$(echo "$pair" | jq ".loader=\"$loaderFullPath\"")
	    echo $modified_stack
		done)

	COMPONENT_METADATA=`echo "$COMPONENT_JSON" | jq -s .`
}

function modifyPluginFile () {

	local json_data=$(cat "$PLUGIN/$plugin_file" | jq '')
	json_data=$(echo "$json_data" | jq ".shared.components=$COMPONENT_METADATA")
	echo "$json_data" >> "$PLUGIN/plugin-temp.json"
	mv "$PLUGIN/plugin-temp.json" "$PLUGIN/plugin.json"

}

echo "Starting component manager"	
exists
if [ "$?" -eq "1" ]; then
	echo "---Shared component directory found"
	parseComponent 
	modifyPluginFile
else
	exit 0
fi

