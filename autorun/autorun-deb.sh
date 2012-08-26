#!/bin/bash
# NodeTV Autorun for Debian/Ubuntu Systems

cd /opt/NodeTV
node app.js
/opt/google/chrome/google-chrome --kiosk localhost:1337