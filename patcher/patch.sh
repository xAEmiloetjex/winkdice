#!/usr/bin/env bash
PRJ_ROOT=/home/server/Public/nl.xa_emiloetjex.web.socialnetwork
# PRJ_ROOT=/mnt/vfs_share/packaged
PATCHES=$PRJ_ROOT/patches
PATCHER=$PRJ_ROOT/patcher

cd $PRJ_ROOT

git apply --reject --whitespace=fix $PATCHES/$1

sh $PATCHER/after.sh