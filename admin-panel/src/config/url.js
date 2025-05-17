require('dotenv').config();

module.exports = {
    port: `${process.env.PORT}`,
    // host: `${process.env.HOST}`,
    host: `https://vkm14mvx-5080.inc1.devtunnels.ms/`,
    // apiUrl: `${process.env.BASE_URL}:${process.env.PORT}/${process.env.API}`,
    apiUrl: `https://vkm14mvx-5080.inc1.devtunnels.ms/api`,
    // apiBaseUrl: `${process.env.BASE_URL}:${process.env.PORT}`,
    apiBaseUrl: `https://vkm14mvx-5080.inc1.devtunnels.ms/`,
    // reactBaseUrl: `${process.env.BASE_URL}:${process.env.REACT_PORT}`,
    reactBaseUrl: `https://vkm14mvx-3000.inc1.devtunnels.ms/`,
    // reactApiUrl: `${process.env.BASE_URL}:${process.env.REACT_PORT}/${process.env.API}`,
    reactApiUrl: `https://vkm14mvx-3000.inc1.devtunnels.ms/api`,
}