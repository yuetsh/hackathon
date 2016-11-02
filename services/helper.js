import randomUseragent from 'random-useragent';

export function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomUA() {
    return randomUseragent.getRandom();
}