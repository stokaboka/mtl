/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

'use strict';

const TilesLoader = require('./TilesLoader');
const { GeoPoint, DecartPoint, PixelPoint } = require('./Mercator');
const TilesCalculator = require('./TilesCalculator');
const MappingArea = require('./MappingArea');

const tilesCalculator = new TilesCalculator();

tilesCalculator.zoom = 14;
tilesCalculator.displayParams();

// гаврилов-Ям
let geoPointTest = new GeoPoint( 39.849086, 57.303309 );

let meterPoint = tilesCalculator.geoToMeter( geoPointTest );
console.log(`GEO->METER ${geoPointTest} -> ${meterPoint}`);

let geoPoint = tilesCalculator.meterToGeo( meterPoint );
console.log(`METER->GEO ${meterPoint} ->  ${geoPoint}`);

let pixelPoint = tilesCalculator.meterToPixels( meterPoint );
console.log(`METER->PIXEL ${meterPoint} -> ${pixelPoint}`);

let tilePoint = tilesCalculator.pixelToTile( pixelPoint );
console.log(`PIXEL->TILE ${pixelPoint} -> ${tilePoint}`);

let mappingArea = new MappingArea();

const cfg = {
    logging: {
        level: 2
    },
    images: {
        path: 'D:/projects/mapTilesLoader/images',
        reload: false
    },
    map: {
        z: tilesCalculator.zoom
    },
    grid: mappingArea.getGrid(tilePoint)
};

const tilesLoader = new TilesLoader(cfg);
tilesLoader.start();
