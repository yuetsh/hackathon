import request from 'request';
import cheerio from 'cheerio';
import Router from 'koa-router';
import fs from 'fs';
import { download, randomUA, getOptions, random } from '../services/helper';
import mkdirp from 'mkdirp';

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


router.get('/mm', async (ctx) => {
    ctx.body = 'mmjpg/mm';

    let index = 1;

    function mkdir(index) {
        return new Promise((res, rej) => mkdirp(`images/mm/${index}`, (err) => {
            if (err) rej(err);
            console.log('mkdir folder: ', index);
            res(`images/mm/${index}`);
        }));
    }

    async function visitPage(url, dir) {
        // Make the request
        const options = getOptions(url);
        try {
            setTimeout(() => request(options, async (error, response, body) => {
                // Check status code (200 is HTTP OK)
                if (error || !response || response.statusCode >= 400) {
                    console.error(error);
                    return;
                }
                // Parse the document body
                var $ = cheerio.load(body.toString());
                const src = $('#content img').attr('src');
                await download(src, dir);
            }), random(1000, 2000));
        } catch (err) {
            console.error(err);
        }
    }

    async function crawl() {
        for (let index = 1; index < 900; index++) {
            // let dir = await mkdir(index);
            let dir = 'images/mm/' + index;
            let url = `http://www.mmjpg.com/mm/${index}/`;
            for (let i = 1; i < 50; i++) {
                visitPage(url + i, dir);
            }
        }
    }

    crawl();
});

export default router;