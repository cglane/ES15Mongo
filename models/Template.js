var mongoose = require('mongoose'),
    q = require('q'),
    Schema = mongoose.Schema,
    ejs = require('ejs'),
    templateConnection = require('../mongoConnections/templates.js');

var templateSchema = new Schema({
  custId: String,
  templates: {}
});

templateSchema.methods.translateMessages = function(recipients, data, langFiles, msgName){
  var messages = [];
  var self = this;
  data = data || {};
  if(recipients){
    recipients.forEach(function(recipient){
      console.log('rec', recipient);
      var template = self.templates[msgName];
      var lang = (!recipient.lang || recipient.lang == 'null') ? langFiles.defLang : recipient.lang;
      messages.push(buildMsg(template, data, langFiles.langs[lang], recipient));
    });
    for(var i = 0; i < messages.length; i++){
      if(messages[i].error){
        return {error: messages[i].error};
      }
    }
    return messages;
  } else {
    return {error: "no recipients found"};
  }
};

function buildMsg(template, data, lang, rec){
  data.lang = lang;
  data.recipient = rec;
  var message = {
    s_sender: (template.sender || "Administrator"),
    s_type: (template.msgType || "default"),
    s_iconclass: (template.iconclass || "fa fa-envelope-o"),
    s_prompt: (template.msgPrompt || ""),
    s_route: (template.route || ""),
    s_routeparams: {},
    hideInPortal: (template.emailOnly || false),
    portal_only: (template.portalOnly || false)
  },
    s_body,
    s_subject;

  try{
    s_body = ejs.render(template.body, data).replace(/&lt;%/g,'<%').replace(/%&gt;/g, '%>');
  } catch(err) {
    return {error: err.toString()};
  }
  try{
    s_subject = ejs.render(template.subject, data).replace(/&lt;%/g, '<%').replace(/%&gt;/g, '%>');
  } catch(err) {
    return {error: err.toString()};
  }
  for(var key in template.routeparams){
    var keyArr = template.routeparams[key].split('.');
    var param = data;
    keyArr.forEach(function(key){
      param = param[key];
    });
    message.s_routeparams[key] = param;
  }
  message.s_routeparams = JSON.stringify(message.s_routeparams);
  message[rec.rel] = rec.id;
  try{
    message.s_body = encodeURIComponent(ejs.render(s_body, data));
  } catch(err) {
    return {error: err.toString()};
  }
  try{
    message.s_subject = encodeURIComponent(ejs.render(s_subject, data));
  } catch(err) {
    return {error: err.toString()};
  }
  //until all messages have been redone so that email templates can be changed
  try{
    message.email_body = encodeURIComponent(ejs.render(s_body, data));
  } catch(err) {
    return {error: err.toString()};
  }
  try{
    message.email_subject = encodeURIComponent(ejs.render(s_subject, data));
  } catch(err) {
    return {error: err.toString()};
  }
  return message;
}

var Template = templateConnection.model('Template', templateSchema);
module.exports = Template;
