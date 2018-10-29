#!/bin/bash

###############################################################################
# Utility script to remove inline color fill attributes from SVG files
#
# Author: Andrew Chasin <achasin@juniper.net>
#
###############################################################################

SCRIPT=$0
BACKUP=0
BACKUP_EXT=""

function usage () {
   cat <<EOF
Usage:
$SCRIPT [-b] [file ...]
   -b   backup existing files before removing their styles.
EOF
   exit 0
}

if [ $# -eq 0 ]; then
    usage
fi

while getopts "b" opt; do
   case $opt in

   b )  BACKUP=1;;
   h )  usage ;;

   esac
done

FILES=${@:1}

if [ ! $BACKUP -eq 0 ]; then
	BACKUP_EXT=".bak"
	FILES=${@:2}
fi

if [ ! -z "$FILES" ]; then
  for file in $FILES
  do
      sed -i "$BACKUP_EXT" -E -e "s/fill((:.*;)|(=\"#[^\"]*\"))//g" "$file"
  done
fi