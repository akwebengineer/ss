#!/bin/bash
VERSION=$1
REL=$2
VERSION_FILE=/usr/local/slipstream/public/assets/js/conf/nls/msgs.properties
sed -i "s/^product_version.*$/product_version = Version ${VERSION} ${REL}/g" ${VERSION_FILE}
