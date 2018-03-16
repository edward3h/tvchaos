#!/bin/bash

cd "${0%/*}"
node src/feedimport.js
./node_modules/.bin/babel-node src/parsetitlescron.js
./node_modules/.bin/babel-node src/rulesdownload.js
