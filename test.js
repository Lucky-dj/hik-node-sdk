const hik = require('./index');

(async () => {
  const Hik = new hik({
    ak: 21955969,
    sk: '4dy8nTqcUKS2yHUhe957',
    uri: '10.0.18.51',
    port: 80,
    protocol: 'http',
  });

  console.log('Hik', Hik);

  const res = await Hik.access_token();

  console.log('res', res);
})();