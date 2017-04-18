import request from 'request';
import cheerio from 'cheerio';
import Router from 'koa-router';
import fs from 'fs';
import { download, randomUA, random, getOptions } from '../services/helper';

const router = new Router();

router.prefix('/haodiao');

router.get('/', async (ctx) => {
    ctx.body = 'haodiao';
    const url = 'http://haodiao.org/';
    const dir = 'images/haodiao/cosplay';
    const pages = ['3339', '3421', '3477', '3185', '3101', '3028', '2957', '2956', '2879', '2732', '2674',
        '2618', '2512', '309', '465', '616', '632', '722', '873', '1390', '1478', '1635', '1642', '1700',
        '1829', '1957', '2017', '2031', '2225', '2222', '2083', '2317', '2348', '2320', '2430',]
    let index = 0;
    function getNextUrl(url) {
        index++;
        return url + pages[index];
    }

    async function visitPage(url) {
        // Make the request
        const options = getOptions(url);
        setTimeout(() => request(options, async (error, response, body) => {
            // Check status code (200 is HTTP OK)
            if (error || !response || response.statusCode >= 400) {
                console.log('error', error);
                return crawl();
            }
            // Parse the document body
            var $ = cheerio.load(body.toString());
            const images = $('.article-content > div > div > div');
            if (!images || !images.length) return crawl();
            images.map(async (i, elem) => {
                const src = $(elem).find('a').attr('href');
                if (src) await download(src, dir);
            }, );
            return crawl();
        }), random(1000, 2000));
    }

    async function crawl() {
        console.log(index, '[index]');
        if (index < pages.length) {
            const currentPage = getNextUrl(url);
            visitPage(currentPage);
        } else {
            console.log('done');
        }
    }

    crawl();
});

export default router;