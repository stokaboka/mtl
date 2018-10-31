/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

'use strict';

const Mapper = require('./Mapper');

// гаврилов-Ям
// let geoPointTest = new GeoPoint( 39.849086, 57.303309 );

const mapper = new Mapper( { lon:39.849086, lat:57.303309 }, 11,  '../images');
mapper.start(true);
