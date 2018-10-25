/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

'use strict';

const TilesLoader = require('./TilesLoader');

const cfg = {
    logging: { level: 3 },
    grid: {
        begin: { x: 10001, y: 5001 },
        size:  { x: 3, y: 3 }
    }
};

const tilesLoader = new TilesLoader(cfg);
// yt.init(cfg);
tilesLoader.start();
