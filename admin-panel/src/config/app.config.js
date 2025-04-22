const secrets = require('@/config/secrets');
const url = require('@/config/url');

module.exports = {
    server: {
        port: url.port,
        host: url.host
    },
    api: {
        baseUrl: secrets.apiBaseUrl
    },
    environment: secrets.nodeEnv,
    secret: secrets.secrate
}
