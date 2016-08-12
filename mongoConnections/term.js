var mongoose = require('mongoose'),
    mongoURI = "gdg_admin:G8Q'j]'ZS}d[]Uvs@mongo.gdg.do:27017/gdg_langs";

module.exports = termConnection = mongoose.createConnection(mongoURI);

termConnection.on('connected', function(){
  console.log('Term DB connected')
})
