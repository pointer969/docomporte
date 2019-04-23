var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
// var bcrypt    = require('bcrypt')
var mongooseLogs = require('mongoose-activitylogs')

var ExtensiveValueSchema = new Schema({    
    value: {
        type: String,
        lowercase: false,
        required: true
    },
    description: String,
    active: {
         type: Boolean,
         required: true
    },
    class: {type: mongoose.Schema.Types.ObjectId, ref: 'do_sys_m00'},
},
{
    timestamps:true
}
)

ExtensiveValueSchema.plugin(mongooseLogs, {
    schemaName: "extensive values",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
 })

var extvalue = mongoose.model('do_sys_m01', ExtensiveValueSchema)

module.exports = extvalue