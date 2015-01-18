/**
 * Created by Andrew on 1/17/2015.
 */

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var UPLOADS_PATH = "./public/uploads";
var url = require('url');



stringEndsWith = function (s, suffix) {
  return s.indexOf(suffix, s.length - suffix.length) !== -1;
};
/* callback(file_path, html_contents)
 */
getHtmlPage = function (link, callback) {
  var parts = link.replace('http://', '').replace('https://', '').split('/');
  var last_idx = parts.length - 1;

  if (parts[last_idx] == '') {
    parts[last_idx] = 'index.html';
  }
  var cache_path = UPLOADS_PATH + '/' + parts.join('____').replace(':', '_');


  if (fs.existsSync(cache_path)) {
    console.log("file found!");
    fs.readFile(cache_path, function (err, contents) {
      callback(cache_path, contents.toString('ascii'));
    });
  } else {

    request(link, function (error, response, body) {

      var $ = cheerio.load(body);
      var scripts = $('script');
      for (var i = 0; i < scripts.length; i+=1) {
        var scriptTag = $(scripts[i]);
        script_src = scriptTag.attr().src;
        if (script_src) {
          script_src = url.resolve(link, script_src);
          var linkContents = "console.log(33)" ; // fs.readlinkSync(script_src)
          scriptTag.html(linkContents).removeAttr('src');
        }
        //$(scripts[i]).replaceWith(scriptTag);
      }
      //debugger;

      body = $('html').toString();
      console.log(body);
      /*
      for (i = 0; i < scriptLength; i++) {
        emptyScript = '<script></script>';

        if ($(html('script')[6]).attr().src) {
          src = $(html('script')[6]).attr().src;
          if (src.indexOf('http')) {
            fs.readlinkSync()
          }
          else if (src.charAt(0) == '/') {
            if (src.charAt(1) == '/') {
              // call URL as https
            }
            else {
              // This link is root
            }
          }
          else if(src.charAt(0) == '.') {
            if (src.charAt(1) == '/') {
              // This link is relative. Remove ./ and append to link
            }
            else {
              // Enter logic for traversing backwards through file trees here
            }
          }
          else {
            // This link is relative. Append to link
          }
        }

        $(html('script')[i]).replaceWith(html(emptyScript)).toString();



      }
      */



      console.log("got:");
      console.log('Writing into ' + cache_path);
      fs.writeFile(cache_path, body, function (err) {
        console.log('wrote');
        callback(cache_path, body);
      });
    });
  }

};