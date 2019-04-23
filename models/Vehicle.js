var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var DO_CAR_M00Schema = new Schema({
    plate       : {
        type: String,
        unique: true,
        lowercase: false,
        required: true
    },
    device      : { type: Schema.Types.ObjectId, ref: 'do_dev_m00' }, 
    vin         : String,    
    model       : String,
    color       : String,
    state       : String,
    customer    : { type: Schema.Types.ObjectId, ref: 'do_cus_m00' },
    motor       : String,
    fueltype    : String,
    manufYear   : String,
    active      : Boolean
},
{
    timestamps:true
})

DO_CAR_M00Schema.plugin(mongooseLogs, {
  schemaName: "vehicle",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('do_car_m01', DO_CAR_M00Schema)