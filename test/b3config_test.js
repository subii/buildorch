'use strict';
var path = require('path'),
    assert = require('chai').assert,
    fs = require('fs'),
    shell = require('shelljs'),
    b3config = require('../lib/b3config');

describe('b3 config test', function () {

    var pwd, rand = Math.floor((Math.random()*100)+1), configJson;
    this.timeout(100000);

    before(function () {
        pwd = process.cwd();
        //change the working dir to Fixtures
        process.chdir(path.join(__dirname, 'fixtures'));

        console.log('Changed working dir to -->', process.cwd());
        shell.exec("npm install ../../");
        
    });

    after(function () {
        //Reset the pwd
        process.chdir(path.join(__dirname, 'fixtures'));
        process.chdir(pwd);
    });

    it('should init the Config object', function (next) {

		b3config.create(function (err, config){

           assert.notOk(err);
           assert.ok(config);
           
           assert.strictEqual("copy",config.get('bundle').execbundle.format);
           //path for script
           assert.strictEqual(path.join(process.cwd(),'initscript.sh'),config.get('init').script);
           assert.strictEqual(path.join(process.cwd(),'buildscript.sh'),config.get('build').script);
           assert.strictEqual(path.join(process.cwd(),'prebakescript.sh'),config.get('bake').prescript);
            assert.strictEqual(path.join(process.cwd(),'postbakescript.sh'),config.get('bake').postscript);
           assert.strictEqual(path.join(process.cwd(),'bundlescript.sh'),config.get('bundle').script);
           //get it
           assert.strictEqual(path.join(process.cwd(),'buildorch.sh'),config.get('build').files[0]);
           next();
        });

		
    });

    
    

});