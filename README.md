# hik-node-sdk

海康 Node SDK 版本，非官方，民间制作
此包只是封装了加签作用

## 安装

```shell
npm install hik-node-sdk
```

## 使用方法

```javascript
const hik = require('hik-node-sdk');

// 初始化
const Hik = new hik({
  ak: 219***69,          // appKey
  sk: '4dy*******e957',  // appSecret
  uri: '*.*.*.*',        // IP地址 或者 域名
  port: 443,             // 端口
  protocol: 'https',     // http 和 https
});

// 可使用参数 GET/POST/PUT/PATCH/DELETE
const method = 'POST';
// 请求路径：eg /api/v1/oauth/token
// 具体请求路径可看 海康开放API
const path = '/api/v1/oauth/token';
// 请求参数 config.hearders、config.params、config.data
const config = {};

// 请求接口
const { status, data } = await Hik.request(method, path, config)


// 获取 access_token
const { access_token, token_type, expires_in } = await Hik.access_token();
```

## 问题汇总

1. 未对 POST body 参数进行计算md5，无法进行md5校验，有被修改的风险
