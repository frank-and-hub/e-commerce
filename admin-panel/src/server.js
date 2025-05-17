const http = require(`http`);
const app = require(`./app`);
const config = require(`@/config/app.config`).server;
const server = http.createServer(app);

config
  ? server.listen(config.port, () => {
      console.log(``, new Date());
    })
  : console.log(`Database error`);