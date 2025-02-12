const secrets = require('./secrets');
const url = require('./url');

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
