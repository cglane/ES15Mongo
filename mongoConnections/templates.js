var mongoose = require('mongoose'),
    mongoURI = "gdg_admin:G8Q'j]'ZS}d[]Uvs@mongo.gdg.do:27017/gdg_dev";

module.exports = templateConnection = mongoose.createConnection(mongoURI);

templateConnection.on('connected', function(res){
  console.log('Template DB connected')
})
