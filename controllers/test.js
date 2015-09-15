/**
 * Created by Andrew on 1/17/2015.
 */

var fs = require('fs');
var request = require('request');
var UPLOADS_PATH = "./public/uploads";
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
require('./cacheHtml.js');

exports.index = function(req, res) {

  getHtmlPage(req.query.link, function (path, contents) {
    console.log(' sending from file ' + path);
    console.log('contents');
    console.log(contents);
      res.send(contents);
  });
};
