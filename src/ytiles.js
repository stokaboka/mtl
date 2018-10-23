/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

const downloadImage = require('./dnl');
const Path = require('path');

const START_URLS_INDEX = 0;
const START_TILES_INDEX = 0;

let logging = {
    level: 3
};

let map = {
    l: 'map',
    z: 14,
    lang: 'ru_RU',
    v: '18.10.20-0',
    scale: 1
};

let images = {
    path: 'D:/projects/mapTilesLoader',
    ext: 'png'
};

let tiles = [
    {x: 10005, y: 5008},
    {x: 10005, y: 5009}
];

let grid = {
    begin: { x: 10005, y: 5008, vec: '' },
    end:   { x: 10005, y: 5009, vec: '' }
};

let urls = [
    'vec01',
    'vec02',
    'vec03',
    'vec04',
    'vec05',
    'vec06',
    'vec07'
];

let current = {
    tile: null,
    url: null
};

let index = {
    tile: START_TILES_INDEX,
    url: START_URLS_INDEX
};

let loadedTiles = 0;

function init(cfg){
    
    if(cfg.map) {
        map = Object.assign({}, map, cfg.map);
    }
    
    if(cfg.images) {
        images = Object.assign({}, images, cfg.images)
    }
    
    if(cfg.grid) {
        grid = Object.assign({}, grid, cfg.grid)
    }
    
    if(cfg.logging) {
        logging = Object.assign({}, logging, cfg.logging)
    }
    
    generateTilesCollection( grid );
}

function start(){
    
    log(1, '--- START');
    
    loadedTiles = 0;
    
    resetTile();
    resetUrl();
    
    next();
}

function stop() {
     log(1, '*** COMPLETE');
     log(1, `   LOADED TILES ${loadedTiles} from ${tiles.length}`);
     
     console.log(tiles);
}

function successCallback() {
    log(2, `!!! SUCCEEDED  tile:${index.tile} url:${index.url}`);
    
    fixTile();
    resetUrl();
    
    if( nextTile()){
        next();
    }else{
        stop();
    }
}

function failureCallback(error) {
    
    log(2, `??? FAILURE ${error}  -  tile:${index.tile} url:${index.url}`);
    
    if( nextUrl() ){
        next();
    }else{
        if( nextTile()){
            next();
        }else{
            stop();
        }
    }
}

function next() {
    log(3, '>>> NEXT');
    const turl = getCurrentURL();
    const fpt = getCurrentPATH();
    downloadImage(turl, fpt)
    .then(
        successCallback,
        failureCallback
    );
}

function fixTile() {
    loadedTiles++;
    tiles[index.tile].vec = urls[index.url];
}

function resetUrl(){
    index.url = START_URLS_INDEX;
    current.url = urls[index.url];
    log(3, '=== RESET URL ' + index.url);
}

function resetTile(){
    index.tile = START_TILES_INDEX;
    current.tile = tiles[index.tile];
    log(3, '=== RESET TILE ' + index.tile);
}

function nextUrl(){
    let out = true;
    
    if (++index.url >= urls.length){
        log(3, '### Stop tryes URLS');
        index.url = START_URLS_INDEX;
        out = false;
    }
    
    current.url = getYandexTilesURL( urls[index.url] );
    
    log(3, '=== NEXT URL ' + index.url);
    
    return out;
}

function nextTile() {
    let out = true;
    
    if ( ++index.tile >= tiles.length){
        log(2, '### Stop tryes TILES');
        out = false;
    }else{
        current.tile = tiles[index.tile];
    }
    
    log(3, '=== NEXT TILE');
    
    return out;
}

function getCurrentURL(){
    const out = `${current.url}?l=${map.l}&v=${map.v}&x=${current.tile.x}&y=${current.tile.y}&z=${map.z}&scale=${map.scale}&lang=${map.lang}`;
    return out;
}

function getCurrentPATH(){
    let out = Path.resolve(images.path, 'images', `${current.tile.x}-${current.tile.y}.${images.ext}`);
    return out;
}

function log(l, m){
    if(logging.level >= l) {
        console.log(`${m} - tile:${index.tile} url:${index.url}`);
    }
}

function getYandexTilesURL(vec){
    return `https://${vec}.maps.yandex.net/tiles`;
}

function generateTilesCollection(grid){
    
    // let size = (grid.end.x - grid.begin.x) * (grid.end.y - grid.begin.y);
    let size = grid.size.x * grid.size.y;
    let idx = 0;
    tiles = new Array(size);
    
    for(let _x = 0; _x < grid.size.x; _x++){
        for(let _y = 0; _y < grid.size.y; _y++){
            
            tiles[idx++] = { x: grid.begin.x + _x, y: grid.begin.y + _y, vec: '' };
            
        }
    }
    
}

module.exports.init = init;
module.exports.start = start;
