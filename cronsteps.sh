#!/bin/bash

cd "${0%/*}"
echo
date
echo
echo "feedimport.js"
node src/feedimport.js
echo
echo "parsetitlescron.js"
./node_modules/.bin/babel-node src/parsetitlescron.js
echo
echo "rulesdownload.js"
./node_modules/.bin/babel-node src/rulesdownload.js
