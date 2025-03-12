const http = require(`http`);
const app = require(`./app`);
const config = require(`./config/app.config`).server;
const server = http.createServer(app);
if(config){
    server.listen(config.port, () => {
        console.log(``);
    });
}else{
    console.log(`Database error`);
}