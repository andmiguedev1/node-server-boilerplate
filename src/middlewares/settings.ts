const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const config = require('../utils/environment');

const basicAuth = require('express-basic-auth');
const bodyParser = require('body-parser');

const { handleInternalErrors, handleExternalErrors } = require('../server/errors');

export default (server) => {
  server.use(cors());
  server.use(helmet());

  server.use(handleInternalErrors);
  server.use(handleExternalErrors);

  server.use(
    basicAuth({
      users: { admin: 'password' },
      unauthorizedResponse: (req: Request) => {
        return `Unauthorized request: ${req.mode}`;
      },
      challenge: true,
    })
  );

  if (config.env === 'production') {
    server.use(morgan.setSuccessfulResponse);
    server.use(morgan.setDeniedResponse);
  }

  // parse application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  server.use(bodyParser.json());
};