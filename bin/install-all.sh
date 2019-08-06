#!/bin/sh

set -o errexit
set -o nounset
set -o xtrace

 npm i 
 (cd example/react-native && npm i)
 (cd example/web && npm i)
