var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var download = require('../workers/htmlfetcher').download;
var httpReq = require('http-request');
/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};
// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list,'utf8',function(err,content){
    if(err){
      return "Error " + err;
    } else {
      callback(content.split('\n'));
    }
  })
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(urls){
    callback( _.contains(urls, url) );
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url+'\n', 'utf8', function(err){
    if(err) { "File Not Written: " + err; }
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(err, content){
    if(err){ return "Error "+ err}
    callback(_.contains(content, url));
  });
};

exports.downloadUrls = function(array) {
  _.each(array, function(url){
    if(url){
      httpReq.get('http://'+url, function(err, content){
        if(content.code === 200){
          var html = content.buffer.toString();
          fs.writeFile(exports.paths.archivedSites+'/'+url, html, 'utf8', function(err){
              if(err){throw err}
          });
        }
      })
    }
  });
};
