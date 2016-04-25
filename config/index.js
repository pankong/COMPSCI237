var configValues = require('./config');

module.exports = {
  getMongoDbConnectionString: function() {
    return 'mongodb://' + configValues.username
    + ':' + configValues.password
    + '@ds019491.mlab.com:19491/matching';
  },
  "secret": "compsci237"
}
