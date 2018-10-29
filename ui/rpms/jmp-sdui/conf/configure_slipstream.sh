#!/bin/bash
CONF_DIR=`dirname $0`
VERSION=$1
REL=$2
SS_LOCATION=/usr/local/slipstream
tar -C ${CONF_DIR} -cf - slipstream | tar -C ${SS_LOCATION}/.. -xf -

SUBSTITUTE_FILE=${SS_LOCATION}/public/assets/js/conf/global_config.js
SUBSTITUTE_FILE=public/assets/js/conf/global_config.js
export product_version="Version ${VERSION} ${REL}"
/usr/bin/envsubst '$product_version' < ${CONF_DIR}/slipstream/${SUBSTITUTE_FILE} > ${SS_LOCATION}/${SUBSTITUTE_FILE}
