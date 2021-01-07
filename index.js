'use strict';

const axios = require('axios');
const { uuid } = require('./lib/util');


class Hik {
  constructor(config) {
    if (typeof config.url !== 'string') {
      throw new Error('url is not null');
    }
    if (typeof config.port !== 'number') {
      throw new Error('port is not null');
    }
    if (typeof config.ak !== 'string' || typeof config.sk !== 'string') {
      throw new Error('ak and sk is not null');
    }
    if (config.protocol) {
      if (!['http', 'htpps'].includes(config.protocol)) throw new Error('protocol is http or https');
    }
    this.uri = config.uri;
    this.port = config.port;
    this.ak = config.ak;
    this.sk = config.sk;
    this.protocol = config.protocol || 'http';
    this.url = `${this.protocol}://${this.uri}:${this.port}/artemis`;
  }

  async require(path, data= {}) {
    const headers = {
      'X-Ca-Key': this.ak,
      'X-Ca-Timestamp': moment().local(),
      'X-Ca-Nonce': uuid(true),
    }
  }
}

module.exports = Hik;
