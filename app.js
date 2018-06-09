const express = require('express');
const logger = require('./utils/logger');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');

const app = express();
const port = config.server_port || 3000;

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./controllers'));

app.listen(port, () => {
  logger.verbose(`Running server on port ${port}`);
});
