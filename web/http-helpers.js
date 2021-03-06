var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  fs.readFile(archive.paths.siteAssets + asset, 'utf8', function(err, data){
    callback(data);
  });
};

exports.serveArchives = function(res, archiveUrl, callback){
  fs.readFile(archive.paths.archivedSites+'/'+archiveUrl, 'utf8', function(err, data){
    callback(data);
  });

};
