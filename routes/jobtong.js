import request from 'request';
import cheerio from 'cheerio';
import Router from 'koa-router';
import Jobtong from '../models/jobtong';
import * as Helper from '../services/helper';

const router = new Router();

router.get('/jobtong', async(ctx) => {
    ctx.body = '周伯通';

    function getNextUrl() {
        const index = Helper.random(1000, 50000);
        return {url: 'http://www.jobtong.com/e/' + index, index};
    }

    async function crawl() {
        const currentPage = getNextUrl();
        console.log('jobtong_company:id ', currentPage.index);
        await setTimeout(async() => {
            await visitPage(currentPage, crawl);
        }, Helper.random(500, 2500));
    }

    async function visitPage(current, callback) {
        // Make the request
        const options = {
            url: current.url,
            headers: {
                'User-Agent': Helper.randomUA()
            },
            encoding: null,
            gzip: true,
            time: true
        };
        request(options, async(error, response, body) => {
            // Check status code (200 is HTTP OK)
            if (error || !response || response.statusCode >= 400) {
                console.log('error', error);
                callback();
                return;
            }
            // timeout
            if (response.elapsedTime > 500) {
                callback();
                return;
            }
            // Parse the document body
            var $ = cheerio.load(body.toString());
            await saveToFile($, current.index);
        });
    }

    async function saveToFile($, index) {
        let json = {
            companyId: index
        };
        json.companyName = $('h1', '.header').text();

        const companyInfo = $('span.tag', 'div.tags');
        json.companyAddress = $(companyInfo[0]).text();
        json.companyEmployeeCount = $(companyInfo[1]).text();
        json.companyType = $(companyInfo[2]).text();
        json.companyIndustry = $(companyInfo[3]).text();

        const parentCompanyInfo = $('p', '.sidebar');
        json.parentCompanyName = $(parentCompanyInfo[0]).text();
        json.parentCompanyWebsite = $(parentCompanyInfo[1]).text();
        json.parentCompanyAddress = $(parentCompanyInfo[2]).text();
        json.parentCompanyInfo = cheerio.text(parentCompanyInfo);

        json.companyIntroduction = $('div', 'div.introduce').text();

        const existCompanyCount = await Jobtong.count({companyId: index}).exec();
        if (existCompanyCount) {
            console.log('exist in db:id', index);
        } else {
            await new Jobtong(json).save();
        }
        return crawl();
    }

    await crawl();
});

export default router;