import request from 'request';
import cheerio from 'cheerio';
import fs from 'fs';
import Router from 'koa-router';
const router = new Router();

router.get('/jobtong', async(ctx) => {
    ctx.body = '周伯通';
    return await crawl();
});

let index = 0;

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
    const options = {
        url,
        headers: {
            'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1`
        },
        encoding: null,
        gzip: false
    };
    request(options, (error, response, body) => {
        // Check status code (200 is HTTP OK)
        if (error || !response || response.statusCode >= 400) {
            console.log('err', error);
            callback();
            return;
        }
        // Parse the document body
        var $ = cheerio.load(body.toString());
        saveToFile($);
    });
}
function saveToFile($) {
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
    console.log('json', json);

    fs.appendFileSync('jobtong.text', JSON.stringify(json, null, 4));
    console.log('save done');
    crawl();
}

export default router;