require('dotenv').config();

module.exports = {
    port: process.env.PORT,
    host: process.env.HOST,
    apiUrl: `${process.env.BASE_URL}:${process.env.PORT}/${process.env.API}`,
    apiBaseUrl: `${process.env.BASE_URL}:${process.env.PORT}`,
    reactBaseUrl: `${process.env.BASE_URL}:${process.env.REACT_PORT}`,
    reactApiUrl: `${process.env.BASE_URL}:${process.env.REACT_PORT}/${process.env.API}`,
}