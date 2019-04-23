var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var compType =['Seguradora','Rent a Car','Frotista','Outros']

var DO_COM_M00Schema = new Schema({
    company : String, 
    name : String, 
    commercialName : String, 
    segmento: {
        type: String,
        enum: compType
    },
    address1 : String, 
    address2 : String, 
    address3 : String, 
    district : String, 
    city : String, 
    state : String, 
    country : String, 
    zipcode : String, 
    email : String, 
    activeStatus : String, 
    createdAt : Date, 
    createdBy : String, 
    updatedAt : Date, 
    updatedBy : String 
})

module.exports =  mongoose.model('do_com_m00', DO_COM_M00Schema)