import request from 'request';
import cheerio from 'cheerio';
import Router from 'koa-router';
import Liepin from '../models/liepin';
import * as Helper from '../services/helper';
import fs from 'fs';
import * as _ from 'lodash';

const router = new Router();

router.prefix('/liepin');

router.get('/', async(ctx) => {
    ctx.body = '猎聘';

    let index = 0;
    let jsons = [];

    function getNextUrl() {
        index++;
        return 'https://www.liepin.com/company/000-040/pn' + index;
    }

    async function crawl() {
        console.log(index, '[index]');
        if (index < 109) {
            const currentPage = getNextUrl();
            await visitPage(currentPage);
        } else {
            await Liepin.insertMany(jsons);
            console.log('done');
        }
    }

    async function visitPage(url) {
        // Make the request
        const options = {
            url,
            headers: {
                'User-Agent': Helper.randomUA()
            },
            encoding: null,
            gzip: false,
            timeout: 5000
        };
        setTimeout(() => request(options, (error, response, body) => {
            // Check status code (200 is HTTP OK)
            if (error || !response || response.statusCode >= 400) {
                console.log('error', error, response.statusCode);
                return crawl();
            }
            // Parse the document body
            var $ = cheerio.load(body.toString());
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
        }), Helper.random(1000, 2000));
    }

    const count = await Liepin.count().exec();
    if (count) return;
    await crawl();
});

router.get('/detail', async(ctx) => {
    ctx.body = '猎聘公司细节';
    const companies = await Liepin.find({}, {companyId: 1}).exec();
    let index = 0;
    const total = companies && companies.length;
    companies.reduce((prev, company) => {

    }, {});
});

router.get('/email', async(ctx) => {
    ctx.body = '百度猎聘的邮箱';
    function getEmail(body) {
        var re = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gi;
        return body.match(re);
    }

    const companies = await Liepin.find({emails: {$size: 0}}, {_id: 1, companyName: 1}).exec();
    const companyList = companies.map((company) => company.companyName);

    function getNext() {
        if (companyList.length > 1) {
            const name = companyList.shift();
            const url = 'https://www.baidu.com/s?wd=' + encodeURIComponent(name + ' 邮箱') + '&rn=50';
            return {url, name};
        }
    }

    async function crawl() {
        const currentPage = getNext();
        console.log('Company: ', currentPage.name);
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
            const divs = $('div');
            const contents = $(divs).text();
            const emails = _.uniq(getEmail(contents));
            console.log('emails', emails);
            if (emails.length > 0) {
                await Liepin.update({companyName: currentPage.name}, {$set: {emails}}).exec();
                console.log('Done: ', currentPage.name);
            }
            return crawl();
        }), Helper.random(1500, 3000));
    }

    crawl();
});

router.get('/csv', async(ctx) => {
    ctx.body = '猎聘生成CSV';
    const liepins = await Liepin.find({}).sort({companyId: 1}).exec();
    Liepin.csvReadStream(liepins).pipe(fs.createWriteStream('data/liepin.csv'));
});

export default router;
