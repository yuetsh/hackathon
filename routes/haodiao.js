import request from 'request';
import cheerio from 'cheerio';
import Router from 'koa-router';
import fs from 'fs';
import { downloadMovie, randomUA } from '../services/helper';

const router = new Router();

router.prefix('/haodiao');

router.get('/', async (ctx) => {
    ctx.body = 'haodiao';
    const url = 'http://haodiao.org/';
    const dir = 'images';

    let index = 3818;
    function getNextUrl(url) {
        index++;
        return url + index;
    }

    async function visitPage(url) {
        // Make the request
        const options = {
            url,
            headers: {
                'User-Agent': randomUA()
            },
            encoding: null,
            gzip: false,
            timeout: 5000
        };
        request(options, async (error, response, body) => {
            // Check status code (200 is HTTP OK)
            if (error || !response || response.statusCode >= 400) {
                console.log('error', error);
                return crawl();
            }
            // Parse the document body
            var $ = cheerio.load(body.toString());
            const elem = $('video#olvideo_html5_api');
            if (!elem) return;
            elem.onclick()
            const src = elem.attr('src');
            await downloadMovie(src, dir);
            console.log('下载完成' + src);
            return crawl();
        });
    }

    async function crawl() {
        console.log(index, '[index]');
        if (index < 3826) {
            const currentPage = getNextUrl(url);
            visitPage(currentPage);
        } else {
            console.log('done');
        }
    }

    crawl();
});

export default router;