import request from 'request';
import cheerio from 'cheerio';
import Router from 'koa-router';
import Jobtong from '../models/jobtong';
import * as Helper from '../services/helper';
import fs from 'fs';

const router = new Router();

router.prefix('/jobtong');

router.get('/', (ctx) => {
    ctx.body = '周伯通';

    async function getNextUrl() {
        const index = Helper.random(10000, 100000);
        const existCompanyCount = await Jobtong.count({companyId: index}).exec();
        if (existCompanyCount) return getNextUrl();
        return {url: 'http://www.jobtong.com/e/' + index, index};
    }

    async function crawl() {
        const currentPage = await getNextUrl();
        console.log('currentPage', currentPage);

        // Make the request
        const options = {
            url: currentPage.url,
            headers: {
                'User-Agent': Helper.randomUA()
            },
            encoding: null,
            gzip: false,
            timeout: 5000
        };
        setTimeout(() => request(options, async(error, response, body) => {
            // Check status code (200 is HTTP OK)
            if (error || !response || response.statusCode >= 400) {
                console.log(error);
                return crawl();
            }
            // Parse the document body
            const $ = cheerio.load(body.toString());
            const companyName = $('h1', '.header').text();
            if (companyName) {
                const existingCompany = await Jobtong.findOne({companyName}).exec();
                if (existingCompany) {
                    console.log('duplicate company', existingCompany);
                    return crawl();
                }
                let json = {
                    companyId: currentPage.index,
                    companyName
                };

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
            }
            return crawl();
        }), Helper.random(1000, 2000));
    }

    crawl();
});

router.get('/filter', async(ctx) => {
    ctx.body = '过滤周伯通招聘';
    const count = await Jobtong.count({companyName: ''}).exec();
    console.log(count, '[count]');
    await Jobtong.remove({companyName: ''}).exec();

});

router.get('/csv', async(ctx) => {
    ctx.body = '周伯通招聘生成CSV';
    const jobtongs = await Jobtong.find({}).sort({companyId: 1}).exec();
    Jobtong.csvReadStream(jobtongs).pipe(fs.createWriteStream('data/jobtong.csv'));
});

export default router;