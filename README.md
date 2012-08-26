NodeTV
======

NodeTV is a complete web-based media delivery solution for desktop and home theater computers. It has a strong focus on efficiency and memory 
management, so it can be easily deployed and used on low-memory devices such as the Raspberry Pi. NodeTV aims to provide a free and open-source 
replacement for AppleTV, Roku, and others. In addition, there will be a robust extention system, allowing developers to write NodeTV apps using 
a JavaScript API. 

## Prerequisites

Initially NodeTV will only be supported on -nix-based systems - specifically Debian/Ubuntu and Mac OSX, however Windows support is on the radar.  
NodeTV's only prerequisites are:

* Node.js 0.8.x <http://nodejs.org/download/>
* Google Chrome 12.0.x.x <https://www.google.com/chrome>

To enable auto-updating, you will need:

* Git 1.7.9.x <http://git-scm.com>

## Installation

On Debian/Ubuntu:

	$ cd /opt
	$ git clone https://github.com/gordonwritescode/NodeTV.git
	
To enable NodeTV to automatically start on login, navigate to *Startup Application > Add* and add `/opt/NodeTV/autorun/autorun-deb.sh` to the path.

On Mac OSX:

	$ cd /Applications
	$ git clone https://github.com/gordonwritescode/NodeTV.git
	
To enable NodeTV to automatically start on login, navigate to *System Preferences > Users > Login Items* and add `/Applications/NodeTV/autorun/autorun-osx.sh`.

## Author & License
Copyright 2012 by Gordon Hall, released under MIT/BSD License.