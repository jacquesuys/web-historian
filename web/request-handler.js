var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var headers = require('./http-helpers').headers;
// var Promise = require('bluebird');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if(req.method === "GET"){
      if(req.url === "/"){
        res.writeHead(200, headers);
        res.end('<input');
      }
      if(req.url === '/www.google.com') {
        var path = archive.paths.archivedSites + req.url;
        fs.exists(path, function(exists){
          if (exists) {
            // console.log('exists');
            fs.readFile(path, 'utf8', function(err, data){
              if(err){
                return "File Not Found: " + err;
              } else {
                res.writeHead(200, headers);
                res.end(data);
                return;
              }
            });
          }
        });
      } else {
      res.writeHead(404, headers);
      res.end();
    }
  } else if(req.method === "POST"){
    if(req.url === "/") {
      var body = '';
      req.on('data', function(chunk){
        body += chunk;
      }).on('end', function(){
        body = body.slice(4);
        console.log('<------------'+body);
        archive.isUrlInList(body,function(){
          res.writeHead(201, headers);
          res.end();
        });
      });
    }
  } else {
    res.end(archive.paths.list);
	}
};


// else {
//  // writefile
//  fs.writeFile(path, req.url, 'utf8', function(err){
//    if(err) { return err}
//    res.writeHead(200, headers);
//    res.end(req.url);
//  });
// }
