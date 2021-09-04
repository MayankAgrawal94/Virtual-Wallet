const mongoose = require('mongoose');

const WalletSchema = mongoose.Schema({
	balance : { type: Number, default: 0, get: getDecimalNumber, set: setDecimalNumber },
	name: { type: String, required: true },
	date: { type: Date, default: Date.now },
}, {
    timestamps: false,
    versionKey: false
});

function getDecimalNumber(val) {    return ( parseFloat(parseFloat(val).toFixed(4)) ); }
function setDecimalNumber(val) {    return ( parseFloat(parseFloat(val).toFixed(4)) ); }

module.exports = mongoose.model('wallets', WalletSchema);