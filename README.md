# hik-node-sdk

海康 Node SDK 版本，非官方，民间制作

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


```

## 问题汇总

1. 未对 POST body 参数进行计算md5，无法进行md5校验，有被修改的风险
