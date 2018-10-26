/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

/**
 * - общее число тайлов на масштабе 19 - 4^19 = 274 877 906 944
 * - число тайлов по вертикали / горизонтали 4^19 / 2 = 274 877 906 944 / 2 = 137 438 953 472
 * - число пикселей по вертикали / горизонтали 256 * 4^19 / 2 = 256 * 274 877 906 944 / 2 = 36 421 322 670 080
 * @type {Mercator}
 */

const { Mercator, GeoPoint, DecartPoint, PixelPoint } = require('./Mercator');

class MappingArea {
    constructor(pAreaSize){
        this.centerTilePoint = null;
        this._areaSize = 6;
        if(pAreaSize){
            this._areaSize = pAreaSize;
        }
        this.halfAreaSize = Math.ceil(this._areaSize / 2);
    }
    
    get areaSize(){
        return this._areaSize;
    }
    set areaSize(pAreaSize){
        this._areaSize = pAreaSize;
        this.halfAreaSize = Math.ceil(this._areaSize / 2);
    }
    
    getGrid(pCenterTilePoint){
        this.centerTilePoint = pCenterTilePoint;
        return {
            begin: { x: this.centerTilePoint.x - this.halfAreaSize, y: this.centerTilePoint.y - this.halfAreaSize },
            size:  { x: this.areaSize, y: this.areaSize }
        }
    }
}

class TilesCalculator {
    constructor(pTileSize){
        
        // mercator algoritm
        this.mercator = new Mercator();
    
        //Длина экватора
        this.equatorLength = 40075016.685578488;
        //  половина экватора
        this.equatorHalfLength = this.equatorLength / 2;
    
        // максимальный масштаб
        this._zoom = 19;
        
        // размер (ширина = высота) тайла
        this._tileSize = 256;
        if(pTileSize){
            this._tileSize = pTileSize;
        }
        
        // общее количество тайлов при максимальном масштабе
        this.numTotalTilesByZoom = 0;
        this.numTilesByZoom = 0;
        
        // Размер мира в пикселах ширина = высота =
        // this.worldSizeInPixels = Math.pow(2, 31)
        this.worldSizeInPixels = 0;
        // this.__worldSizeInPixels__ = Math.pow( 2, ( this.zoom + 8 ) );
        
        // пикселей на метр
        this.pixelsByMeter = 0;
        
        this.init();
    }
    
    get zoom(){
        return this._zoom;
    }
    set zoom(value){
        this._zoom = value;
        this.init();
    }
    
    get tileSize(){
        return this._tileSize;
    }
    
    set tileSize(value){
        this._tileSize = value;
        this.init();
    }
    
    init(){
        // общее количество тайлов при заданном масштабе
        this.numTotalTilesByZoom = Math.pow( 4, this.zoom );
        this.numTilesByZoom = Math.sqrt( this.numTotalTilesByZoom );
    
        // Размер мира в пикселах ширина = высота =
        // this.worldSizeInPixels = Math.pow(2, 31)
        this.worldSizeInPixels = this.tileSize * this.numTilesByZoom;
        // this.__worldSizeInPixels__ = Math.pow( 2, ( this.zoom + 8 ) );
    
        // пикселей на метр
        this.pixelsByMeter = this.worldSizeInPixels / this.equatorLength;
        
        return this;
    }
    
    displayParams(){
        console.log('--- TilesCalculator parameters ---');
        console.log(`  numTilesByZoom: ${this.numTotalTilesByZoom} / ${this.numTilesByZoom}`);
        // console.log(`worldSizeInPixels: ${this.worldSizeInPixels} ?= ${this.__worldSizeInPixels__}`);
        console.log(`worldSizeInPixels: ${this.worldSizeInPixels}`);
        console.log(`    pixelsByMeter: ${this.pixelsByMeter}`);
        console.log('---------------------------------');
        console.log();
        return this;
    }
    
    geoToMeter(geoPoint){
        let m = this.mercator.point2m( geoPoint );
        return m;
    }
    
    geoToPixels(geoPoint) {
        let meterPoint = this.geoToMeter(geoPoint);
        return this.meterToPixels(meterPoint);
    }
    
    meterToGeo(meterPoint){
        let ll = this.mercator.point2ll( meterPoint );
        return ll;
    }
    
    meterToPixels(meterPoint){
        
        let x =  Math.round(( this.equatorHalfLength + meterPoint.x) * this.pixelsByMeter ),
            y = Math.round(( this.equatorHalfLength - meterPoint.y) * this.pixelsByMeter );
        
        return new PixelPoint( x, y );
        
    }
    
    pixelsToMeter (pixelPoint) {
        
        let x = pixelPoint.x / this.pixelsByMeter - this.equatorHalfLength,
            y = this.equatorHalfLength - pixelPoint.y / this.pixelsByMeter;
        
        return new MeterPoint( x, y );
        
    }
    
    pixelsToGeo(pixelPoint) {
        let meterPoint = this.pixelsToMeter(pixelPoint);
        return this.meterToGeo(meterPoint);
    }
    
    pixelToTile(pixelPoint) {
        return new PixelPoint(
            Math.floor(pixelPoint.x / this.tileSize),
            Math.floor(pixelPoint.y / this.tileSize),
        )
    }
}

module.exports = { TilesCalculator, MappingArea };
