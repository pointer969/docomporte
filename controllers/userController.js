// 'use strict';
var mongoose        = require('mongoose')
var passport        = require('passport')
var User            = require('../models/User')
var Profile         = require('../models/userProfile')
var Authority       = require('../models/UserAuthority')
var Customer        = require('../models/Customer')
var bcrypt          = require('bcrypt')
var jwt             = require('jsonwebtoken')
var config          = require('../lib/config')
var timezones       = require('../lib/timezones.json')
var async           = require('run-async')

var userController = {}

userController.home = function(req, res) {
  res.render('index', { user : req.user })
 }


userController.register = function(req, res) {
  res.render('register')
 }

userController.doRegister = function(req, res) {
  
  var user = new User({ 
    fullname: req.body.fullname, 
    email: req.body.email, 
    userProfile: "administrador",    
    active: true
  })   


  User.register( user,req.body.password, function(err, user) {
    if (err) {
      // return res.render('register', { user : user });
      console.log('Error on User registration:'+ err)
    }

    // passport.authenticate('local')(req, res, function () {
      res.redirect('/login');
    // });
  })
 }

userController.login = function(req, res) {
  res.render('login', {title:'DriveOn Integrator'})
 }


userController.doLogin = function(req, res, next) {
 
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
        return next(err); 
    }

    if (!user) { 
      req.flash('alert-danger', "Usuário não encontrado, Favor revisar usuário e senha.")  
      // return res.send({ success : false, message : 'authentication failed' });
      return res.redirect('/login') 
      // res.render('login', {title:'DriveOn'})
    }
    
    req.logIn(user, function(loginErr) {      
      if (loginErr) { 
          return next(loginErr); 
      }
      // return res.send({ success : true, message : 'authentication succeeded' });
       return res.redirect('/');
    });
  })(req, res, next);
 }


userController.logout = function(req, res) {
  req.logout()
  res.redirect('/')
 }


/**
 * CRUD
 */ 
userController.list = function(req, res) {   
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  var page = (req.query.page > 0 ? req.query.page : 1) - 1;
  var _id = req.query.item;
  var limit = 10;
  var uinfo = req.user;
 

  User.find().populate({
        path:'profile', 
        select:'ProfileDescription',
        match:{ active: true},
        options: { sort: { userProfile: -1 }}
      })
      .populate({
        path:'authority', 
        select:'AuthorityDescription',
        match:{ active: true },
        options: { sort: { authority: -1 }}
      })
      .populate({
        path:'customer', 
        select:'fullname',
        match:{ active: true },
        options: { sort: { fullname: -1 }}
      })
      .limit(limit)
      .skip(limit * page).exec(function(err, users){
        // console.log('user infoo:'+ users)
        if(err){          
          req.flash('alert-danger', 'Erro ao Listar os usuários:'+err)  
          res.render('errors/500', {message:req.flash});                    
        }else{
          User.count().exec(function(err, count){
            if (count > 0) {
                   res.render('users/index',
                    { 
                      title: 'DriveOn Integrator | Usuários', 
                      list: users,
                      user_info: uinfo,
                      baseuri: baseurl,
                      page: page + 1,
                      pages: Math.ceil(count / limit)
                    }
                  )
                }else{
                  res.render('users/new.jade', {title: 'DriveOn | Novo Usuário',baseuri:baseurl, tmz: timezones});
                }     
          })      
        }         
      }) 
 } 

userController.create = function(req, res){         
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  
  Profile
    .find({active: true}).exec(function(err, profile){
      if (err) {
        switch (err.code)
        {
          case 11000: 
              req.flash('alert-danger', 'Estes dados já existem no registro de usuarios.')    
              break;        
          default: 
              req.flash('alert-danger', "Erro ao carregar os perfis de usuário:"+ err)  
              break;
        }   
      }else{  
          Authority
            .find({active: true}).exec(function(err, authority){
              if (err) {
                switch (err.code)
                {
                  case 11000: 
                      req.flash('alert-danger', 'Estes dados já existem no registro de usuarios.')    
                      break;        
                  default: 
                      req.flash('alert-danger', "Erro ao carregar as autoridades de usuário:"+ err)  
                      break;
                }   
              }else{ 
                  Customer
                    .find({active: true}).exec(function(err, customer){
                      if (err) {
                        switch (err.code)
                        {
                          case 11000: 
                              req.flash('alert-danger', 'Estes dados já existem no registro de usuarios.')    
                              break;        
                          default: 
                              req.flash('alert-danger', "Erro ao carregar as contas:"+ err)  
                              break;
                        }   
                      }else{
                        res.render('users/new.jade', { title: 'DriveOn | Novo Usuário',
                            baseuri: baseurl,
                            profiles: profile,
                            authorities: authority,
                            customers: customer,
                            tmz: timezones
                          })
                      } 
                  })    
              } 
          })  
      }
    })  



    
 }   

userController.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  if (req.params.id != null || req.params.id != undefined) {      
  User
  .findOne({_id: req.params.id})
  .populate({
    path:'profile', 
    select:'ProfileDescription',
    match:{ active: true},
    options: { sort: { userProfile: -1 }}
  })
  .populate({
    path:'authority', 
    select:'AuthorityDescription',
    match:{ active: true },
    options: { sort: { AuthorityDescription: -1 }}
  })
  .populate({
    path:'customer', 
    select:'fullname',
    match:{ active: true },
    options: { sort: { fullname: -1 }}
  })
  .exec(function (err, user) {
    // console.log('user='+user)
        if (err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Estes dados já existem no registro de usuarios.')    
                break;        
            default: 
                req.flash('alert-danger', "Erro ao exibir:"+ err)  
                break;
          }   
        } else {     
          req.flash('alert-info', 'Dados salvos com sucesso!')       
          res.render('users/show', {users: user, baseuri:baseurl, tmz: timezones});
        }
      })
  } else {    
    res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
  }
 }    

userController.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  User.findOne({_id: req.params.id}).exec(function (err, uuser) {
        if (err) {          
            req.flash('alert-danger', "Erro ao editar:"+ err)              
        } else {          
          Profile.find().exec( function (err, profile){
            if(err){
              req.flash('alert-danger', "Erro ao obter perfis:"+ err)  
            }else{
              Authority.find().exec( function (err, authority){
               if(err){
                  req.flash('alert-danger', "Erro ao obter autoridade:"+ err) 
               } else {
                  Customer.find().exec( function (err, customer){
                    if(err){
                       req.flash('alert-danger', "Erro ao obter autoridade:"+ err) 
                    } else {
                    res.render('users/edit', {users: uuser, baseuri:baseurl, profiles:profile, authorities: authority, customers: customer, tmz: timezones})
                    }
                  })
               }
              })  
            }            
          })
          
        }
      })
  }

userController.update = function(req, res){  
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  var uinfo = req.user
  var npwd = req.body.password

   User.findByIdAndUpdate(
        req.params.id,          
        { $set: 
            { 
              fullname: req.body.fullname, 
              email: req.body.email, 
              userProfile: req.body.profile,
              authority: req.body.authority,
              customer: req.body.customer,
              gender: req.body.gender,
              active: req.body.active,              
              timezone: req.body.timezone,
              modifiedBy: uinfo.email
            }
        }, 
        { new: true }, 
 function (err, user) {                                                              
      if (err) {         
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Estes dados já existem no registro de perfis.')    
               break;        
           default: 
               req.flash('alert-danger', "Erro ao atualizar:"+ err)  
               break;
        }   
        res.render("users/edit", {users: req.body, baseuri:baseurl, tmz: timezones})
      }else{
        User.findByUsername(user.email).then(function(sanitizedUser){
          if (sanitizedUser){
              sanitizedUser.setPassword(npwd, function(){
                  sanitizedUser.save();
                  req.flash('alert-info', 'Dados salvos com sucesso!') 
              })
          } else {
              req.flash('alert-danger', 'Falha ao definir o usuario para troca a senha. Favor contactar o Administrado.') 
          }          
        },function(err){
          req.flash('alert-danger', "Erro ao atualizar:"+ err) 
          res.render("users/edit", {users: req.body, baseuri:baseurl})
        })
        res.redirect("/users/show/"+user._id)
      }
    })
  }   

userController.save  =   function(req, res){
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  var ulogin =  ''
  
  if (req.user){    
    ulogin =  req.user.email
  }

  var user = new User({ 
    fullname: req.body.fullname, 
    email: req.body.email, 
    userProfile: req.body.profile,
    authority: req.body.authority,
    customer: req.body.customer,
    gender: req.body.gender,
    timezone: req.body.timezone,
    active: req.body.active,
    modifiedBy: ulogin
  })      
  User.register(user, req.body.password, function(err, user) {      
    if(err) {  
      switch (err.code)
      {
         case 11000: 
             req.flash('alert-danger', 'Estes dados já existem no registro de usuários.')    
             break;        
         default: 
             req.flash('alert-danger', "Erro ao salvar:"+ err)  
             break;
      }              
      userController.create
    } else {          
      req.flash('alert-info', 'Dados salvos com sucesso!')  
      res.redirect('/users/show/'+user._id)
    }
   })
   }

userController.delete = function(req, res){    
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  User.remove({_id: req.params.id}, function(err) {
      if(err) {
        req.flash('alert-danger', "Erro ao deletar:"+ err)          
      } else {    
        req.flash('alert-info', 'Dados removidos com sucesso!')        
        res.redirect("/users");
      }
    })
 }


module.exports = userController