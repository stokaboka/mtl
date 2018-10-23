/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

'use strict';

const downloadImage = require('./dnl');
const Path = require('path');

const START_URLS_INDEX = 0;
const START_TILES_INDEX = 0;

let map = {
    l: 'map',
    z: 14,
    lang: 'ru_RU',
    v: '18.10.20-0',
    scale: 1
};

let image = {
    path: 'D:/projects/mapTilesLoader',
    ext: 'png'
};

let tiles = [
    {x: 10005, y: 5008},
    {x: 10005, y: 5009}
];

let urls = [
    'https://vec01.maps.yandex.net/tiles',
    'https://vec02.maps.yandex.net/tiles',
    'https://vec03.maps.yandex.net/tiles',
    'https://vec04.maps.yandex.net/tiles',
    'https://vec05.maps.yandex.net/tiles',
    'https://vec06.maps.yandex.net/tiles',
    'https://vec07.maps.yandex.net/tiles',
];

let current = {
    tile: null,
    url: null
};

let index = {
    tile: START_TILES_INDEX,
    url: START_URLS_INDEX
};

// let url = 'https://vec03.maps.yandex.net/tiles?l=map&x=10005&y=5008&z=14&scale=1&lang=ru_RU';
// let url = 'https://vec03.maps.yandex.net/tiles?l=map&x=10005&y=5009&z=14&scale=1&lang=ru_RU';
//
//
// downloadImage(url, 'D:/projects/mapTilesLoader', 'code.jpg').then(successCallback, failureCallback);
// downloadImage(url1, 'D:/projects/mapTilesLoader', 'code1.jpg').then(successCallback, failureCallback);


// for (let tile in tiles){
//     let fpt = Path.resolve(image.path, 'images', `${tile.x}-${tile.y}.${image.ext}`);
//     for (let url in urls){
//         const turl = `${url}?l=${map.l}&v=${map.v}&x=${tile.x}&y=${tile.y}&z=${map.z}&scale=${map.scale}&lang=${map.lang}`;
//         downloadImage(turl, fpt);
//     }
// }


function start(){
    resetTile();
    resetUrl();
    
    next();
}

function successCallback(result) {
    console.log("It succeeded with " + result);
    resetUrl();
    if( nextTile()){
        next();
    }else{
        console.log('*** COMPLETE');
    }
}

function failureCallback(error) {
    
    if( nextUrl() ){
        next();
    }else{
        if( nextTile()){
            next();
        }else{
            console.log('*** COMPLETE');
        }
    }
}

function next() {
    const turl = getCurrentURL();
    const fpt = getCurrentPATH();
    downloadImage(turl, fpt);
}

function resetUrl(){
    index.url = START_URLS_INDEX;
    current.url = urls[index.url];
}

function resetTile(){
    index.tile = START_TILES_INDEX;
    current.tile = tiles[index.tile];
}

function nextUrl(){
    let out = true;
    
    if (++index.url >= urls.length){
        console.log(`Stop tryes URLS x:${current.tile.x} y:${current.tile.y}`);
        index.url = START_URLS_INDEX;
        out = false;
    }
    
    current.url = urls[index.url];
    
    return out;
}

function nextTile() {
    let out = true;
    
    if ( ++index.tile >= tiles.length){
        console.log('Stop tryes TILES');
        out = false;
    }else{
        current.tile = tiles[index.tile];
    }
    
    return out;
}

function getCurrentURL(){
    const out = `${current.url}?l=${map.l}&v=${map.v}&x=${current.tile.x}&y=${current.tile.y}&z=${map.z}&scale=${map.scale}&lang=${map.lang}`;
    return out;
}

function getCurrentPATH(){
    let out = Path.resolve(image.path, 'images', `${current.tile.x}-${current.tile.y}.${image.ext}`);
    return out;
}



start();
