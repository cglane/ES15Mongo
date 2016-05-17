var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var config = require('../config');
var termsExample = require('./exampleJSON.json');
var transExample = require('./transExampleJSON.json');
var singleTerm = require('./singleExample.json');
      // I want to create a connection with the database, and when I'm done, I call done().
      var url = 'http://localhost:3000';
      before(function(done){
        mongoose.connect(config.database);
        done();
      })
      describe('Router', function(){
        it('should be able to start', function(done) {
        request(url)
      	 .get('/api/hello')
      	  .end(function(err, res) {
              if(err)throw err;
              var items = JSON.parse(res.status);
              console.log(items,'res')
              res.status.should.be.equal(200);
                done();
              });
          });
        })
        describe('APi',function(){
          it('should be able to create term',function(done){
            request(url)
              .post('/api/create_term')
              .send(termExample)
              .expect(200)
              .end(function(err,res){
                if(err) throw err;
                res.body.group.should.equal(termExample.group);
                done();
              })
            })
          it('should be able to edit term',function(done){
            request(url)
              .put('/api/edit_term')
              .send(termExample)
              .expect(200)
              .end(function(err,res){
                if(err) throw err;
                res.body.clientId.should.equal(termExample.clientId)
              })
          })
          it('should be able to set softDelete',function(done){
            request(url)
              .delete('/api/delete_term')
              .end(function(err,res){
                if(err)throw err;
                res.body.softDelete.should.equal(1);
              })
          })
          it('should be able to add a translation',function(done){
            request(url)
              .post('/api/add_translation')
              .send(transExample)
              .end(function(err,res){
                if(err)throw err;
                res.body.lang.should.equal(transExample.lang);
              })
          })
          it('should return accurate key values',function(done){
            request(url)
              .get('/api/get_localization')
              .set('clientId',12345)
              .end(function(err,res){
                if(err)throw err;
                res.body.fishing.should.equal(examples.companyExample.translations[0].val)
              })
          })
          
        })
        // describe('Data Upload',function(){
        //   it('should create new terms from json',function(done){
        //     request(url)
        //       .post('/upload_create_file')
        //       .send(examples.uploadData)
        //       .end(function(err,res){
        //         if(err)throw err;
        //         res.status.should.be.equal(200);
        //       })
        //   })
        // })
