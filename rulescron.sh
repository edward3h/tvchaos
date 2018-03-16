#!/bin/bash

cd "${0%/*}"
./node_modules/.bin/babel-node src/rulesdownload.js
