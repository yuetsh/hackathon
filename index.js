import request from 'request';
import cheerio from 'cheerio';
import URL from 'url-parse';
import fs from 'fs';

var START_URL = "http://bj.58.com/sou/?key=%E7%AE%A1%E5%9F%B9%E7%94%9F&button=%E6%90%9C%C2%A0%E7%B4%A2";
var SEARCH_WORD = "stemming";
var MAX_PAGES_TO_VISIT = 10000;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(START_URL);
crawl();

function crawl() {
    if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
        console.log("Reached max limit of number of pages to visit.");
        return;
    }
    var nextPage = pagesToVisit.pop();
    if (nextPage in pagesVisited) {
        // We've already visited this page, so repeat the crawl
        crawl();
    } else {
        // New page we haven't visited
        visitPage(nextPage, crawl);
    }
}

function visitPage(url, callback) {
    // Add page to our set
    pagesVisited[url] = true;
    numPagesVisited++;

    // Make the request
    console.log("Visiting page " + url);
    request(url, function (error, response, body) {
        // Check status code (200 is HTTP OK)
        if (error || !response || response.statusCode !== 200) {
            callback();
            return;
        }
        // Parse the document body
        var $ = cheerio.load(body);
        var relativeLinks = $("a[href^='/']");
        relativeLinks.each(function () {
            pagesToVisit.push(baseUrl + $(this).attr('href'));

        });
        searchForWord($, SEARCH_WORD);
        crawl();
    });
}
function searchForWord($) {
    var wordsRegex = /海外|管培生|美国|澳大利亚|管理培训生|英国|留美|海归/g;
    var bodyText = $('html > body').text().toLowerCase();
    if (wordsRegex.test(bodyText)) {
        fs.appendFileSync('info.txt', bodyText);
    }
}