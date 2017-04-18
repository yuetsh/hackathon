import randomUseragent from 'random-useragent';
import request from 'request';
import fs from 'fs';
import path from 'path';

export function getOptions(url) {
    return {
        url,
        headers: {
            'User-Agent': randomUA()
        },
        encoding: null,
        gzip: false,
        timeout: 5000
    };
}

export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomUA() {
    return randomUseragent.getRandom();
}

export function download(url, dir) {
    dir = path.join(dir, path.basename(url));
    console.log(dir);
    return new Promise((resolve, reject) => {
        request.head(url, (err, res, body) => {
            if (err) reject(err);
            const steam = request(url).pipe(fs.createWriteStream(dir));
            steam.on('finish', () => {
                console.log(`downloaded ${dir}`);
                resolve();
            });
        });
    });
}
