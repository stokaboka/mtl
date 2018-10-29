/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

'use strict';

const TilesLoader = require('./TilesLoader');
const { GeoPoint, DecartPoint, PixelPoint } = require('./Mercator');
// const TilesCalculator = require('./TilesCalculator');
const MappingArea = require('./MappingArea');

// const tilesCalculator = new TilesCalculator();
//
// tilesCalculator.zoom = 14;
// tilesCalculator.displayParams();



// let meterPoint = tilesCalculator.geoToMeter( geoPointTest );
// console.log(`GEO->METER ${geoPointTest} -> ${meterPoint}`);
//
// let geoPoint = tilesCalculator.meterToGeo( meterPoint );
// console.log(`METER->GEO ${meterPoint} ->  ${geoPoint}`);
//
// let pixelPoint = tilesCalculator.meterToPixels( meterPoint );
// console.log(`METER->PIXEL ${meterPoint} -> ${pixelPoint}`);
//
// let tilePoint = tilesCalculator.pixelToTile( pixelPoint );
// console.log(`PIXEL->TILE ${pixelPoint} -> ${tilePoint}`);

// гаврилов-Ям
let geoPointTest = new GeoPoint( 39.849086, 57.303309 );

let mappingArea = new MappingArea();

const cfg = {
    logging: {
        level: 2
    },
    images: {
        path: 'D:/projects/mapTilesLoader/images',
        reload: false
    },
    /**
     * TODO move zoom into "grid"
     */
    map: {
        z: 12
    },
    grid: mappingArea
    .setZoom(12)
    .setGeoPoint(geoPointTest)
    .getGrid()
};

const tilesLoader = new TilesLoader(cfg);
tilesLoader.start();
