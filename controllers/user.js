
var express = require('express');
var token_manager = require('./token');
var mongoose = require('mongoose')
  , User = mongoose.model('User');
var Status = require('../models/Status');

module.exports = {
  create : function(req, res){
    User.find({
      username : req.body.username
    }, function(err, user_found){
      if(err){
        status = Status.STATUS_FAILED;
        message = "Could not create User: " + err;

        res.json({
          status : status,
          message : message
        });
      }

      if(user_found){
        status = Status.STATUS_FAILED;
        message = "Username already found"

        res.json({
          status : status,
          message : message
        });
      } else{
        User.create(req.body , function(err, user){
              status = Status.STATUS_OK;
              message = "";

              if(err){
                status = Status.STATUS_FAILED;
                message = "Could not create User: " + err;

                res.json({
                  status : status,
                  message : message
                });
              }

              token_manager.create(user, function(success_data){
                res.json({
                  status : Status.STATUS_OK,
                  message : "successfully created user",
                  data : {
                    token_id : success_data["token_id"]
                  }
                });
              }, function(err_data){
                message = err_data["message"];
                res.json({
                  status : Status.STATUS_FAILED,
                  message : message
                });
              });
        });
      }
    });
  },

  login : function(req, res){
    var username = req.body.username;
    User.findOne({
      username : username
    }, function(err, user){
      if(err){
        status = Status.STATUS_FAILED;
        message = "error finding user";

        res.json({
          status : status,
          message : message
        });
      }


      if(!user){
        status = Status.STATUS_FAILED;
        message = "User does not exist";

        res.json({
          status : status,
          message : message
        });
      } else{
        token_manager.update(user, function(success_data){
          res.json({
            status : Status.STATUS_OK,
            message : "successful login",
            data : {
              token_id : success_data["token_id"]
            }
          });
        }, function(error_data){
          res.json({
            status : Status.STATUS_FAILED,
            message : error_data["message"]
          });
        });
      }
    });
  }

}

