#sets up base for creating a widget explorer. creates base files/repeated components
# set path
SCRIPT=$0
SCRIPTPATH=$( cd $(dirname $SCRIPT) ; pwd )
# echo $SCRIPTPATH
cd $SCRIPTPATH
mkdir ../../widgets/$1/tests/explorer
cp setup/conf.js ../../widgets/$1/tests/explorer/formConf.js
touch ../../widgets/$1/tests/explorer/demo.js
if [[ $2 -eq "1" ]] ;
	then cp setup/formExtend.js ../../widgets/$1/tests/explorer/formExtend.js ;
fi
echo "{{md 'public/assets/js/widgets/$1/$1.md'}}" > ../../widgets/$1/tests/explorer/doc.hbs
grunt assemble
# rm ../../widgets/$1/tests/explorer/doc.hbs
