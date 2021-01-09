'use strict';

const axios = require('axios');
const { uuid, hmacSha256, hikHeader, hikUrl } = require('./lib/util');


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

  /**
   * 
   * @param {String} method 请求方式：GET/POST/PUT/PATCH/DELETE
   * @param {String} path 请求路径：eg /api/v1/oauth/token
   * @param {Object} config 请求参数
   * @param {Object} config.headers 请求headers
   * @param {Object} config.params  `params` are the URL parameters to be sent with the request
   * @param {Object} config.data    `data` is the data to be sent as the request body
   * @param {String} config.data    syntax alternative to send data into the body
   */
  async require(method, path, config= {}) {

    method = method.toUpperCase();

    const url = `${this.url}${path}`;
    const _url = hikUrl(url, {}, body);

    let headers = {
      'X-Ca-Key': this.ak,
      'X-Ca-Timestamp': moment().local(),
      'X-Ca-Nonce': uuid(true),
    };
    if (config.headers) headers = { ...headers, ...config.headers };
    const { headers: _headers, 'X-Ca-Signature-Headers': signatureHeaders } = hikHeader(headers);

    headers['X-Ca-Signature-Headers'] = signatureHeaders;
    headers['X-Ca-Signature'] = hmacSha256(`${method}${_headers}${_url}`, this.sk);

    const { status, data } = await axios({
      ...config,
      url,
      method,
      headers,
    });
    return { status, data };
  }

  /**
   * 获取 access_token
   * @returns {String} access_token token值，可作为header入参“access_token”调用其它OpenAPI接口
   * @returns {String} token_type token类型，bearer：合作方token
   * @returns {Number} expires_in token过期时间，单位：秒
   * 
   * 注意: 综合安防管理平台iSecure Center V1.4及以上版本
   * 
   * 调用【获取API网关接口调用token】接口，获取返回参数access_token，access_token默认有效期为12小时。
   */
  async access_token() {
    const { status, data: { code, msg, data } } = await this.request('POST', '/api/v1/oauth/token');
    if (status !== 200) {
      throw new Error(`服务器出现了故障 status: ${status}`);
    }
    if (status === 200 || code !== '0') {
      throw new Error(`
        API网关返回错误，错误码地址 https://open.hikvision.com/docs/807ffeb51513460197ab0110ae3efcfe
        code: ${code}
        msg: ${msg}
      `);
    }
    return data;
  }
}

module.exports = Hik;
