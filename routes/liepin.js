import request from 'request';
import cheerio from 'cheerio';
import Router from 'koa-router';
import Liepin from '../models/liepin';
import * as Helper from '../services/helper';
import * as _ from 'lodash';

const router = new Router();

router.get('/liepin', async(ctx) => {
    ctx.body = '猎聘';

    let index = 0;
    let jsons = [];

    function getNextUrl() {
        index++;
        return 'https://www.liepin.com/company/000-040/pn' + index; // 互联网行业
    }

    async function crawl() {
        console.log(index, '[index]');
        if (index < 109) {
            const currentPage = getNextUrl();
            await visitPage(currentPage, crawl);
        } else {
            await Liepin.insertMany(jsons);
            console.log('done');
        }
    }

    async function visitPage(url, callback) {
        // Make the request
        const options = {
            url,
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
            return saveToFile($);
        });
    }

    async function saveToFile($) {
        const companies = $('div.list-item', 'div.company-list');
        companies.each((i, elem) => {
            const companyNameElem = $(elem).find('.company-name');
            const companyLinkElem = $(companyNameElem).find('a');
            jsons.push({
                companyId: $(companyLinkElem).attr('href').match(/\d/g).join(''),
                companyName: $(companyNameElem).text()
            });
        });
        return crawl();
    }

    const count = await Liepin.count().exec();
    if (count) return;
    await crawl();
});

router.get('/liepin/detail', async(ctx) => {
    ctx.body = '猎聘公司细节';
    const companies = await Liepin.find({}, {companyId: 1}).exec();
    let index = 0;
    const total = companies && companies.length;

    const infos = await Promise.all(_.map(companies.slice(index, index + 50), async(company) => {
        const url = `https://www.liepin.com/company/${company.companyId}/`;
        const options = {
            url,
            headers: {
                'User-Agent': Helper.randomUA()
            },
            encoding: null,
            gzip: true
        };
        await setTimeout(async() => {
            request(options, (error, response, body) => {
                // Check status code (200 is HTTP OK)
                if (error || !response || response.statusCode >= 400) {
                    console.log('error', error);
                    return;
                }
                const $ = cheerio.load(body.toString());
                const l = $('h1', '.name-and-welfare').text();
                console.log(body.toString(), '[$]');
            });
        }, Helper.random(500, 2500));
    }));
});

export default router;
