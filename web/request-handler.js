var fs = require('fs');
var $path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var headers = helpers.headers;
var getAssets = helpers.serveAssets;
// var Promise = require('bluebird');
// require more modules/folders here!

exports.handleRequest = function(req, res) {
  if(req.method === "GET"){

    if(req.url === "/") {
      // var url = 'index.html';
      getAssets(res, '/index.html', function(data){
        res.writeHead(200, headers);
        res.end(data);
      });
      return;
    }
    //
    // var filePath = __dirname + '/public/' + url;
    // var ext = $path.extname(filePath);
    //
    // if(ext === '.css') {
    //   headers['Content-Type'] = 'text/css';
    // }
    //
    // if(ext === '.js') {
    //   headers['Content-Type'] = 'application/javascript';
    // }
    //
    // if (filePath) {
    //   fs.readFile(filePath, 'utf8', function(err, data) {
    //     res.writeHead(200, headers);
    //     res.end(data);
    //   });
    //   return;
    // }
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
    var body = '';
    req.on('data', function(chunk){
      body += chunk;
    }).on('end', function(){
      body = body.slice(4);
      archive.isUrlInList(body, function(is){
        if(!is){
          archive.addUrlToList(body,function(){
            getAssets(res, '/loading.html', function(data){
              res.writeHead(302, headers);
              res.end(data);
            });
            return;
          });
        }
        else{
          // html fetcher data to the screen
          console.log('not adding anymore');
          res.end();
        }
      });
    });
  } else {
    res.end(archive.paths.list);
	}
};
