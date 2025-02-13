
const config = {
    baseUrl: process.env.REACT_APP_BASE_URL,
    reactUrl: `${process.env.REACT_APP_BASE_URL}:${process.env.REACT_APP_API_PORT}`,
    reactApiUrl: `${process.env.REACT_APP_BASE_URL}:${process.env.REACT_APP_API_PORT}/api`,
    pageignation: `${process.env.REACT_APP_PAGEIGNATION}`
};

export default config;