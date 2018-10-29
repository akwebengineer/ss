#!/bin/bash
#Install Plugins
#$0 <slipstream location> <slipstream plugin installation>
SS_LOCATION=$1
SS_PLUGIN_INSTALL_LOC=$2
SS_USER=$3
PROXY_FILES="/etc/httpd/conf.d/webConf/webProxy.conf"
PROXY_FILES="${PROXY_FILES} /etc/httpd/conf.d/webConf/webProxyCertAuth.conf"
WEB_PROXY_CONF_FILE=/etc/httpd/conf.d/webProxy.conf
PROXY_CONF="ProxyPass / http://localhost:3000/"
for plugin in `ls -1 *.spi`; do
plugin_name=`echo ${plugin} | cut -f1 -d.`
echo "Executing: ${SS_LOCATION}/scripts/plugin_manager.sh -i ${plugin_name}"
#Force remove if not uninstalled properly
rm -rf ${SS_PLUGIN_INSTALL_LOC}/${plugin_name}
/sbin/runuser -s /bin/bash ${SS_USER} -c "${SS_LOCATION}/scripts/plugin_manager.sh -i ${plugin_name}"
done
#Proxy Setup
for WEB_PROXY_CONF_FILE in ${PROXY_FILES}; do
  if [ -f ${WEB_PROXY_CONF_FILE} ]; then
  if [ `grep -c "${PROXY_CONF}" ${WEB_PROXY_CONF_FILE}` == 0 ]; then
  insertPosition=`sed -n '/ProxyPassReverse \/mainui/ =' ${WEB_PROXY_CONF_FILE}`
  sed -i "$insertPosition i ${PROXY_CONF}" ${WEB_PROXY_CONF_FILE}
  fi
  fi
done
/etc/init.d/httpd reload
