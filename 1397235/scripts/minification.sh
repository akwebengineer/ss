#!/bin/bash

###############################################################################
# A script to minify plugin files.  This script
# will create a build directory which will be used by R.js optimizer.  
# The script will require plugin's directory as an argument. plugin-directory 
# must exist in current working directory. 
#
# Author: Sanket Desai <sanketdesai@juniper.net>
#
#
###############################################################################



declare -a empty_paths global_array unique_define_calls unique_modules_path

###################################
# Array discription

# global_array: contains define calls for all .js files inside plugin
# empty_paths:  contains define calls for the framework files. The element of this array will be a string having one key and a value.
#			   	for example, for 'backbone' define call, the string will be -> 'backbone': 'empty:'
# unique_define_calls: This array will contain all unique define calls. The array will be used to generate the final string 
# 						which will be written to build.js file, so that the define calls won't be repeated. 
# unique_modules_path: This array will have actual path of the plugin's activity modules (if specified in plugin.json file)			
###################################

SCRIPT=$0
SCRIPTPATH=$( cd $(dirname $SCRIPT) ; pwd )
PLUGIN="$SCRIPTPATH/$1"
PLUGIN_NAME=`echo $PLUGIN | awk -F'/' '{print $NF}'`
PLUGIN_JSON="$PLUGIN/plugin.json"
PLUGIN_MAIN="$PLUGIN_NAME-main.js"
BUILD_DIR=$2
VERBOSE=$3
sourcefile="$HOME/local/sdk.env"

# Function to create build directory in plugin
function create_build_dir () {
	if [[ ! -d "$BUILD_DIR" ]]
	then
	        if [[ ! -L $BUILD_DIR ]]
	        then
	                mkdir $BUILD_DIR
	                return 1
	        else
	                return 0
	        fi

	fi

	if [[ -f "$sourcefile" ]]; then
		source "$sourcefile"
	else
		echo "environment file not found. Some commands may fail."
	fi

}

# Function to parse all .js files in a plugin and return 'define' calls. This function needs filename as an argument.
function parse () {
	# sed to identify define calls from given .js file. 
	# GNU-SED is required for this script to work.
	
	local define_call=$($GSED '/\(define\|require\)(/!d;s//&\n/;s/.*\n//;:a;/function/bb;$!{n;ba};:b;s//\n&/;P;D' $1) 
	
	# formatted_define_call is a string of all define calls for a given .js module
	# For example, 
	# 		define([
    #     		'backbone',
    #     		'widgets/dashboard/dashboard',
    #			'./views/dashboardView.js'
	# 		], function(Backbone, Dashboard)
	#
	# formatted_define_call's value for this define call will be 
	#	=>  backbone, widgets/dashboard/dashboard, ./views/dashboardView.js

	local formatted_define_call=$(echo "$define_call"|tr -d '"()[]\n[[:space:]]'\')
	echo "$formatted_define_call"
}

# Function to loop through plugin.json file and find activity modules. 
function get_plugin_activity_modules () {
	if [ -f "$PLUGIN_JSON" ];
	then
		local activities=( $(cat "$PLUGIN_JSON" | jq '.activities[] .module') )
		unique_modules_path=( $(printf '%s\n' "${activities[@]}" | sort -u | $GSED 's/^"\(.*\)"$/\1/') )
		return 1
	else
		return 0
	fi	
}

# Function to create plugin-main.js file. This file will be created in plugin/build directory
function create_plugin_main () {
	
	# --------------Child modules will have only the modulename for activity module-------------
	local CHILD_MODULES=$(printf ",'./%s'" "${unique_modules_path[@]}")
	CHILD_MODULES=${CHILD_MODULES:1}

	# -----------------Writing plugin-main.js file ------------------------------------
	cat << EOF > $BUILD_DIR/$PLUGIN_MAIN
	require([$CHILD_MODULES], function() {

	});
EOF
}

function resolve_dependency () {

	if [ -f "$SCRIPTPATH/dependency_modules/text.js" ]; 
	then
		cp $SCRIPTPATH/dependency_modules/text.js $BUILD_DIR/$PLUGIN_NAME/js/
	fi

}

function containsElement () {
	local define_call=$1
	define_call=$(echo "$define_call" | awk -F'/' '{print $NF}')
	local pluginFile

	for  pluginFile in "${plugin_file_names[@]}";
	do
		if [[ "$pluginFile" == "$define_call" ]];
		then
			return 1  		
		fi
	done

	return 0
}

function modify_plugin_json () {
	local json_data=$(cat "$PLUGIN_BUILD_JSON" | jq '')
	local activity_module=( $(echo "$json_data" | jq '.activities[] .module') )
	local moduleAlias=""
	for ((i=0;i<${#activity_module[@]};++i));    
	do
		moduleAlias=$(printf "%s" "${activity_module[i]}" | awk -F'/' '{print $NF}' | tr -d '"')
		moduleAlias='"'"$moduleAlias"'"'
		json_data=$(echo "$json_data" | jq ".activities[$i].moduleAlias = $moduleAlias")
	done
	echo "$json_data" >> "$BUILD_DIR/$PLUGIN_NAME/plugin-temp.json"
	mv "$BUILD_DIR/$PLUGIN_NAME/plugin-temp.json" "$BUILD_DIR/$PLUGIN_NAME/plugin.json"
}

# Function to identify require calls for framework files and replace them with 'empty' directives
function create_empty_modules () {
	local counter=0
	
	for ((i=0;i<${#unique_define_calls[@]};++i));
	do

		#Approach 1: Identify framework files using alias
			
			# if [[ ${unique_define_calls[i]} != '' ]];
			# 	then
			# 	check_relative_path=$(echo "${unique_define_calls[i]}" | awk '{print substr($0,0,2)}')
			# 	check_js=$(echo "${unique_define_calls[i]}" | awk '{print substr($0,length-2,3)}')
			# 	check_template=$(echo "${unique_define_calls[i]}" | awk '{print substr($0,0,4)}')

			# 	if [[ $check_template != "text" && $check_relative_path != ./ && $check_js != *.js && $check_relative_path != // ]]; 
			# 	then 
			# 		empty_paths[$counter]=$(printf "'%s': '%s'" "${unique_define_calls[i]}" "empty:")
			# 		counter=$((counter+1))
			# 	fi
			# fi 

		#--------------------------------------------------

			if [[ ${unique_define_calls[i]} != '' ]];
			then
				local check_relative_path=$(echo "${unique_define_calls[i]}" | awk '{print substr($0,0,1)}')
				containsElement ${unique_define_calls[i]}
				if [[ "$?" -eq "0" ]]; then
	  				empty_paths[$counter]=$(printf "'%s': '%s'" "${unique_define_calls[i]}" "empty:")
					counter=$((counter+1))
	  			fi
  			fi

	done
}

# Function to create a build.js file. The file will be created in Plugin/build directory
function create_build_file () {

	cat << EOF > $BUILD_DIR/build.js
	{
		 baseUrl: "$BUILD_DIR/$PLUGIN_NAME/js",
		 name: "$PLUGIN_NAME-main",
		 out: "$BUILD_DIR/$PLUGIN_NAME.min.js",

		 paths: {
		 	'$PLUGIN_NAME-main': '$BUILD_DIR/$PLUGIN_NAME-main',
		 	 $empty_build_path
		 }
	}
EOF

}

function logError() {
 
  echo
  echo "ERROR:"
  echo $1
  echo 

  exit
}

# Function to create final plugin for delivery
function move () {
	
	if [ -f $BUILD_DIR/"$PLUGIN_NAME.min.js" ]; then
		mv $BUILD_DIR/"$PLUGIN_NAME.min.js" $PLUGIN_BUILD_DIR/js/
	else
		logError "Minification is failed"
	fi

	if [ -f "$SCRIPTPATH/dependency_modules/text.js" ]; then
		rm $BUILD_DIR/$PLUGIN_NAME/js/text.js
	fi
}

# Function to clean the build directory after minification is done
function clean () {

	if [ -d "$BUILD_DIR" ] ; then
		rm -rf $BUILD_DIR
	fi

}

# Function to package the plugin
function create () {
  
   cd "$BUILD_DIR"
   echo "Creating plugin file $PLUGIN_NAME.spi"
  
   local PLUGIN_JSON_PATH="$PLUGIN_NAME/plugin.json"

    if [ ! -f "$PLUGIN_JSON_PATH" ] ; then
         echo "plugin.json does not exist. Plugin creation failed."
         exit 1
    fi

    local json_data=$(cat $PLUGIN_JSON_PATH | jq '')
	BUILD_HASH=$(uuidgen)
    BUILD_HASH='"'"$BUILD_HASH"'"'
    json_data=$(echo "$json_data" | jq ".BUILD_HASH = $BUILD_HASH")

    local SASS=`which sass`
    local SCSS="$PLUGIN_NAME/css/$PLUGIN_NAME.scss"
    local CSS="$PLUGIN_NAME/css/$PLUGIN_NAME.css"
 	local TMP_SCSS="$PLUGIN_NAME/css/$PLUGIN_NAME-ns.scss"

    if [ $? -ne 0 ] ; then
        log "---sass command is required but not found in PATH. Please install sass or add it to your PATH"
        exit 1
    fi

    if [ ! -d "$PLUGIN_NAME" ] ; then
        log "---Plugin directory does not exist. Plugin creation failed."
        exit 1
    fi

    # @TODO Move to a grunt process that is run at build time
    if [ -r $SCSS ] ; then
        # Add namespace
        rm -f ${TMP_SCSS}
        cp $SCSS ${TMP_SCSS}

        $GSED -i "1s/^/\.$PLUGIN_NAME {/" ${TMP_SCSS}
        $GSED -i "\$s/\$/}/" ${TMP_SCSS}

        # Compile CSS
        $SASS "${TMP_SCSS}:$CSS"
        if [ $? -ne 0 ] ; then
            log "---There were errors compiling scss"
            log "---Command $SASS \"${TMP_SCSS}:$CSS\""
        fi
    fi

    #Writes plugin build hash in Current_build_directory/Plugin/plugin.json
    echo "$json_data" >> "$PLUGIN_NAME/plugin-temp.json"
	mv "$PLUGIN_NAME/plugin-temp.json" "$PLUGIN_JSON_PATH"

    zip -q -r $PLUGIN_NAME".spi" $PLUGIN_NAME
    cp $PLUGIN_NAME".spi" $SCRIPTPATH
    cd "$SCRIPTPATH"
    log "---Plugin is packaged successfully"
}

function log () {

	[[ $VERBOSE == 1 ]] && echo "$1"
}

log "1. Creating list for plugin files"
plugin_file_paths=( $(find $PLUGIN -type f \( ! -name "*.svg" ! -name "*.png" ! -name "*.jpg" \)) )
plugin_file_names=( $(printf '%s\n' "${plugin_file_paths[@]}" | awk -F'/' '{print $NF}') )

log "2. Creating build directory"
create_build_dir
if [ "$?" -eq "1" ]; then
		log "---build directory created"
	else
		log "---build directory exists"
	fi

cp -r $PLUGIN $BUILD_DIR
PLUGIN_BUILD_DIR="$BUILD_DIR/$PLUGIN_NAME"
PLUGIN_BUILD_JSON="$PLUGIN_BUILD_DIR/plugin.json"

log "3. Finding plugin activity modules"
get_plugin_activity_modules
if [ "$?" -eq "1" ]; then
		log "---Found plugin activity modules"
	else
		log "---plugin.json doesn't exists"
	fi

log "4. Creating plugin-main.js file"
create_plugin_main

var=0
for f in $(find $PLUGIN/js -type f -name "*.js");
do
	# Call the parse funtion to find define calls for each plugin file
	define_calls=$(parse "$f") ;
	if [[ $define_calls != '' ]];
	then
		
		IFS=',' read -r -a arr <<< "$define_calls"
		
		for ((i=0;i<${#arr[@]};++i));
			do
				
				global_array[$var]=$(printf "%s " "${arr[i]}" | tr -d ' ')
				var=$((var+1))
			done
	fi
done

unique_define_calls=( $(printf "%s\n" "${global_array[@]}" | sort -u) )

log "5. Identifying require calls for framework files and create empty paths"
create_empty_modules

empty_build_path=$(printf ",\n%s" "${empty_paths[@]}")
empty_build_path=${empty_build_path:1}

log "6. Creating build.js file"
create_build_file

log "7. Resolving dependencies"
resolve_dependency

log "7. Executing r.js optimizer"
r.js -o $BUILD_DIR/build.js

log "8. Modifying plugin.json file"
modify_plugin_json

log "9. Creating final plugin to deliver"
move 

log "10. Packaging the plugin"
create

log "11. Cleaning build directory"
clean

