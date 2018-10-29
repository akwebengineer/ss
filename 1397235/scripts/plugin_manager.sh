#!/bin/bash

###############################################################################
# Utility script to manage plugin installation and uninstallation.
#
# Authors: Kiran Kashalkar <kkashalkar@juniper.net>
#        : Dennis Park     <dpark@juniper.net>
#        : Miriam Hadfield <mhadfield@juniper.net>
#
###############################################################################

SCRIPT=$0
SCRIPTPATH=$(dirname "$SCRIPT")
ABSOLUTEPATH=$( cd $(dirname $SCRIPT) ; pwd )
INSTALLPATH="$SCRIPTPATH/../public/installed_plugins"
PUBLICPATH="$SCRIPTPATH/../public"
CSSFILEPATH="$PUBLICPATH/assets/css/installed_plugins.scss"
CREATE_PLUGIN=0
MINIFY_PLUGIN=0
VERBOSE=0

function usage () {
   cat <<EOF
Run this script from the base directory
Usage:
$SCRIPT [-h] | [[-i | -u | -d] plugin-name] | [-c plugin-directory] | [-c -m plugin-directory] | [-c -m plugin-directory build-directory]
   -i   installs a specified plugin; plugin-name.spi must exist.
   -u   updates a specified plugin, if found in system;
        plugin-name.spi must exist.
   -d   uninstalls plugin, if found.
   -c   creates a plugin package (.spi) from specified
        plugin-directory, if found.
        plugin-directory must exist in current working directory.
   -m   creates a minified version of plugin, if used with '-c'.
        creates a plugin package (.spi) from specified
        plugin-directory, if found.
        build-directory argument is optional but full path is required if provided.
   -h   displays this help content.
   -v   displays verbose output for minification when used with '-c -m'
EOF
   exit 0
}

function install () {
    echo "Installing plugin $1..."

    if [ ! -d "$2" ] ; then

        echo "Unpacking plugin..."
        unzip -q -n $1".spi" -d $INSTALLPATH
        echo "Done unpacking plugin..."
        PLUGIN_NAME=`echo $1 | awk -F'/' '{print $NF}'`

        #Getting build_hash from plugin.json
        PLUGIN_JSON=$INSTALLPATH/$PLUGIN_NAME/"plugin.json"
        local build_hash=$(cat "$PLUGIN_JSON" | jq '.BUILD_HASH')

        if [ ${build_hash:+1} ]; then
            plugin_build_hash=${build_hash}
            plugin_build=$(echo "$plugin_build_hash" | tr -d '"')
        else
           plugin_build=$(uuidgen)
        fi
        # Check for plugin supplied CSS
        if [ -r $INSTALLPATH"/"$PLUGIN_NAME"/css/"$PLUGIN_NAME".css" ] ; then
            local CSS_IMPORT="@import url('/installed_plugins/"$PLUGIN_NAME"/css/"$PLUGIN_NAME".css?v="$plugin_build"');"
            local INSTALLED_PLUGINS_CSS=$PUBLICPATH"/assets/css/plugins/installed_plugins.css"
            # Add import to app.css
            awk '!done { print "'"$CSS_IMPORT"'"; done=1;}; 1;' $INSTALLED_PLUGINS_CSS > tmp && mv tmp $INSTALLED_PLUGINS_CSS
        fi
    else
        echo "Plugin already exists. Please use update option to update."
    fi
}

function minify () {
    echo "Minifying plugin..."
    if [ $# -lt 1 ]; then
      echo "No plugin directory name is provided"
    else
      local PLUGIN_TO_MINIFY=$1
      local BUILD_DIRECTORY=''
      if [[ "$2" != "" ]]; then
        BUILD_DIRECTORY=$2
      else
        BUILD_DIRECTORY=`mktemp -d`
      fi

      chmod +x /$ABSOLUTEPATH/minification.sh
      /$ABSOLUTEPATH/minification.sh $PLUGIN_TO_MINIFY $BUILD_DIRECTORY $VERBOSE
    fi
}

function update () {
    echo "Update not supported, delete and install again"

    if [ ! -d "$2" ] ; then
        echo "Plugin does not exist. Please use install option to install."
    else
        unzip -qq -u $1".spi" -d $INSTALLPATH

        PLUGIN_NAME=`echo $1 | awk -F'/' '{print $NF}'`
        sed -i -bak "/.$PLUGIN_NAME{/d" $CSSFILEPATH
        PLUGIN_CSSPATH=`ls $INSTALLPATH'/'$PLUGIN_NAME'/css/'`
        PLUGIN_IMPORT_CSSPATH=`echo '.'$PLUGIN_NAME'{'`
        for FILE in $PLUGIN_CSSPATH
        do
          PLUGIN_IMPORT_CSSPATH+=`echo '@import "../../installed_plugins/'$PLUGIN_NAME'/css/'$FILE'";'`
        done
        PLUGIN_IMPORT_CSSPATH+=`echo '}'`
        echo $PLUGIN_IMPORT_CSSPATH >> $CSSFILEPATH

        echo "Done. Please check for errors above."
    fi
}

function uninstall () {
    echo "Uninstalling plugin $1..."

    if [ ! -d "$2" ] ; then
        echo "Plugin does not exist. Uninstall failed."
        exit 1
    fi

    # Remove plugin provided css
    local INSTALLED_PLUGINS_CSS=$PUBLICPATH"/assets/css/plugins/installed_plugins.css"
    echo "Removing plugin supplied CSS ..."
    grep -v $1".css" $INSTALLED_PLUGINS_CSS > tmp && mv tmp $INSTALLED_PLUGINS_CSS

    rm -rf $2
    echo "Done. Please check for errors above."
}

function create () {
    echo "Creating plugin file $1.spi from directory $1..."
    PLUGIN_JSON=$ABSOLUTEPATH/$1/"plugin.json"

    if [ ! -f "$PLUGIN_JSON" ] ; then
         echo "plugin.json does not exist. Plugin creation failed."
         exit 1
    fi

    local json_data=$(cat $PLUGIN_JSON | jq '')
	BUILD_HASH=$(uuidgen)
    BUILD_HASH='"'"$BUILD_HASH"'"'
    json_data=$(echo "$json_data" | jq ".BUILD_HASH = $BUILD_HASH")
    PLUGIN_BUILD_DIRECTORY=`mktemp -d`

    local SASS=`which sass`
    local SCSS="$1/css/$1.scss"
    local CSS="$1/css/$1.css"
    local TMP_SCSS="$1/css/$1-ns.scss"

    if [ $? -ne 0 ] ; then
        echo "sass command is required but not found in PATH. Please install sass or add it to your PATH"
        exit 1
    fi

    if [ ! -d "$1" ] ; then
        echo "Plugin directory does not exist. Plugin creation failed."
        exit 1
    fi

    # @TODO Move to a grunt process that is run at build time
    if [ -r $SCSS ] ; then
        rm -f ${TMP_SCSS}
        cp $SCSS ${TMP_SCSS}
        # Add namespace
        sed -i -e "1s/^/\.$1 {/" ${TMP_SCSS}
        sed -i -e "\$s/\$/}/" ${TMP_SCSS}

        # Compile CSS
        $SASS "${TMP_SCSS}:$CSS"
        if [ $? -ne 0 ] ; then
            echo "There were errors compiling scss"
            echo "Command $SASS \"${TMP_SCSS}:$CSS\""
        fi

        if [ -f "$TMP_SCSS-e" ] ; then
          rm "$TMP_SCSS-e"
        fi

    fi

    # 1. Create a temp directory and copy plugin directory.
    # 2. Write build hash in plugin.json and create spi.
    # 3. Copy spi back to workdir.
    cp -r $1 $PLUGIN_BUILD_DIRECTORY

    #Writes plugin build hash in $PLUGIN_BUILD_DIRECTORY/plugin.json
    echo "$json_data" >> "$PLUGIN_BUILD_DIRECTORY/$1/plugin-temp.json"
	mv "$PLUGIN_BUILD_DIRECTORY/$1/plugin-temp.json" "$PLUGIN_BUILD_DIRECTORY/$1/plugin.json"

    #Execute component_manager script here
    chmod +x /$ABSOLUTEPATH/component_manager.sh
    /$ABSOLUTEPATH/component_manager.sh $PLUGIN_BUILD_DIRECTORY/$1
    
    cd $PLUGIN_BUILD_DIRECTORY
    zip -q -r $1".spi" $1

    cd $ABSOLUTEPATH

    cp $PLUGIN_BUILD_DIRECTORY/$1".spi" $ABSOLUTEPATH
    echo "Done. Please check for errors above."

    if [ -d "$PLUGIN_BUILD_DIRECTORY" ] ; then
		rm -rf $PLUGIN_BUILD_DIRECTORY
	fi
}

if [ $# == 0 ] ; then
    usage
fi

while getopts ":hi:u:d:cmv" opt; do
   case $opt in

   i )  install $OPTARG "$INSTALLPATH/$OPTARG" ;;
   u )  update $OPTARG "$INSTALLPATH/$OPTARG" ;;
   d )  uninstall $OPTARG "$INSTALLPATH/$OPTARG" ;;
   c )  CREATE_PLUGIN=1 ;;
   m )  MINIFY_PLUGIN=1 ;;
   v )  VERBOSE=1 ;;
   h )  usage ;;
   \?)  usage ;;
   : )  usage ;;

   esac
done


shift $(expr $OPTIND - 1 )

PLUGIN=$1
BUILD_DIR=$2

if [[ $CREATE_PLUGIN == 1 ]]; then

  if [[ $MINIFY_PLUGIN == 1 ]]; then
    minify $PLUGIN $BUILD_DIR

  else
  create $PLUGIN
 fi

fi
