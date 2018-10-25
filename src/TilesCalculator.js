/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

/**
 * - общее число тайлов на масштабе 19 - 4^19 = 274 877 906 944
 * - число тайлов по вертикали / горизонтали 4^19 / 2 = 274 877 906 944 / 2 = 137 438 953 472
 * - число пикселей по вертикали / горизонтали 256 * 4^19 / 2 = 256 * 274 877 906 944 / 2 = 36 421 322 670 080
 * @type {Mercator}
 */

const Mercator = require('./Mercator');

class TilesCalculator {
    constructor(){
        
        // mercator algoritm
        this.mercator = new Mercator();
    
        //Длина экватора
        this.equatorLength = 40075016.685578488;
    
        // Размер мира в пикселах
        this.worldSize = Math.pow(2, 31)
    }
    
    ll2m(llPoint){
        let m = this.mercator.point2m( llPoint );
        return m;
    }
    
    m2ll(mPoint){
        let ll = this.mercator.point2ll( mPoint );
        return ll;
    }
    
    m2t(mPoint){
        let a = this.worldSize / this.equatorLength;
        let b = this.equatorLength / 2;
        return {
            x: Math.round((b + mPoint.x) * a),
            y: Math.round((b - mPoint.y) * a)
        };
    }
    
    pixelsToMercator (p) {
        let a = this.worldSize / this.equatorLength;
        let b = this.equatorLength / 2;
    
        return { x: p.x / a - b, y: b - p.y / a };
    }
    
}

module.exports = TilesCalculator;
