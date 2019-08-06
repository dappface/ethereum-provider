#!/bin/sh

set -o errexit
set -o nounset
set -o xtrace

npm run typecheck
(cd example/react-native && npm run typecheck)
(cd example/web && npm run typecheck)
