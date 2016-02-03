var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var headers = require('./http-helpers').headers;
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  console.log('HOST', req.url);
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
                return "Not Found: " + err;
              } else {
                res.writeHead(200, headers);
                res.end(data);
                return;
              }
            })
          } else {
            // writefile
            fs.writeFile(path, req.url, 'utf8', function(err){
              if(err) { return err}
              res.writeHead(200, headers);
              res.end(req.url);
            });
          }
        })
      } else {
      res.writeHead(404, headers);
      res.end();
    }
  } else {
    res.end(archive.paths.list);
	}
};
