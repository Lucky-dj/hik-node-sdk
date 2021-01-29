'use strict';

const crypto = require('crypto');
const uuid = require('uuid');
const moment = require('moment');

const EPS = 1e-6;

const Util = {
  md5(text) {
    return crypto.createHash('md5').update(text, 'utf8').digest('hex');
  },

  sha1(text) {
    return crypto.createHash('sha1').update(text, 'utf8').digest('hex');
  },

  hmacSha256(text, secret) {
    return crypto.createHmac('sha256', secret).update(text, 'utf8').digest('base64');
  },

  uuid(line) {
    const id = uuid.v4();
    return line ? id.replace(/-/g, '') : id;
  },

  base64(value) {
    const buf = new Buffer(value);
    return buf.toString('base64');
  },

  randomIntStr(number = 6) {
    const chars = '0123456789';
    const str_len = chars.length;
    let int_str = '';

    for (let i = 0; i < number; i++) {
      const idx = Math.floor(Math.random() * str_len);
      int_str += chars[idx];
    }

    return int_str;
  },

  dateFormat(date = new Date(), fmt = 'YYYY-MM-DD HH:mm:ss', timeZone = 8) {
    return moment(date).utcOffset(timeZone).format(fmt);
  },

  rightInteger(number) {
    return Math.floor(number + EPS);
  },

  base64Decode(str) {
    const result = new Buffer(str, 'base64').toString();
    return result;
  },

  utf8_encode(str) {
    str = str.replace(/\r\n/g, "\n");
    let utftext = "";
    for (let n = 0; n < str.length; n++) {
      let c = str.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }
    return utftext;
  },

  toBase64(input) {
    const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;
    input = this.utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
        keyStr.charAt(enc1) + keyStr.charAt(enc2) +
        keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
  },

  hikHeader(headers) {
    const whiteList = [
      'X-Ca-Signature',
      'X-Ca-Signature-Headers',
      'Accept',
      'Content-MD5',
      'Content-Type',
      'Date',
      'Content-Length',
      'Server',
      'Connection',
      'Host',
      'Transfer-Encoding',
      'X-Application-Context',
      'Content-Encoding'
    ];
    let newHeaders = '\n';
    let signature = '';
    for (const key of Object.keys(headers).sort()) {
      if (!whiteList.includes(key)) {
        newHeaders += `${key.toLowerCase()}:${headers[key]}\n`;
        signature += `${key.toLowerCase()},`
      } else {
        newHeaders += `${headers[key]}\n`;
      }
    }
    return {
      headers: newHeaders,
      'X-Ca-Signature-Headers': signature.substr(0, signature.length - 1)
    };
  },

  hikUrl(url, query = {}) {
    let newUrl = `${url}?`;
    const obj = query;
    for (const key of Object.keys(obj).sort()) {
      newUrl += `${key}=${obj[key] === null ? '' : obj[key]}&`;
    }
    return newUrl.substr(0, newUrl.length - 1);
  },

};

module.exports = Util;