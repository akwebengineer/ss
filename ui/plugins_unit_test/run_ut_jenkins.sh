#!/bin/bash
npm install

#Backup to .old file to check if something changes after download
if [ -f SPoG_Framework.tar.gz ]; then
if [ ! -f SPoG_Framework.tar.gz.old ]; then
cp SPoG_Framework.tar.gz SPoG_Framework.tar.gz.old
fi
fi
WIDGETLIB="http://ssd-git-01.juniper.net:8080/SlipStream/nightly-builds/latest/SPoG_Framework.tar.gz"
wget -q -N ${WIDGETLIB}
diff SPoG_Framework.tar.gz SPoG_Framework.tar.gz.old > /dev/null
DIFF=$?
if [ ${DIFF} -ne 0 ]; then
  cp SPoG_Framework.tar.gz SPoG_Framework.tar.gz.old
  rm -rf dist public/widgetlib
  tar xfz SPoG_Framework.tar.gz dist/widgetlib
  tar xfz SPoG_Framework.tar.gz dist/sdk/public/assets/js/sdk
  CWD=`pwd`
  (cd dist; tar cf - widgetlib | tar -C ${CWD}/public/ -xf -)
  (cd dist/sdk/public/assets/js;  tar cf - sdk | tar -C ${CWD}/public/widgetlib/js/ -xf -)
  rm -rf dist
fi

rm -rf plugins-unit-tests.tap
rm -rf public/coverage/
rm -rf public/installed_plugins/
mkdir -p public/installed_plugins/
rm -rf jscover/
rm -rf target/


OLD_JSCOVER_PID=$(lsof -i:4000 -t)

if [ ! -z "$OLD_JSCOVER_PID" ]; then
    echo 'Old server is running with pid =' $OLD_JSCOVER_PID '. killing it!!!!'
    kill -TERM $OLD_JSCOVER_PID || kill -KILL $OLD_JSCOVER_PID
fi


#Test
./node_modules/.bin/grunt prepare-tests

#start the jscover server
java -Dfile.encoding=UTF-8 -jar lib/jscover/JSCover-all.jar -ws  --document-root=public/ --report-dir=jscover  --no-instrument-reg=/installed_plugins/.*/tests/.* --no-instrument=/masterMocker.js --no-instrument-reg=/main.*.js --no-instrument-reg=/widgetlib.* --port=4000  --local-storage --include-unloaded-js &

#capture the server pid
JSCOVER_PID=$!

#run tests
./node_modules/.bin/grunt execute-ut --force

# this sleep is for the coverage to complete
sleep 30
#
##kill the server
kill $JSCOVER_PID

#convert the report to cobertura report
java -cp lib/jscover/JSCover-all.jar jscover.report.Main --format=COBERTURAXML jscover jscover

#Copy Coverage in cobertura format
mkdir -p target/site/cobertura

if [ -f jscover/cobertura-coverage.xml ]; then
  cp jscover/cobertura-coverage.xml target/site/cobertura/coverage.xml
fi
#cp public/index.html.orig public/index.html
