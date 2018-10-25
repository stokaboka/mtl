/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

'use strict';

const TilesLoader = require('./TilesLoader');
const TilesCalculator = require('./TilesCalculator');

const cfg = {
    logging: { level: 3 },
    grid: {
        begin: { x: 10001, y: 5001 },
        size:  { x: 3, y: 3 }
    }
};

const tilesCalculator = new TilesCalculator();


    let mPoint = tilesCalculator.ll2m({lon: 59.57, lat: 9.770602}, 10);
    console.log(mPoint);

    let llPoint = tilesCalculator.m2ll( { x: 5299203.224250865, y: 1085722.2185366796 } );
    console.log(llPoint);
    
// const tilesLoader = new TilesLoader(cfg).start();
// tilesLoader.start();
