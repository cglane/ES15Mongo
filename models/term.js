
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TermSchema = new Schema({
    group: {type:String},
    key: {type:String},
    translations:[{
      clientId:{type:Number,default:12309280},
      lang:{type:String},
      val:{type:String}
    }],
    updatedAt:{type:Date, default: Date.now},
    updatedBy:{type:String, default: ''},
    createdBy:{type:String, default: ''},
    createdAt:{type:String, default: Date.now},
    comments:{type:String, default: ''},
    softDelete:{type:Boolean,default: false}
});

module.exports = mongoose.model('Term', TermSchema);
