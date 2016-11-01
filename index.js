import request from 'request';
import cheerio from 'cheerio';
import fs from 'fs';

let index = 99;
var base = '000000';

crawl();

function crawl() {
    var nextPage = getNextUrl();
    visitPage(nextPage, crawl);
}

function getNextUrl() {
    index++;
    return 'http://www.jobif.com/jobprovider_' +
        base.slice(0, index.toString().length) + index + '.htm';
}

function visitPage(url, callback) {

    // Make the request
    request(url, function (error, response, body) {
        // Check status code (200 is HTTP OK)
        if (error || !response || response.statusCode !== 200) {
            callback();
            return;
        }
        // Parse the document body
        var $ = cheerio.load(body);
        searchForWord($);
        callback();
    });
}
function searchForWord($) {
    var companyName = $('h2', 'span.title').text();
    console.log(companyName);
}