/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

class MappingArea {
    constructor(pAreaSize){
        this.centerTilePoint = null;
        this._areaSize = 6;
        if(pAreaSize){
            this._areaSize = pAreaSize;
        }
        this.halfAreaSize = Math.ceil(this._areaSize / 2);
        
        this.tilesCalculator = new TilesCalculator();
    }
    
    get areaSize(){
        return this._areaSize;
    }
    set areaSize(pAreaSize){
        this._areaSize = pAreaSize;
        this.halfAreaSize = Math.ceil(this._areaSize / 2);
    }
    
    setGeoPoint(geoPoint){
    
    }
    
    getGrid(pCenterTilePoint){
        this.centerTilePoint = pCenterTilePoint;
        return {
            begin: { x: this.centerTilePoint.x - this.halfAreaSize, y: this.centerTilePoint.y - this.halfAreaSize },
            size:  { x: this.areaSize, y: this.areaSize }
        }
    }
}
