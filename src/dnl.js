/*
 * Copyright (c) 2018. Igor Khorev, Orangem.me, igorhorev@gmail.com
 */

'use strict';

const Fs = require('fs');
const axios = require('axios');

async function downloadImage (url, file) {
    
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    });
    
    response.data.pipe(Fs.createWriteStream(file));
    
    return new Promise((resolve, reject) => {
        response.data.on('end', () => {
            resolve()
        });
        
        response.data.on('error', (e) => {
            reject(e)
        })
    })
    
}

module.exports = downloadImage;
