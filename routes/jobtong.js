import request from 'request';
import cheerio from 'cheerio';
import Router from 'koa-router';
import Jobtong from '../models/jobtong';
import * as Helper from '../services/helper';

const router = new Router();

router.get('/jobtong', (ctx) => {
    ctx.body = '周伯通';

    async function getNextUrl() {
        const index = Helper.random(2000, 3000);
        const existCompanyCount = await Jobtong.count({companyId: index}).exec();
        if (existCompanyCount) return getNextUrl();
        console.log('Index:', index);
        return {url: 'http://www.jobtong.com/e/' + index, index};
    }

    async function crawl() {
        const currentPage = await getNextUrl();
        // Make the request
        const options = {
            url: currentPage.url,
            headers: {
                'User-Agent': Helper.randomUA()
            },
            encoding: null,
            gzip: true,
            time: true
        };
        setTimeout(() => {
            request(options, async(error, response, body) => {
                // Check status code (200 is HTTP OK)
                if (error || !response || response.statusCode >= 400) {
                    console.log(error);
                    return crawl();
                }
                // 超时
                if (response.elapsedTime > 3000) {
                    console.log('Time:', response.elapsedTime);
                    return crawl();
                }
                // Parse the document body
                const $ = cheerio.load(body.toString());
                let json = {
                    companyId: currentPage.index
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
                await new Jobtong(json).save();
                console.log('Done: ', currentPage.index);
                return crawl();
            });
        }, Helper.random(1000, 2000));
    }

    crawl();
});

export default router;