#!/bin/bash
# NodeTV Autorun for Mac OSX Systems

cd /Applications/NodeTV
node app.js
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk localhost:1337