
var mongoose = require('mongoose'),
    termConnection = require('../mongoConnections/term.js'),
     Schema = mongoose.Schema,
     config = require("../config.js")

var TermSchema = new Schema({
    group: {type:String},
    key: {type:String},
    translations:[{
      clientId:{type:Number,default:config.gdgId},
      lang:{type:String},
      val:{type:String},
      needsTrans:{type:Boolean,default:false}
    }],
    updatedAt:{type:Date, default: Date.now},
    updatedBy:{type:String, default: ''},
    createdBy:{type:String, default: ''},
    createdAt:{type:String, default: Date.now},
    comments:{type:String, default: ''},
    softDelete:{type:Boolean,default: false}
});

module.exports = termConnection.model('Term', TermSchema);
