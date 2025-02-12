const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const connectDB = require('./config/db');
const url = require('./config/url');
const bodyParser = require('body-parser');
require('dotenv').config();

// helper function 
const helper = require('./utils/helper');

// errors Handling and headers
const errorHandlers = require('./middleware/errorHandler');
const setHeaders = require('./middleware/setHeaders');

// routers
const frontend_routes = require('./routes/frontend/api');
const routes = require('./routes/backend/api');

// base url
const react_base_url = `${url.reactBaseUrl}`;

connectDB();

app.use(cors());

// Allow all origins 
app.use(cors({
    origin: react_base_url, // Allow requests from your front-end
    methods: 'GET, POST, PUT, DELETE, POST', // Specify allowed HTTP methods
    credentials: true // If you're using cookies or authorization headers
}));

// set headers
app.use(setHeaders);

// Create a write stream (in append mode) for logs
const logStream = fs.createWriteStream(path.join(__dirname, './../public/log/' + new Date().toISOString().slice(0, 10) + '-log-access.log'), { flags: 'a' });

// Setup morgan to log requests to both the console and a file
app.use(morgan('combined', { stream: logStream }));

// check the requested api
app.use(morgan('dev'));

// make file or folder statcly to view all
app.use(express.static('public'));

app.use(helper.requestTime);

// use body parser for extracting josn data
app.use(bodyParser.json({ limit: '50mb' }));

// use body parser for extracting url encoded
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

frontend_routes.forEach(frontend => {
    app.use(frontend.path, frontend.module);
});

routes.forEach(route => {
    app.use(route.path, route.module);
});

// Error Handling Middleware
app.use(errorHandlers);

module.exports = app;