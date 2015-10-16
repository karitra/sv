#!/bin/bash
#
# author: Karev
#
# Arch & send distr to remote host
#

HOST="$2"
DISTR=(sv2/bin sv2/Scripts sv2/Content sv2/Web.config)
ARCH=sv2.tar.gz

usage() 
{
	echo
	echo Usage:
	echo
	echo -e "\t" \$ $0 --arch
	echo -e "\t" \$ $0 --deploy '<host>'
	echo -e "\t" \$ $0 --all '<host>'
	echo
}

arch() {
	tar czf "$2" $1
}

deploy() {
	scp $1 $2 
}

check_opts() {
	if [[ "${#BASH_ARGV[@]}" -lt "1" ]]; then
		usage
		exit 1
	fi
}

case "$1" in
	--deploy)
		check_opts
		deploy $ARCH $HOST
		;;
	--arch)
		arch "${DISTR[*]}" $ARCH
		;;
	--all|*)
		check_opts
		arch "${DISTR[*]}" $ARCH 
		deploy $ARCH $HOST
		;;
esac

