var fs = require('fs'),
    _ = require('underscore'),
    q = require('q'),
    csvWriter = require('csv-write-stream'),
    path = require('path'),
    parse = require('csv-parse/lib/sync'),
    json2csv = require('json2csv');


    function includesKeys(list,area,key){
      var returnVal = false;
      _.each(list,function(obj){
        if((obj.area == area)&&(obj.key == key)){
          returnVal = true;
        }
      })
      return returnVal;
    }

    function writeCsv(returnArr){
      var fields = ['area', 'key', 'es-SP'];
      json2csv({ data: returnArr, fields: fields}, function(err, csv) {
        if (err) console.log(err);
        fs.writeFile(__dirname+'/../file.csv', csv, function(err) {
          if (err) throw err;
          console.log('file saved');
        });
      });
    }


    module.exports = function(){
    var child = fs.readFileSync(__dirname + '/i18n/translation.ES.csv');
    var master = fs.readFileSync(__dirname + '/i18n/masterLang.SP.csv');
    var childRecord = parse(child, {columns: true});
    var masterRecord = parse(master,{columns:true});
    var returnArray = masterRecord;
    //replace existing
    for (var i = 0; i < childRecord.length; i++) {
      for (var j = 0; j < masterRecord.length; j++) {
        if((masterRecord[j].area == childRecord[i].area) && (childRecord[i].key == masterRecord[j].key)){
          console.log(childRecord[i],'childRecord');
          returnArray[j]['es-SP'] = childRecord[i]['es-LA'];
        }
      }
    }
    //insert new
    _.each(childRecord,function(obj){
      if(!includesKeys(masterRecord,obj.area,obj.key)){
        var newObj = {
          area: obj.area,
          key:obj.key,
          'es-SP': obj['es-LA']
        }
        // console.log(newObj,'obj');
        returnArray.push(newObj);
      }
    })
    //write to csv
    writeCsv(returnArray);
    }
