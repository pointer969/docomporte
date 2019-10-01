var mongoose        = require("mongoose")
var User            = require("../models/User")
var moment          = require('moment')
var passport        = require('passport')

var apiController = {}

// Authentication
apiController.doLogin = function(req, res){
  var arrayMessage = []  
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
        var retMsg = { success : false, message : err}
        arrayMessage.push(retMsg)
        res.json(arrayMessage)   
    }else if(!user) { 
      var retMsg = { success : false, message : 'Usuário não encontrado, favor revisar usuário e senha.'}
      arrayMessage.push(retMsg)
      res.json(arrayMessage)   
    }
    
    req.logIn(user, function(loginErr) {      
      if (loginErr) { 
        var retMsg = { success : false, message : loginErr}
        arrayMessage.push(retMsg)
        res.json(arrayMessage)  
      }else{
        var retMsg = { success : true, message : 'Usuário autenticado com sucesso!'}
        arrayMessage.push(retMsg)
        res.json(arrayMessage)   
      }
    });
  })(req, res);
}