/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

/**
 * - общее число тайлов на масштабе 19 - 4^19 = 274 877 906 944
 * - число тайлов по вертикали / горизонтали 4^19 / 2 = 274 877 906 944 / 2 = 137 438 953 472
 * - число пикселей по вертикали / горизонтали 256 * 4^19 / 2 = 256 * 274 877 906 944 / 2 = 36 421 322 670 080
 * @type {Mercator}
 */

const { Mercator, GeoPoint, DecartPoint } = require('./Mercator');

class TilesCalculator {
    constructor(pTileSize){
        
        // mercator algoritm
        this.mercator = new Mercator();
    
        //Длина экватора
        this.equatorLength = 40075016.685578488;
        //  половина экватора
        this.equatorHalfLength = this.equatorLength / 2;
    
        // максимальный масштаб
        this._zoom = 0;
        
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
        
        this.pipeList = [];
        
        // this.init();
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
    
    testZoom(){
        if( this.zoom < 2 || 19 < this.zoom ){
            throw 'TilesCalculator error: zoom not defined or out of range (2-19)';
        }
    }
    
    init(){
    
        this.testZoom();
        
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
    
        this.testZoom();
        
        console.log('--- TilesCalculator parameters ---');
        console.log(`  numTilesByZoom: ${this.numTotalTilesByZoom} / ${this.numTilesByZoom}`);
        console.log(`worldSizeInPixels: ${this.worldSizeInPixels}`);
        console.log(`    pixelsByMeter: ${this.pixelsByMeter}`);
        console.log('==================================');
        console.log();
        return this;
    }
    
    geoToMeter(geoPoint){
        this.testZoom();
        return this.mercator.point2m(geoPoint);
    }
    
    geoToPixels(geoPoint) {
        this.testZoom();
        let point = this.geoToMeter(geoPoint);
        return this.meterToPixels(point);
    }
    
    meterToGeo(meterPoint){
        this.testZoom();
        return this.mercator.point2ll(meterPoint);
    }
    
    meterToPixels(meterPoint){
        this.testZoom();
        let x = Math.round(( this.equatorHalfLength + meterPoint.x) * this.pixelsByMeter ),
            y = Math.round(( this.equatorHalfLength - meterPoint.y) * this.pixelsByMeter );
        
        return new DecartPoint( x, y );
        
    }
    
    pixelsToMeter (pixelPoint) {
        this.testZoom();
        let x = pixelPoint.x / this.pixelsByMeter - this.equatorHalfLength,
            y = this.equatorHalfLength - pixelPoint.y / this.pixelsByMeter;
        
        return new DecartPoint( x, y );
        
    }
    
    pixelsToGeo(pixelPoint) {
        this.testZoom();
        let point = this.pixelsToMeter(pixelPoint);
        return this.meterToGeo(point);
        
    }
    
    pixelToTile(pixelPoint) {
        this.testZoom();
        return new DecartPoint(
            Math.floor(pixelPoint.x / this.tileSize),
            Math.floor(pixelPoint.y / this.tileSize),
        )
    }
    
    pipe(pList){
        this.pipeList = pList;
        return this;
    }
    
    calc(value){

        if(this.pipeList){
            let out = value;
            for (const func of this.pipeList){
                out = func.call(this, out);
            }
            this.pipeList = [];
            return out;
        }else{
            return value;
        }
    }
}

module.exports = TilesCalculator;
