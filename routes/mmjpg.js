import request from 'request';
import cheerio from 'cheerio';
import Router from 'koa-router';
import fs from 'fs';
import { download, randomUA, getOptions } from '../services/helper';

const router = new Router();

router.prefix('/mmjpg');

router.get('/', async (ctx) => {
    ctx.body = 'mmjpg';
    const url = `http://www.mmjpg.com/home/`;
    const dir = `images/mmjpg/home`;

    let index = 1;
    function getNextUrl(url) {
        index++;
        return url + index;
    }

    async function visitPage(url) {
        // Make the request
        const options = getOptions(url);
        setTimeout(() => request(options, (error, response, body) => {
            // Check status code (200 is HTTP OK)
            if (error || !response || response.statusCode >= 400) {
                console.log('error', error);
                return crawl();
            }
            // Parse the document body
            var $ = cheerio.load(body.toString());
            $('div.pic ul li').each(async (i, elem) => {
                const src = $(elem).find('img').attr('src');
                await download(src, dir);
            });
            return crawl();
        }), random(1000, 2000));
    }

    async function crawl() {
        console.log(index, '[index]');
        if (index < 65) {
            const currentPage = getNextUrl(url);
            visitPage(currentPage);
        } else {
            console.log('done');
        }
    }

    crawl();
});

export default router;