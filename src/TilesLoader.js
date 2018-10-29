/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

// const downloadImage = require('./dnl');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

class TileLoader {
    
    constructor(cfg){

        this.START_URLS_INDEX = 0;
        this.START_TILES_INDEX = 0;
    
        this.ready = false;
        this.started = false;
        this.completed = false;
        
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
            path: 'D:/projects/mapTilesLoader/images',
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
    
        this.init(cfg);
        
        return this;
    }

    init(cfg){
    
        this.started = false;
        this.completed = false;
        
        this.initConfig(cfg);
        this.initDirectory();
        this.initTilesCollection( this.grid );
        
        return this;
    }

    initConfig(cfg){
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
    }
    
    initDirectory() {
        try {
            if(this.checkTilesPath(this.images.path, this.map.z)){
                this.ready = true;
            }else{
                if(this.createTilesDirectory(this.images.path, this.map.z)){
                    this.ready = true;
                }
            }
            
        }catch(e){
            console.log('initDirectory error: ');
            console.log(e);
        }
    }
    
    checkTilesPath(tilesPath, zoom){
        const path = this.getTilesPath(tilesPath, zoom);
        try {
            const stat = fs.statSync(path);
            
            if(stat.isDirectory()){
                return true;
            }else{
                throw `Path is not a directory: ${path}`;
            }
            
        }catch (e) {
            return false;
        }
    }
    
    createTilesDirectory(tilesPath, zoom){
        const path = this.getTilesPath(tilesPath, zoom);
        try {
            fs.mkdirSync(path);
            return true;
        }catch (e) {
            return false;
        }
    }
    
    start(){
    
        if( this.ready ) {
            if (this.started) {
                console.log('TilesLoader already started... Exited.');
            }else{
                this.log(1, '--- START');
    
                this.started = true;
                this.completed = false;
                this.loadedTiles = 0;
    
                this.resetTile();
                this.resetUrl();
    
                this.next();
            }
        }else{
            console.log('Not ready... Exited.');
        }
        
        return this;
    }

    stop() {
        this.log(1, '*** COMPLETE');
        this.log(1, `   LOADED TILES ${this.loadedTiles} from ${this.tiles.length}`);
    
        this.started = false;
        this.completed = true;
        
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

    failureCallback(error) {
    
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
    
    next() {

        this.log(3, '>>> NEXT');

        const turl = this.getCurrentURL();
        const tparams = this.getCurrentParams();
        const fpath = this.getCurrentTileImagePath();

        this.downloadImage(turl, tparams, fpath, `${this.current.tile.x}-${this.current.tile.y}`)
        .then(
            (response) => { this.successCallback(response) }
        ).catch(
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
    
        if(out) {
            this.log(3, '=== NEXT URL ' + this.index.url);
        }
    
        return out;
    }

    nextTile() {
        let out = true;
        
        if ( ++this.index.tile >= this.tiles.length){
            this.log(2, '### Stop tryes TILES');
                out = false;
            }else{
                this.current.tile = this.tiles[this.index.tile];
        }
    
        if(out) {
            this.log(3, '=== NEXT TILE');
        }
        
        return out;
    }

    getCurrentParams(){
        return {
            l: this.map.l,
            v: this.map.v,
            x: this.current.tile.x,
            y: this.current.tile.y,
            z: this.map.z,
            scale: this.map.scale,
            lang: this.map.lang
        }
    }
    
    getCurrentURL(){
        // const out = `${this.current.url}?l=${this.map.l}&v=${this.map.v}&x=${this.current.tile.x}&y=${this.current.tile.y}&z=${this.map.z}&scale=${this.map.scale}&lang=${this.map.lang}`;
        return this.current.url;
    }
    
    getTilesPath(tilesRootPath, zoom){
        let out = path.resolve(tilesRootPath, `${zoom}`);
        return out;
    }
    
    getTileImageFileName(x, y){
        return `${x}-${y}.${this.images.ext}`;
    }
    
    getTileImagePath(x, y){
        return path.resolve(this.getTilesPath(this.images.path, this.map.z), this.getTileImageFileName(x, y));
    }
    
    getCurrentTileImagePath(){
        let out = path.resolve(this.getTilesPath(this.images.path, this.map.z), this.getTileImageFileName(this.current.tile.x, this.current.tile.y) );
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

    initTilesCollection(grid){
        
        let size = grid.size.x * grid.size.y;
        let idx = 0;
        this.tiles = new Array(size);
    
        for(let _x = 0; _x < grid.size.x; _x++){
            for(let _y = 0; _y < grid.size.y; _y++){
    
                this.tiles[idx++] = { x: grid.begin.x + _x, y: grid.begin.y + _y, vec: '' };
            
            }
        }
    
    }
    
    async downloadImage (url, params, file) {
        
        let response = await axios({
            method: 'GET',
            url: url,
            params: params,
            responseType: 'stream'
        });
        
        response.data.pipe(fs.createWriteStream(file));
        
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
