var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
var config = require('../config');
var termsExample = require('./exampleJSON.json');
var examples = require('./examples.js');
      // I want to create a connections with the database, and when I'm done, I call done().
      var objectId,key;
      var url = 'http://localhost:3000';
      var clientId = 12345;

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
              res.status.should.be.equal(200);
                done();
              });
          });
          it('should be able to start', function(done) {
          request(url)
        	 .get('/api/hello')
        	  .end(function(err, res) {
                if(err)throw err;
                res.status.should.be.equal(200);
                  done();
                });
            });
        })

        describe('APi',function(){

          it('should delete term',function(done){
            request(url)
              .delete('/api/delete_term/')
              .end(function(err,res){
                if(err) throw err;
                res.status.should.be.equal(200)
                done();
              })
            })

          it('should be able to create term',function(done){
            request(url)
              .post('/api/create_term')
              .send(examples.singleExample)
              .expect(200)
              .end(function(err,res){
                if(err) throw err;
                objectId = res.body._id;
                key = res.body.key;
                // res.body.group.should.equal(examples.singleExample.group);
                res.status.should.equal(200);
                done();
              })
            })

          it('should be able to edit term',function(done){
            request(url)
              .put('/api/edit_term/'+objectId)
              .send(examples.updateExample)
              .expect(200)
              .end(function(err,res){
                if(err) throw err;
                res.status.should.equal(200)
                // res.body.createdBy.should.equal(examples.updateExample.createdBy)
              })
          })

          it('should be able to add a translation',function(done){
            request(url)
              .post('/api/add_translation/'+key)
              .send(examples.transExample)
              .end(function(err,res){
                if(err)throw err;
                res.status.should.equal(200)
                // res.body.lang.should.equal(transExample.lang);
              })
          })

            it('should be able to get one term object',function(done){
              request(url)
                .get('/api/get_one_term/'+examples.singleExample.key)
                .end(function(err,res){
                  if(err)throw err;
                  res.status.should.equal(200);
                })
            })

          it('should return accurate key values',function(done){
            request(url)
              .get('/api/get_all_terms/')
              .end(function(err,res){
                if(err)throw err;
                res.body.fishing.should.equal(examples.companyExample.translations[0].val)
              })
          })

          it('should return company specific translations by group',function(done){
            request(url)
              .get('/api/get_all_translations_group/'+examples.singleExample.group+'/'+'en-us'+'/'+examples.transExample.clientId)
              .end(function(err,res){
                if(err)throw err;
                res.status.should.equal(200);
                // res.body.fishing.should.equal(examples.companyExample.translations[0].val)
              })
          })
          it('should be able to set softDelete',function(done){
            request(url)
              .delete('/api/soft_delete/'+objectId)
              .end(function(err,res){
                if(err)throw err;
                res.status.should.equal(200);
                // res.body.softDelete.should.equal(true);
              })
          })


        })
        describe('Data Upload',function(){
          it('should create new terms from json',function(done){
            request(url)
              .post('/api/upload_create_file/common/12345/en-us')
              .send(examples.fileAddress)
              .end(function(err,res){
                if(err)throw err;
                res.status.should.be.equal(200);
              })
          })
        })
