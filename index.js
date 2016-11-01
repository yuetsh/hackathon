import request from 'request';
import cheerio from 'cheerio';
import fs from 'fs';

let index = 0;

visitPage('https://www.liepin.com/company/pn0', crawl);

function crawl() {
    var currentPage = getNextUrl();
    console.log('currentPage', currentPage);
    visitPage(currentPage, crawl);
}

function getNextUrl() {
    index++;
    return 'https://www.liepin.com/company/pn' + index;
}

function visitPage(url, callback) {

    // Make the request
    request(url, function (error, response, body) {
        // Check status code (200 is HTTP OK)
        if (error || !response || response.statusCode >= 400) {
            console.log('err', err);
            callback();
            return;
        }
        // Parse the document body
        var $ = cheerio.load(body);
        saveToFile($);
    });
}
function saveToFile($) {
    var companies = $('div.list-item', 'div.company-list');
    companies.each(function (i, elem) {
        var companyName = $(elem).find('.company-name');
        var companyLink = $(p).find('a');
        console.log('p', $(p).text());
        console.log('a',$(a).attr('href'));
    });
}