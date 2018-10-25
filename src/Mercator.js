/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
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


let Mercator=({
    
    //Equatorial Radius, WGS84
    r_major:6378137.0,
    
    //defined as constant
    r_minor:6356752.314245179,
    
    //1/f=(a-b)/a , a=r_major, b=r_minor
    f:298.257223563,
    
    deg2rad:function(d)
    {
        return d * (Math.PI / 180.0);
    },
    
    rad2deg:function(r)
    {
        return r / (Math.PI / 180.0);
    },
    
    
    //lat lon to mercator
    ll2m:function(lon, lat)
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
        return {'x': x, 'y': y};
    },
    
    //mercator to lat lon
    m2ll:function(x,y)
    {
        let lon=this.rad2deg(( x / this.r_major ));
        
        let temp = this.r_minor / this.r_major;
        let e = Math.sqrt(1.0 - (temp * temp));
        let lat = this.rad2deg(this.pj_phi2( Math.exp( 0 - ( y / this.r_major ) ), e));

        return {'lon': lon, 'lat': lat};
    },
    
    
    pj_phi2:function(ts, e)
    {
        const TOL = 0.0000000001;
        
        let N_ITER = 15;
        let HALFPI = Math.PI/2;
        
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
});

module.exports.Mercator = Mercator;
