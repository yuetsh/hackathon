import randomUseragent from 'random-useragent';
import request from 'request';
import fs from 'fs';
import path from 'path';

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
                console.log(`下载完毕${dir}`);
                resolve();
            });
        });
    });
}

export function downloadMovie(url, dir) {
    console.log(url);
    url = url && url.replace(/\?mime=true#IE/, '');
    return new Promise((resolve, reject) => {
        request.head(url, (err, response, body) => {
            if (err || !response || response.statusCode >= 400) reject(err);
            name = response.headers['Content-Disposition'];
            const steam = request(url).pipe(fs.createWriteStream(dir + '/' + name));
            steam.on('finish', () => resolve());
        });
    });
}