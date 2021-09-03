const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;


const customerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true , unique : true},
    password: { type: String , required: true},
    profilePic :{type: String },
    pin : {type :Number, required : true },
    countryCode : {type : Number, required : true},
    phoneNumber : { type : Number, required : true},
    resetToken:{ type:String },
    expireToken:{ type:Date }
}, { versionKey: false });

customerSchema.plugin(uniqueValidator)


module.exports = mongoose.model('Customer', customerSchema);