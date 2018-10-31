/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 *
 * Elliptical (true) Mercator Projection
 *  This projection gives more accurate aspect ratios for objects anywhere on Earth, and respects their angles with higher precision. However this project is not used on most maps used on the OSM websites and in editors.
 *
 * https://wiki.openstreetmap.org/wiki/Mercator#JavaScript_.28or_ActionScript.29_implementation
 *
 * usage:
 *
 * //output mercator.x, mercator.y
 * let mercator=Mercator.ll2m(47.6035525, 9.770602);
 *
 * //output latlon.lat, latlon.lon
 * let latlon=Mercator.m2ll(5299424.36041, 1085840.05328);
 *
 */

/*
 * Spherical Pseudo-Mercator projection
 * Most of OSM, including the main tiling system, uses a Pseudo-Mercator projection where the Earth is modelized as if it was a perfect a sphere.

 * This produces a fast approximation to the truer, but heavier elliptical projection, where the Earth would be projected on a more accurate ellipsoid (flattened on poles). As a consequence, direct mesurements of distances in this projection will be approximative, except on the Equator, and the aspect ratios on the rendered map for true squares measured on the surface on Earth will slightly change with latitude and angles not so precisely preserved by this spherical projection.
*/

/*
RAD2DEG = 180 / Math.PI;
PI_4 = Math.PI / 4;

// The following functions take or return their results in degrees

function y2lat(y) { return (Math.atan(Math.exp(y / RAD2DEG)) / PI_4 - 1) * 90; }
function x2lon(x) { return x; }

function lat2y(lat) { return Math.log(Math.tan((lat / 90 + 1) * PI_4 )) * RAD2DEG; }
function lon2y(lon) { return lon; }
 */

class GeoPoint {
    
    constructor(lon, lat){
        this.lon = lon;
        this.lat = lat;
    }
    
    toString(){
        return `lon:${this.lon} lat:${this.lat}`;
    }
}

class DecartPoint {
    
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    
    toString(){
        return `x:${this.x} y:${this.y}`;
    }
}

class Mercator {
    
    constructor(){
        //Equatorial Radius, WGS84
        this.r_major = 6378137.0
        
        //defined as constant
        this.r_minor = 6356752.314245179
        
        //1/f=(a-b)/a , a=r_major, b=r_minor
        this.f = 298.257223563
    }
    
    deg2rad (d)
    {
        return d * (Math.PI / 180.0);
    }
    
    rad2deg (r)
    {
        return r / (Math.PI / 180.0);
    }
    
    point2m (point)
    {
        return this.ll2m( point.lon, point.lat )
    }
    
    point2ll (point){
        return this.m2ll( point.x, point.y )
    }
    
    //lat lon to mercator
    ll2m (lon, lat)
    {
        //lat, lon in rad
        let x = this.r_major * this.deg2rad(lon);
        
        if (lat > 89.5) lat = 89.5;
        if (lat < -89.5) lat = -89.5;
        
        
        let temp = this.r_minor / this.r_major;
        let es = 1.0 - (temp * temp);
        let eccent = Math.sqrt( es );
        
        let phi = this.deg2rad( lat );
        
        let sinphi = Math.sin(phi);
        
        let con = eccent * sinphi;
        let com = .5 * eccent;
        let con2 = Math.pow(( 1.0 - con ) / ( 1.0 + con ), com);
        let ts = Math.tan(.5 * ( Math.PI*0.5 - phi )) / con2;
        let y = 0 - this.r_major * Math.log( ts );
        
        return  new DecartPoint( x, y );
    }
    
    //mercator to lat lon
    m2ll ( x,y )
    {
        let lon=this.rad2deg(( x / this.r_major ));
        
        let temp = this.r_minor / this.r_major;
        let e = Math.sqrt(1.0 - (temp * temp));
        let lat = this.rad2deg(this.pj_phi2( Math.exp( 0 - ( y / this.r_major ) ), e));
        
        return  new GeoPoint( lon, lat );
    }
    
    pj_phi2 (ts, e)
    {
        const TOL = 0.0000000001;
    
        const N_ITER = 15;
        const HALFPI = Math.PI/2;
        
        let eccnth, Phi, con, dphi, i;
        
        eccnth = .5 * e;
        Phi = HALFPI - 2. * Math.atan (ts);
        i = N_ITER;
        
        do
        {
            con = e * Math.sin (Phi);
            dphi = HALFPI - 2. * Math.atan (ts * Math.pow((1. - con) / (1. + con), eccnth)) - Phi;
            Phi += dphi;
            
        }
        while ( Math.abs(dphi)>TOL && --i);
        
        return Phi;
    }
}

module.exports = { Mercator, GeoPoint, DecartPoint };
