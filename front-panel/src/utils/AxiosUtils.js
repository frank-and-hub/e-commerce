import api from './api'
import config from '../config'

const baseUrl = config.reactApiUrl;
const token = localStorage.getItem('token');
const request = async (method, url, data = {}) => {
    try {
        const config = {
            method,
            url: baseUrl + url,
            headers: { ...(token && { Authorization: `Bearer ${token}` }), },
            data: method !== 'get' ? data : undefined,
        };
        // console.time(method.toUpperCase())
        const response = await api(config)
        // console.info(`Successfully received data via ${method.toUpperCase()} method requested to ${url}.`)
        // console.clear()
        return response?.data
    } catch (err) {
        console.error(`Error during the ${method.toUpperCase()} request to ${url} : ${err.status}`)
        if (err.status === 401) {
            localStorage.clear()            
        }
        throw err.message;
    } finally {
        // console.trace()
        // console.timeEnd(config)
    }
};

const get = (url) => request('get', url, {});
const post = (url, data) => request('post', url, data);
const put = (url, data) => request('put', url, data);
const patch = (url, data) => request('patch', url, data);
const destroy = (url) => request('delete', url, {});

// Exporting all methods for easy import in other components
export { get, post, put, patch, destroy }