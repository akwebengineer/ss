#!/bin/bash
#Uninstall slipstream plugins
#$0 <slipstream location> <slipstream plugin installation>
SS_LOCATION=$1
SS_PLUGIN_INSTALL_LOC=$2
SS_USER=$3
for plugin in `ls -1 *.spi`; do
plugin_name=`echo ${plugin} | cut -f1 -d.`
echo "Executing: ${SS_LOCATION}/scripts/plugin_manager.sh -d ${plugin_name}"
/sbin/runuser -s /bin/bash ${SS_USER} -c "${SS_LOCATION}/scripts/plugin_manager.sh -d ${plugin_name}"
#Force remove if not uninstalled properly
rm -rf %{SS_PLUGIN_INSTALL_LOC}/${plugin_name}
done
