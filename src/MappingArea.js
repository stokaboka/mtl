/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

const TilesCalculator = require('./TilesCalculator');

class MappingArea {
    constructor(pAreaSize){
        
        this.areaSize = 6;
        if(pAreaSize){
            this.areaSize = pAreaSize;
        }
        
        this.halfAreaSize = Math.ceil(this.areaSize / 2);
        
        this.tilesCalculator = new TilesCalculator();
        
        this.point = null;
        this.typePoint = null;
    }
    
    setAreaSize(value){
        this.areaSize = value;
        this.halfAreaSize = Math.ceil(this.value / 2);
        return this;
    }
    
    getZoom(){
        return this.tilesCalculator.zoom;
    }
    setZoom(value){
        this.tilesCalculator.zoom = value;
        return this;
    }
    
    setGeoPoint(point){
        this.point = point;
        this.typePoint = 'GEO';
        return this;
    }
    
    setMeterPoint(point){
        this.point = point;
        this.typePoint = 'METER';
        return this;
    }
    
    setPixelPoint(point){
        this.point = point;
        this.typePoint = 'PIXEL';
        return this;
    }
    
    setTilePoint(point){
        this.point = point;
        this.typePoint = 'TILE';
        return this;
    }
    
    getGrid(){
        let tilePoint = null;
        switch (this.typePoint) {
            case 'GEO':
                tilePoint = this.tilesCalculator
                .pipe([
                    this.tilesCalculator.geoToMeter,
                    this.tilesCalculator.meterToPixels,
                    this.tilesCalculator.pixelToTile
                ])
                .calc(this.point);
                break;
            case 'METER':
                tilePoint = this.tilesCalculator
                .pipe([
                    this.tilesCalculator.meterToPixels,
                    this.tilesCalculator.pixelToTile
                ])
                .calc(this.point);
                break;
            case 'PIXEL':
                tilePoint = this.tilesCalculator
                .pipe([
                    this.tilesCalculator.pixelToTile
                ])
                .calc(this.point);
                break;
            case 'TILE':
                tilePoint = this.point;
                break;
            default:
                return null;
        }
        return {
            begin: {
                x: tilePoint.x - this.halfAreaSize,
                y: tilePoint.y - this.halfAreaSize
            },
            size:  {
                x: this.areaSize,
                y: this.areaSize
            },
            z: this.getZoom()
        }
    }
}

module.exports = MappingArea;
