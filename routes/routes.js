var express         = require('express')
var router          = express.Router()
var user            = require('../controllers/userController')
var masterdata      = require('../controllers/masterController')
var message         = require("../controllers/messageController")
var currtripinfo    = require("../controllers/currenttripinfoController")
var devices         = require("../controllers/deviceController")
var vehicles        = require("../controllers/vehicleController")
var authority       = require("../controllers/authorityController")
var profile         = require("../controllers/profileController")
var customer        = require("../controllers/customerController")
var carval          =  require("../controllers/calcvarController")
var georisk         =  require("../controllers/georiskController")
var eclass          =  require("../controllers/extensiveclassController")
var evalo           =  require("../controllers/extensivevalueController")
var drivebahavior   = require('../controllers/drivebehaviorController')
var intSvcs         = require('../controllers/integrationsvcController')

// route to login page
router.get('/login', user.login);

// route for login action
router.post('/login', user.doLogin);

// route for logout action
router.get('/logout', user.logout);

// route to register page
router.get('/register', user.register);

// route for register action
router.post('/register', user.doRegister);


router.get('/', require('permission')(), isLoggedIn, masterdata.list)
router.get('/trips', require('permission')(['administrador']), isLoggedIn, masterdata.carlist)


router.get('/alarms', require('permission')(['administrador','segurado']), isLoggedIn, vehicles.listbyUser)
router.post('/alarms/timeline/:device', isLoggedIn, message.getAlarm)
router.get('/analytics', require('permission')(['administrador','segurado']), isLoggedIn, vehicles.analyticsbyUser)
router.post('/getvoltage/:id', isLoggedIn, message.getVoltage)
// router.post('/getDuration/:id', isLoggedIn, message.getDurationbyUser)

// Locates
router.get('/message/gps/:id',  message.getgeo)
router.get('/message/gpslist/:id',  message.getgeolist)



// Dashboard
// Top 1
router.post('/cntTripByDay/:customer', isLoggedIn, currtripinfo.sumTripMileage)
router.post('/chartMileageMonth', isLoggedIn, currtripinfo.chartTripMileage)
// // Top 2
router.post('/cntIdleTime', isLoggedIn,  currtripinfo.sumIdleEngineTime)
router.post('/chartIdleTime', isLoggedIn,  currtripinfo.chartIdleEngineTime)
// // Top 3
router.post('/cntHACCOccur', isLoggedIn, currtripinfo.cntHarshAcc)
router.post('/chartHACCOccur', isLoggedIn, currtripinfo.chartHarshAcc)
// // Top 4
router.post('/cntHBRAKEOccur', isLoggedIn,  currtripinfo.cntHarshBrake)
router.post('/chartHBRAKEOccur', isLoggedIn,  currtripinfo.chartHarshBrake)


// / // From Index Monthly Grid
router.post('/cntDevConnected/:customer', isLoggedIn, devices.connecteds)
router.post('/cntDevDisconnected/:customer', isLoggedIn, devices.disconneteds)
router.post('/cntSOS', isLoggedIn, message.SOSCounter)
router.post('/cntReb', isLoggedIn, message.GuinchoCounter)
router.post('/cntMIL', isLoggedIn, message.MILCounter)
router.post('/sumGAS', isLoggedIn, message.GASsum)




// --------------------------------------------------------------------------------
// Drive Behavior
// router.get('/driverbehavior', require('permission')(['administrador','segurado']), isLoggedIn, drivebahavior.list)
router.get('/driverbehavior', isLoggedIn, drivebahavior.list)
router.get('/chartScoreEvolution', isLoggedIn, drivebahavior.scorehistory)
router.get('/timeline', isLoggedIn, drivebahavior.timeline)
// router.get('/scorerun',  drivebahavior.scorestub)

 // ++++++++++++++++++++++ Users CRUD +++++++++++++++++++++++++++
// List all Users
router.get('/users', require('permission')(['administrador','seguradora']),isLoggedIn,  user.list)
// Get single user by id
router.get('/users/show/:id', require('permission')(['administrador','seguradora']),isLoggedIn,  user.show)
// Create user
router.get('/users/new', require('permission')(['administrador','seguradora']),isLoggedIn, user.create)
// Save user
router.post('/users/save', require('permission')(['administrador','seguradora']), isLoggedIn, user.save)
// Edit user
router.get('/users/edit/:id', require('permission')(['administrador','seguradora']), isLoggedIn,  user.edit)
// Edit user
router.post('/users/update/:id', require('permission')(['administrador','seguradora']), isLoggedIn, user.update)
// Delete
router.post('/users/delete/:id', require('permission')(['administrador','seguradora']), isLoggedIn, user.delete)

// ++++++++++++++++++++++ Authority CRUD+++++++++++++++++++++++++++

router.get('/authorities', require('permission')(['administrador','seguradora']), isLoggedIn,  authority.list)

router.get('/authorities/show/:id', require('permission')(['administrador','seguradora']), isLoggedIn, authority.show)

router.get('/authorities/new', require('permission')(['administrador','seguradora']),isLoggedIn, authority.create)

router.post('/authorities/save', require('permission')(['administrador','seguradora']),isLoggedIn, authority.save)

router.get('/authorities/edit/:id', require('permission')(['administrador','seguradora']),isLoggedIn, authority.edit)

router.post('/authorities/update/:id', require('permission')(['administrador','seguradora']),isLoggedIn, authority.update)

router.post('/authorities/delete/:id', require('permission')(['administrador','seguradora']),isLoggedIn, authority.delete)

// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Profile +++++++++++++++++++++++++++

router.get('/profiles', require('permission')(['administrador','seguradora']),isLoggedIn,  profile.list)

router.get('/profiles/show/:id', require('permission')(['administrador','seguradora']),isLoggedIn,  profile.show)

router.get('/profiles/new', require('permission')(['administrador','seguradora']),isLoggedIn, profile.create)

router.post('/profiles/save', require('permission')(['administrador','seguradora']),isLoggedIn,  profile.save)

router.get('/profiles/edit/:id',  require('permission')(['administrador','seguradora']),isLoggedIn, profile.edit)

router.post('/profiles/update/:id', require('permission')(['administrador','seguradora']),isLoggedIn, profile.update)

router.post('/profiles/delete/:id', require('permission')(['administrador','seguradora']),isLoggedIn, profile.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 // ++++++++++++++++++++++ customer +++++++++++++++++++++++++++

router.get('/customers', require('permission')(['administrador','seguradora']), isLoggedIn, customer.list)
// Get single user by id
router.get('/customers/show/:id', require('permission')(['administrador','seguradora']),isLoggedIn, customer.show)
// Create user
router.get('/customers/new',require('permission')(['administrador','seguradora']), isLoggedIn, customer.create)
// Save user
router.post('/customers/save', require('permission')(['administrador','seguradora']),isLoggedIn, customer.save)
// Edit user
router.get('/customers/edit/:id', require('permission')(['administrador','seguradora']),isLoggedIn, customer.edit)
// Edit user
router.post('/customers/update/:id',require('permission')(['administrador','seguradora']),isLoggedIn,  customer.update)
// Delete
router.post('/customers/delete/:id', require('permission')(['administrador','seguradora']),isLoggedIn, customer.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Devices +++++++++++++++++++++++++++
// List all devices
router.get('/devices', require('permission')(['administrador','seguradora']),isLoggedIn, devices.list)
// Get single device by id
router.get('/devices/show/:id',require('permission')(['administrador','seguradora']), isLoggedIn,  devices.show)
// Create device
router.get('/devices/new', require('permission')(['administrador','seguradora']),isLoggedIn,  devices.create)
// Save device
router.post('/devices/save', require('permission')(['administrador','seguradora']),isLoggedIn,  devices.save)
// Edit device
router.get('/devices/edit/:id',require('permission')(['administrador','seguradora']), isLoggedIn,  devices.edit)
// Edit device
router.post('/devices/update/:id', require('permission')(['administrador','seguradora']),isLoggedIn,  devices.update)
// Delete
router.post('/devices/delete/:id', require('permission')(['administrador','seguradora']),isLoggedIn, devices.delete)

router.get('/devices/setup', require('permission')(['administrador','seguradora']),isLoggedIn,  devices.setuplist)

router.get('/devices/sendcmd/:id', require('permission')(['administrador','seguradora']),isLoggedIn,  devices.callttvapi)


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// / ++++++++++++++++++++++ Vehicle +++++++++++++++++++++++++++

router.get('/vehicles',require('permission')(['administrador','seguradora']), isLoggedIn,  vehicles.list)

router.get('/vehicles/show/:id',require('permission')(['administrador','seguradora']), isLoggedIn, vehicles.show)

router.get('/vehicles/new',require('permission')(['administrador','seguradora']), isLoggedIn, vehicles.create)

router.post('/vehicles/save',require('permission')(['administrador','seguradora']), isLoggedIn, vehicles.save)

router.get('/vehicles/edit/:id',require('permission')(['administrador','seguradora']), isLoggedIn, vehicles.edit)

router.post('/vehicles/update/:id',require('permission')(['administrador','seguradora']), isLoggedIn, vehicles.update)

router.post('/vehicles/delete/:id',require('permission')(['administrador','seguradora']), isLoggedIn,  vehicles.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   // ++++++++++++++++++++++ Variables +++++++++++++++++++++++++++
// List all Users
router.get('/calcvars',require('permission')(['administrador','seguradora']), isLoggedIn,  carval.list)
// Get single user by id
router.get('/calcvars/show/:id',require('permission')(['administrador','seguradora']),isLoggedIn,  carval.show)
// Create user
router.get('/calcvars/new',require('permission')(['administrador','seguradora']),isLoggedIn,  carval.create)
// Save user
router.post('/calcvars/save',require('permission')(['administrador','seguradora']), isLoggedIn, carval.save)
// Edit user
router.get('/calcvars/edit/:id',require('permission')(['administrador','seguradora']),isLoggedIn,  carval.edit)
// Edit user
router.post('/calcvars/update/:id',require('permission')(['administrador','seguradora']), isLoggedIn, carval.update)
// Delete
router.post('/calcvars/delete/:id',require('permission')(['administrador','seguradora']), isLoggedIn, carval.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Georisks +++++++++++++++++++++++++++
// List all georisk
router.get('/georisks',require('permission')(['administrador','seguradora']), isLoggedIn, georisk.list)
// Get single georisk by id
router.get('/georisks/show/:id',require('permission')(['administrador','seguradora']), isLoggedIn,  georisk.show)
// Create georisk
router.get('/georisks/new', require('permission')(['administrador','seguradora']),isLoggedIn,  georisk.create)
// Save georisk
router.post('/georisks/save',require('permission')(['administrador','seguradora']), isLoggedIn,  georisk.save)
// Edit georisk
router.get('/georisks/edit/:id',require('permission')(['administrador','seguradora']), isLoggedIn,  georisk.edit)
// Edit georisk
router.post('/georisks/update/:id',require('permission')(['administrador','seguradora']), isLoggedIn,  georisk.update)
// Delete
router.post('/georisks/delete/:id',require('permission')(['administrador','seguradora']), isLoggedIn, georisk.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// / ++++++++++++++++++++++ Ext. Classes +++++++++++++++++++++++++++
// List all ECLASS
router.get('/extclasses', require('permission')(['administrador','seguradora']),isLoggedIn, eclass.list)
// Get single ECLASS by id
router.get('/extclasses/show/:id', require('permission')(['administrador','seguradora']),isLoggedIn,  eclass.show)
// Create ECLASS
router.get('/extclasses/new', require('permission')(['administrador','seguradora']),isLoggedIn,  eclass.create)
// Save ECLASS
router.post('/extclasses/save', require('permission')(['administrador','seguradora']),isLoggedIn,  eclass.save)
// Edit ECLASS
router.get('/extclasses/edit/:id', require('permission')(['administrador','seguradora']),isLoggedIn,  eclass.edit)
// Edit ECLASS
router.post('/extclasses/update/:id',require('permission')(['administrador','seguradora']), isLoggedIn,  eclass.update)
// Delete
router.post('/extclasses/delete/:id',require('permission')(['administrador','seguradora']), isLoggedIn, eclass.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Ext. Value +++++++++++++++++++++++++++
// List all EVALUE
router.get('/extensivevalues',require('permission')(['administrador','seguradora']), isLoggedIn, evalo.list)
// Get single EVALUE by id
router.get('/extensivevalues/show/:id',require('permission')(['administrador','seguradora']), isLoggedIn,  evalo.show)
// Create EVALUE
router.get('/extensivevalues/new',require('permission')(['administrador','seguradora']), isLoggedIn,  evalo.create)
// Save EVALUE
router.post('/extensivevalues/save',require('permission')(['administrador','seguradora']), isLoggedIn,  evalo.save)
// Edit EVALUE
router.get('/extensivevalues/edit/:id',require('permission')(['administrador','seguradora']), isLoggedIn,  evalo.edit)
// Edit EVALUE
router.post('/extensivevalues/update/:id',require('permission')(['administrador','seguradora']), isLoggedIn,  evalo.update)
// Delete
router.post('/extensivevalues/delete/:id',require('permission')(['administrador','seguradora']), isLoggedIn, evalo.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Errors +++++++++++++++++++++++++++
router.get('/errors/403', function(req, res) {
    res.render('errors/403');
  });
 
// 
// router.get('/runstub', isLoggedIn, currtripinfo.stub);  

module.exports = router

function isLoggedIn(req, res, next) {            
        if (req.isAuthenticated())        
            return next();
    
        res.redirect('/login');
    }