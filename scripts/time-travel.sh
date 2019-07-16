#!/bin/bash

function getMillis () {
	secs=$(date --date "${1}" +%s)
	let secs-=$(date +%s)
	msecs=$(( $secs * 1000 )) 
	echo $msecs
}

echo "Viajando en el tiempo $(getMillis $1) ms hacia $1";
vboxmanage modifyvm "HomeSwitchHome" --biossystemtimeoffset $(getMillis $1);
if [[ $? -eq 0 ]]
then
	vboxmanage startvm "HomeSwitchHome"
fi
