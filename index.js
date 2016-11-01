import request from 'request';
import cheerio from 'cheerio';
import fs from 'fs';

let index = 0;

crawl();

function crawl() {
    var currentPage = getNextUrl();
    console.log('currentPage', currentPage);
    visitPage(currentPage, crawl);
}

function getNextUrl() {
    index++;
    return 'http://www.jobtong.com/e/' + index;
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
        searchForWord($);
        // setTimeout(callback, 1000);
    });
}
function searchForWord($) {
    var json = {};
    json.companyName = $('h1', '.header').text();

    var companyInfo = $('span.tag', 'div.tags');
    json.companyAddress = $(companyInfo[0]).text();
    json.companyEmployeeCount = $(companyInfo[1]).text();
    json.companyType = $(companyInfo[2]).text();
    json.companyIndustry = $(companyInfo[3]).text();

    var parentCompanyInfo = $('p', '.sidebar');
    json.parentCompanyName = $(parentCompanyInfo[0]).text();
    json.parentCompanyWebsite = $(parentCompanyInfo[1]).text();
    json.parentCompanyAddress = $(parentCompanyInfo[2]).text();
    json.parentCompanyInfo = cheerio.text(parentCompanyInfo);

    json.companyIntroduction = $('div', 'div.introduce').text();

}