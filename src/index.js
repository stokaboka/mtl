/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

'use strict';

const yt = require('./ytiles');

const cfg = {
    logging: { level: 3 },
    grid: {
        begin: { x: 10001, y: 5001 },
        size:  { x: 3, y: 3 }
    }
};

yt.init(cfg);
yt.start();

// const downloadImage = require('./dnl');
// const Path = require('path');
//
// const START_URLS_INDEX = 0;
// const START_TILES_INDEX = 0;
//
// let map = {
//     l: 'map',
//     z: 14,
//     lang: 'ru_RU',
//     v: '18.10.20-0',
//     scale: 1
// };
//
// let image = {
//     path: 'D:/projects/mapTilesLoader',
//     ext: 'png'
// };
//
// let tiles = [
//     {x: 10005, y: 5008},
//     {x: 10005, y: 5009}
// ];
//
// let urls = [
//     'https://vec01.maps.yandex.net/tiles',
//     'https://vec02.maps.yandex.net/tiles',
//     'https://vec03.maps.yandex.net/tiles',
//     'https://vec04.maps.yandex.net/tiles',
//     'https://vec05.maps.yandex.net/tiles',
//     'https://vec06.maps.yandex.net/tiles',
//     'https://vec07.maps.yandex.net/tiles'
// ];
//
// let current = {
//     tile: null,
//     url: null
// };
//
// let index = {
//     tile: START_TILES_INDEX,
//     url: START_URLS_INDEX
// };
//
// let loadedTiles = 0;
//
// function start(){
//
//     log('--- START');
//
//     loadedTiles = 0;
//
//     resetTile();
//     resetUrl();
//
//     next();
// }
//
// function stop() {
//     console.log('*** COMPLETE');
//     log(`   LOADED TILES ${loadedTiles} from ${tiles.length}`);
// }
//
// function successCallback() {
//     console.log(`!!! SUCCEEDED  tile:${index.tile} url:${index.url}`);
//     loadedTiles++;
//     resetUrl();
//     if( nextTile()){
//         next();
//     }else{
//         stop();
//     }
// }
//
// function failureCallback(error) {
//
//     console.log(`??? FAILURE ${error}  -  tile:${index.tile} url:${index.url}`);
//
//     if( nextUrl() ){
//         next();
//     }else{
//         if( nextTile()){
//             next();
//         }else{
//             stop();
//         }
//     }
// }
//
// function next() {
//     log('>>> NEXT');
//     const turl = getCurrentURL();
//     const fpt = getCurrentPATH();
//     downloadImage(turl, fpt)
//     .then(
//         successCallback,
//         failureCallback
//     );
// }
//
// function resetUrl(){
//     index.url = START_URLS_INDEX;
//     current.url = urls[index.url];
//     log('=== RESET URL ' + index.url);
// }
//
// function resetTile(){
//     index.tile = START_TILES_INDEX;
//     current.tile = tiles[index.tile];
//     log('=== RESET TILE ' + index.tile);
// }
//
// function nextUrl(){
//     let out = true;
//
//     if (++index.url >= urls.length){
//         log('### Stop tryes URLS');
//         index.url = START_URLS_INDEX;
//         out = false;
//     }
//
//     current.url = urls[index.url];
//
//     log('=== NEXT URL ' + index.url);
//
//     return out;
// }
//
// function nextTile() {
//     let out = true;
//
//     if ( ++index.tile >= tiles.length){
//         log('### Stop tryes TILES');
//         out = false;
//     }else{
//         current.tile = tiles[index.tile];
//     }
//
//     log('=== NEXT TILE');
//
//     return out;
// }
//
// function getCurrentURL(){
//     const out = `${current.url}?l=${map.l}&v=${map.v}&x=${current.tile.x}&y=${current.tile.y}&z=${map.z}&scale=${map.scale}&lang=${map.lang}`;
//     return out;
// }
//
// function getCurrentPATH(){
//     let out = Path.resolve(image.path, 'images', `${current.tile.x}-${current.tile.y}.${image.ext}`);
//     return out;
// }
//
// function log(m){
//     console.log(`${m} - tile:${index.tile} url:${index.url}`);
// }
//
// function generateTilesCollection(begin, end){
//     let size = (end.x - begin.x) * (end.y - begin.y);
//     let idx = 0;
//     tiles = new Array(size);
//     for(let x = begin.x; x < end.x; x++){
//         for(let y = begin.y; y < end.y; y++){
//             tiles[idx++] = {
//                 x: x,
//                 y: y
//             };
//         }
//     }
//     tiles = [
//         {x: 10005, y: 5008},
//         {x: 10005, y: 5009}
//     ]
// }
//
// start();
