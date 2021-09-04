const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
	walletId: { type: String },
	amount: { type: Number, default:0, get: getDecimalNumber, set: setDecimalNumber },
	balance: { type: Number },
	description: { type: String, default: 'N/A' },
	type: { type: String, Enum: [ 'CREDIT', 'DEBIT' ], default: 'CREDIT' },
	date: { type: Date, default: Date.now }
}, {
    timestamps: false,
    versionKey: false
});

function getDecimalNumber(val) {    return ( parseFloat(parseFloat(val).toFixed(4)) ); }
function setDecimalNumber(val) {    return ( parseFloat(parseFloat(val).toFixed(4)) ); }

module.exports = mongoose.model('transaction', TransactionSchema);