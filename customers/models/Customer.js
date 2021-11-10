const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A customer\'s name must be provided'],
    },
    age: {
        type: Number,
        required: [true, 'A customer\'s age must be supplied'],
    },
    address: {
        type: String,
        required: [true, 'An address of the customer must be provided'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
