const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;


const paymentSchema = new Schema({
    merchantName: { type: String, required: true },
    merchantemail: { type: String, required: true },
    merchantphoneNumber : { type : Number, required : true },
    customerName: { type: String, required: true },
    customeremail: { type: String, required: true },
    customerphoneNumber : { type : Number, required : true },
    amount :{ type :Number, default: '00'},
    time : { type : Date, default: Date.now },
    customerId: { type: mongoose.Types.ObjectId,  ref: 'Customer'},
    merchantId: { type: mongoose.Types.ObjectId,  ref: 'Merchant'}


}, { versionKey: false });

paymentSchema.plugin(uniqueValidator)


module.exports = mongoose.model('Payment', paymentSchema);