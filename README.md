Buildorch
=========

[![NPM version](https://badge.fury.io/js/buildorch.svg)](http://badge.fury.io/js/buildorch)
[![Build Status](https://travis-ci.org/subeeshcbabu/buildorch.svg?branch=master)](https://travis-ci.org/subeeshcbabu/buildorch)


[![NPM](https://nodei.co/npm/buildorch.png)](https://nodei.co/npm/buildorch/)

# Overview
A Simple CLI based utility to Orchestrate NodeJs Application builds.
The workflow has these three,
- Build  (NPM Install)
- Bake   (Execute the Grunt tasks - lint,test,cover,build OR execute the npm scripts lint,test,cover,build)
- Bundle (Bundle the Application code and node_modules - Default format is tgz)

## Usage

Init script to install nodejs and npm and configure the npm defaults

    curl https://raw.github.com/subeeshcbabu/buildorch/master/buildorch.sh | sh

Install the module
	
	npm install buildorch

Commands
	
	node_modules/.bin/buildorch b3  (Executes build, bake and bundle)
	node_modules/.bin/buildorch b2  (Executes build and bake)
	node_modules/.bin/buildorch build
	node_modules/.bin/buildorch bake
	node_modules/.bin/buildorch bundle
	
### Pre Requisites
Posix OS

The commands should be executed at application root 

## Features:

### Configuration based 

The build orchestartion works based on JSON Configuration `buildorch.json`. If the application did not specify a config json file, a default template is loaded [buildorch.json](https://raw.github.com/subeeshcbabu/buildorch/master/config/buildorch.json). The config loader supports arbitrary types using the module [shortstop] (https://github.com/krakenjs/shortstop).

A Sample `buildorch.json`
```js

{
	"init" : {
		"clean"	: [
			"path:node_modules"
		],
		"script" : ""
	},

	"build" : {
		"files" : [
			"getit:https://raw.githubusercontent.com/subeeshcbabu/buildorch/master/buildorch.sh"
		],
		"script" : "path:buildscript.sh",
		"execbuild" : {
			"command" : "npm install"
		},
		"clean"	: [
			
		]
	},

	"bake" : {
		"files" : [

		],
		"script" : "path:bakescript.sh",
		"execbake" : {
			"lint" : "lint",
			"unittest" : "test",
			"coverage" : "coverage",
			"custom" : "build"
		},
		"clean"	: [
			
		]
	},

	"bundle" : {	
 		"files" : [

		],	
		"script" : "path:bundlescript.sh",
		"execbundle" : {
			"target" : "target",
			"format" : "tar"
		},
		"clean"	: [
			
		]
	},
	"metrics" : {
		"write" : {
			"outfile" : "path:build-metrics.json"
		}
	}
}
```
#### Handlers
##### [shortstop-handlers] (https://github.com/krakenjs/shortstop-handlers) - path, file, env, exec etc.

##### getit handler
format - `getit:<remote file location>#<filepath>`

This handler will download the file and save it to the `process.cwd()/<filepath>` location.

The scripts and other executers can reference the file using `process.cwd()/<filepath>` path.

Eg:- `getit:https://raw.githubusercontent.com/subeeshcbabu/buildorch/master/buildorch.sh#build/build_init.sh`


### Tasks

##### clean

Clean the list of files/directories. This task can be added as a sub task for any Main tasks (init, build, bake, bundle etc)
```javascript
	"clean"	: [
		"path:node_modules"
	]
```
##### script

Execute any script by specifying the relative, absolute or remote file location. 
```javascript
	
	"script" : " path:nodefile.js"

	"script" : "getit:https://raw.githubusercontent.com/subeeshcbabu/buildorch/master/buildorch.sh#build/build_init.sh"

```

##### files

Download config/script files from remote location
```javascript
	"files"	: [
		"getit:https://raw.githubusercontent.com/subeeshcbabu/buildorch/master/buildorch.sh#build/build_init.sh"
	]
```
##### init

Gets executed automatically before command execs (b3, b2, build etc). You can add any one of the sub tasks for this (clean,files, script)

```javascript
		"init" : {
			"clean"	: [
				"path:node_modules"
			],
			"script" : ""
			"files"	: [
				"getit:https://raw.githubusercontent.com/subeeshcbabu/buildorch/master/buildorch.sh#build/build_init.sh"
			]
		}
```
##### build

To execute the build task. Default command is `npm install`
```javascript
	"build" : {
		"files" : [

		],
		"script" : "",
		"execbuild" : {
			"command" : "npm install"
		},
		"clean"	: [
			
		]
	}
```
##### bake

To execute the tasks - `lint`, `unittest`, `coverage` and `custom`. The default task runner is [Grunt](http://gruntjs.com/).

The `command` can be used to specify the tool/module used to execute the task. Another example would be `npm run-script`.
It will execute the commands in sequential order. 

npm run-script lint
npm run-script test
npm run-script coverage
npm run-script build

```javascript
	"bake" : {
		"files" : [

		],
		"script" : "",
		"command" : "path:node_modules/.bin/grunt", OR  "command" : "npm run-script",
		"execbake" : {
			"lint" : "lint",
			"unittest" : "test",
			"coverage" : "coverage",
			"custom" : "build"
		},
		"clean"	: [
			
		]
	}
```
##### bundle

To bundle/assemble the source files to a predefined format.
```javascript
	"bundle" : {	
 		"files" : [

		],	
		"script" : "",
		"execbundle" : {
			"source" : "path:source",
			"target" : "path:target",
			"format" : "tgz", OR (tar, zip, copy, custom)
			"ignorefile" : [
				"path:.packageignore"
			]
		},
		"clean"	: [
			
		]
	}
```

`source` The source directory to copy over the files after executing the exclude list/ignore patterns. 

`ignorefile` The list of files o specify the ignore patterns.

By default the following files are ignored [Default patterns] (https://raw.githubusercontent.com/subeeshcbabu/buildorch/master/config/.defaultignore). Plus the `.packageignore` is automatically loaded if its present.


Add a .packageignore file (Make sure the file extension is not .txt) in the application root directory, to add the list of files/directories to be ignored. This supports regex expressions to match/find the list of files and works exactly like the `.gitignore`, `.jshintignore` etc

`target` The target directory to save the bundled file. Default is process.cwd()/'target'.

`format` The bundle format. Supported formats are `tar`, `tgz` and `zip`.


In addition to this there are two special types of values for this parameter.

`copy` This copies over the files from the process.cwd() to `source`. User can implement their own custom bundle process and invoke it using `script`.

`custom` This completely ignores the bundle steps and uses whatever custom implement user specifies using `script`


##### metrics

To generate the `build-metrics.json` file. 
```javascript
"metrics" : {
		
	"write" : {
		"outfile" : "path:build-metrics.json"
	}
}
```

### Generates build metrics

The orachestartor generates a `build-metrics.json` file, helpful in figuring out the time spent on granular level tasks and status of individual steps.

A sample `build-metrics.json`

```js
{
  "application" : "foo",
  "userid" : "bar",
  "machine" : "blah",
  "environment" "development",
  "starttime": "2014-04-07T22:24:56.923Z",

  "init": {
    "starttime": "2014-04-07T21:17:25.882Z",
    "endtime": "2014-04-07T21:17:25.989Z"
  },

  "build": {
    "starttime": "2014-04-07T21:17:25.989Z",
    "endtime": "2014-04-07T21:17:28.622Z"
  },

  "bake": {
    "starttime": "2014-04-07T21:17:28.622Z",

    "lint": {
      "starttime": "2014-04-07T21:17:28.627Z",
      "endtime": "2014-04-07T21:17:28.866Z",
      "status": "SUCCESS"
    },

    "unittest": {
      "starttime": "2014-04-07T21:17:28.866Z",
      "endtime": "2014-04-07T21:17:29.248Z",
      "status": "FAILURE"
    },

    "coverage": {
      "starttime": "2014-04-07T21:17:29.248Z",
      "endtime": "2014-04-07T21:17:29.487Z",
      "status": "SUCCESS"
    },

    "custom": {
      "starttime": "2014-04-07T21:17:29.487Z",
      "endtime": "2014-04-07T21:17:29.725Z",
      "status": "SUCCESS"
    },

    "endtime": "2014-04-07T21:17:29.726Z"
  },

  "endtime": "2014-04-07T22:21:16.262Z",
  "status": "SUCCESS"
}
```


