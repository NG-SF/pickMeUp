
  exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/jokes-app' || 'mongodb://blackSea:3blackSea509@ds261917.mlab.com:61917/jokes-app' ;

  exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/jokes-app-test';

  exports.PORT = process.env.PORT || 8080;

