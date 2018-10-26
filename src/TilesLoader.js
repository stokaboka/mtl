/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

// const downloadImage = require('./dnl');
const Path = require('path');
const Fs = require('fs');
const axios = require('axios');

class TileLoader {
    
    constructor(cfg){

        this.START_URLS_INDEX = 0;
        this.START_TILES_INDEX = 0;
    
        this.logging = {
            level: 3
        };
    
        this.map = {
            l: 'map',
            z: 14,
            lang: 'ru_RU',
            v: '18.10.20-0',
            scale: 1
        };
    
        this.images = {
            path: 'D:/projects/mapTilesLoader',
            ext: 'png'
        };
    
        this.tiles = [
            {x: 10005, y: 5008},
            {x: 10005, y: 5009}
        ];
    
        this.grid = {
            begin: { x: 10005, y: 5008, vec: '' },
            end:   { x: 10005, y: 5009, vec: '' }
        };
    
        this.urls = [ 'vec01', 'vec02', 'vec03', 'vec04', 'vec05', 'vec06', 'vec07' ];
    
        this.current = {
            tile: null,
            url: null
        };
    
        this.index = {
            tile: this.START_TILES_INDEX,
            url: this.START_URLS_INDEX
        };
    
        this.loadedTiles = 0;
    
        this.init(cfg)
        
        return this;
    }

    init(cfg){
        
        if(cfg.map) {
            this.map = Object.assign({}, this.map, cfg.map);
        }
        
        if(cfg.images) {
            this.images = Object.assign({}, this.images, cfg.images)
        }
        
        if(cfg.grid) {
            this.grid = Object.assign({}, this.grid, cfg.grid)
        }
        
        if(cfg.logging) {
            this.logging = Object.assign({}, this.logging, cfg.logging)
        }
        
        this.generateTilesCollection( this.grid );
    
        return this;
    }

    start(){
    
        this.log(1, '--- START');
    
        this.loadedTiles = 0;
    
        this.resetTile();
        this.resetUrl();
    
        this.next();
    
        return this;
    }

    stop() {
        this.log(1, '*** COMPLETE');
        this.log(1, `   LOADED TILES ${this.loadedTiles} from ${this.tiles.length}`);
    
        if( this.logging.level > 0) {
            console.log(this.tiles);
        }
}

    successCallback(response) {

        this.log(2, `!!! SUCCEEDED  tile:${this.index.tile} url:${this.index.url}`);
    
        this.fixTile();
        this.resetUrl();
    
        this.nextOrStop();
    }

    failureCallback(error, response) {
    
        this.log(2, `??? FAILURE ${error}  -  tile:${this.index.tile} url:${this.index.url}`);
    
        if( this.nextUrl() ){
            this.next();
        }else{
            this.nextOrStop();
        }
    }

    nextOrStop() {
        if( this.nextTile()){
            this.next();
        }else{
            this.stop();
        }
    }
    
    async next() {

        this.log(3, '>>> NEXT');

        const turl = this.getCurrentURL();
        const fpt = this.getCurrentPATH();

        await this.downloadImage(turl, fpt)
        .then(
            () => { this.successCallback() },
            (error) => { this.failureCallback(error) }
        );
    }

    fixTile() {
        this.loadedTiles++;
        if( 0 <= this.index.tile && this.index.tile < this.tiles.length) {
            this.tiles[this.index.tile].vec = this.urls[this.index.url];
        }
    }

    resetUrl(){
        this.index.url = this.START_URLS_INDEX;
        this.current.url = this.urls[this.index.url];
        this.log(3, '=== RESET URL ' + this.index.url);
    }

    resetTile(){
        this.index.tile = this.START_TILES_INDEX;
        this.current.tile = this.tiles[this.index.tile];
        this.log(3, '=== RESET TILE ' + this.index.tile);
    }

    nextUrl(){
        let out = true;
    
        if (++this.index.url >= this.urls.length){
            this.log(3, '### Stop tryes URLS');
            this.index.url = this.START_URLS_INDEX;
            out = false;
        }
    
        this.current.url = this.getYandexTilesURL( this.urls[this.index.url] );
    
        this.log(3, '=== NEXT URL ' + this.index.url);
    
        return out;
    }

    nextTile() {
        let out = true;
        
        this.log(3, '=== NEXT TILE');
        
        if ( ++this.index.tile >= this.tiles.length){
            this.log(2, '### Stop tryes TILES');
                out = false;
            }else{
                this.current.tile = this.tiles[this.index.tile];
        }
    
        return out;
    }

    getCurrentURL(){
        const out = `${this.current.url}?l=${this.map.l}&v=${this.map.v}&x=${this.current.tile.x}&y=${this.current.tile.y}&z=${this.map.z}&scale=${this.map.scale}&lang=${this.map.lang}`;
        return out;
    }

    getCurrentPATH(){
        let out = Path.resolve(this.images.path, 'images', `${this.current.tile.x}-${this.current.tile.y}.${this.images.ext}`);
        return out;
    }

    log(l, m){
        if(this.logging.level >= l) {
            console.log(`${m} - tile:${this.index.tile} url:${this.index.url}`);
        }
    }

    getYandexTilesURL(vec){
        return `https://${vec}.maps.yandex.net/tiles`;
    }

    generateTilesCollection(grid){
    
        // let size = (grid.end.x - grid.begin.x) * (grid.end.y - grid.begin.y);
        let size = grid.size.x * grid.size.y;
        let idx = 0;
        this.tiles = new Array(size);
    
        for(let _x = 0; _x < grid.size.x; _x++){
            for(let _y = 0; _y < grid.size.y; _y++){
    
                this.tiles[idx++] = { x: grid.begin.x + _x, y: grid.begin.y + _y, vec: '' };
            
            }
        }
    
    }
    
    async downloadImage (url, file) {
        
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });
        
        response.data.pipe(Fs.createWriteStream(file));
        
        return new Promise(function(resolve, reject) {
            response.data.on('end', (response) => {
                resolve(response)
            });
            
            response.data.on('error', (e, response) => {
                reject(e, response)
            })
        })
        
    }
    
}

module.exports = TileLoader;

// module.exports.init = init;
// module.exports.start = start;
