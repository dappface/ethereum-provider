#!/bin/sh

set -o errexit
set -o nounset
set -o xtrace

npm run lint
(cd example/react-native && npm run lint)
(cd example/web && npm run lint)
